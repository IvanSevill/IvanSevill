#!/usr/bin/env bash
set -Eeuo pipefail

readonly REPO_DIR="/home/ivansevill/projects/portfolio"
readonly COMPOSE_FILE="/home/ivansevill/infra/stacks/services/docker-compose.yml"
readonly COMPOSE_PROJECT="services"
readonly SERVICE="portfolio"
readonly EXPECTED_HOST="ivansevill-vm"
readonly EXPECTED_ORIGIN="https://github.com/IvanSevill/IvanSevill.git"
readonly SOURCE_URL="https://github.com/IvanSevill/IvanSevill"
readonly PRODUCTION_IMAGE="ivansevill/portfolio:production"
readonly RELEASE_DIR="/home/ivansevill/infra/releases/portfolio"
readonly LOCK_FILE="/tmp/portfolio-deploy.lock"
readonly SCRIPT_PATH="$REPO_DIR/scripts/deploy-vps.sh"
readonly SHA_PATTERN='^[0-9a-f]{40}$'

CANDIDATE_CONTAINER=""
NATIVE_BINDINGS_DIR=""
BUILD_CONTEXT=""
PREVIOUS_IMAGE_ID=""
ROLLBACK_REQUIRED=0

usage() {
  cat <<'EOF'
Usage:
  scripts/deploy-vps.sh --check
  scripts/deploy-vps.sh --dry-run
  scripts/deploy-vps.sh --deploy <full-commit-sha>
  scripts/deploy-vps.sh --help

Modes:
  --check     Report deployment readiness without changing Git, npm, or Docker.
  --dry-run   Run every safe prerequisite check without fetch, pull, npm, build,
              image, container, or service mutations.
  --deploy    Deploy exactly the approved origin/main commit after an interactive
              full-SHA confirmation. This is the only mode that mutates state.
EOF
}

ok() {
  printf '[OK] %s\n' "$1"
}

fail() {
  printf '[FAIL] %s\n' "$1" >&2
}

check_command() {
  local command_name=$1
  if command -v "$command_name" >/dev/null 2>&1; then
    ok "Command available: $command_name"
    return 0
  fi
  fail "Required command is unavailable: $command_name"
  return 1
}

check_host_identity() {
  local failed=0
  local host_name

  host_name=$(hostname -s 2>/dev/null || true)
  if [[ "$host_name" == "$EXPECTED_HOST" ]]; then
    ok "Host identity matches $EXPECTED_HOST"
  else
    fail "Host identity mismatch; expected $EXPECTED_HOST"
    failed=1
  fi

  if ! command -v tailscale >/dev/null 2>&1; then
    fail "Tailscale CLI is unavailable; identity cannot be verified"
    return 1
  fi

  if tailscale status --json 2>/dev/null | PORTFOLIO_EXPECTED_HOST="$EXPECTED_HOST" node -e '
    let input = "";
    process.stdin.on("data", chunk => input += chunk);
    process.stdin.on("end", () => {
      try {
        const self = JSON.parse(input).Self;
        process.exit(self?.Online === true && self?.HostName === process.env.PORTFOLIO_EXPECTED_HOST ? 0 : 1);
      } catch {
        process.exit(1);
      }
    });
  '; then
    ok "Tailscale self identity is online and matches $EXPECTED_HOST"
  else
    fail "Tailscale self identity is offline, unreadable, or unexpected"
    failed=1
  fi

  return "$failed"
}

check_repository() {
  local failed=0
  local branch
  local origin

  if [[ ! -d "$REPO_DIR/.git" ]]; then
    fail "Repository is missing at $REPO_DIR"
    return 1
  fi

  branch=$(git -C "$REPO_DIR" symbolic-ref --quiet --short HEAD 2>/dev/null || true)
  if [[ "$branch" == "main" ]]; then
    ok "Repository is attached to main"
  else
    fail "Repository must be attached to main; detached HEAD is not allowed"
    failed=1
  fi

  origin=$(git -C "$REPO_DIR" remote get-url origin 2>/dev/null || true)
  if [[ "$origin" == "$EXPECTED_ORIGIN" ]]; then
    ok "Origin matches the canonical GitHub repository"
  else
    fail "Origin must be exactly $EXPECTED_ORIGIN"
    failed=1
  fi

  if [[ -z "$(git -C "$REPO_DIR" status --porcelain --untracked-files=normal)" ]]; then
    ok "Repository worktree is clean"
  else
    fail "Repository is dirty; stop and investigate without reset, clean, or stash"
    failed=1
  fi

  if git -C "$REPO_DIR" show-ref --verify --quiet refs/remotes/origin/main; then
    ok "Local origin/main reference exists"
  else
    fail "Local origin/main reference is missing"
    failed=1
  fi

  return "$failed"
}

check_compose_contract() {
  local rendered
  local contract_context="/tmp/portfolio-compose-context-contract"

  if [[ ! -r "$COMPOSE_FILE" ]]; then
    fail "Pending production preparation: Compose file is not readable at $COMPOSE_FILE"
    return 1
  fi

  if ! rendered=$(PORTFOLIO_IMAGE="$PRODUCTION_IMAGE" PORTFOLIO_BUILD_CONTEXT="$contract_context" \
    docker-compose --project-name "$COMPOSE_PROJECT" --file "$COMPOSE_FILE" config --format json); then
    fail "Pending production preparation: Compose configuration does not render as JSON"
    return 1
  fi
  if ! printf '%s' "$rendered" | PORTFOLIO_EXPECTED_IMAGE="$PRODUCTION_IMAGE" \
    PORTFOLIO_EXPECTED_CONTEXT="$contract_context" node -e '
      let input = "";
      process.stdin.on("data", chunk => input += chunk);
      process.stdin.on("end", () => {
        try {
          const service = JSON.parse(input).services?.portfolio;
          const args = service?.build?.args;
          const keys = ["SOURCE_URL", "VCS_REF", "VERSION"];
          const valid = service?.image === process.env.PORTFOLIO_EXPECTED_IMAGE
            && service?.build?.context === process.env.PORTFOLIO_EXPECTED_CONTEXT
            && keys.every(key => Object.prototype.hasOwnProperty.call(args ?? {}, key));
          process.exit(valid ? 0 : 1);
        } catch { process.exit(1); }
      });
    '; then
    fail "Pending production preparation: services.portfolio must render the required image, build context, and provenance args"
    return 1
  fi
  ok "Rendered services.portfolio contract is valid"
}

run_prerequisites() {
  local failed=0
  local command_name

  for command_name in curl docker docker-compose flock git hostname node npm tailscale tar; do
    check_command "$command_name" || failed=1
  done

  check_host_identity || failed=1
  check_repository || failed=1
  check_compose_contract || failed=1

  return "$failed"
}

acquire_lock() {
  exec 9>"$LOCK_FILE"
  if ! flock -n 9; then
    fail "Another portfolio deployment process holds $LOCK_FILE"
    exit 1
  fi
}

cleanup_runtime() {
  if [[ -n "$CANDIDATE_CONTAINER" ]] && command -v docker >/dev/null 2>&1; then
    docker rm -f "$CANDIDATE_CONTAINER" >/dev/null 2>&1 || true
  fi
  if [[ "$NATIVE_BINDINGS_DIR" == /tmp/portfolio-native-bindings.* ]]; then
    rm -rf "$NATIVE_BINDINGS_DIR"
  fi
  if [[ "$BUILD_CONTEXT" == /tmp/portfolio-build-context.* ]]; then
    rm -rf "$BUILD_CONTEXT"
  fi
}

confirm_deployment() {
  local confirmation

  if [[ ! -t 0 ]]; then
    fail "Deployment confirmation requires an interactive terminal"
    exit 1
  fi

  printf 'Approved commit: %s\n' "$REQUESTED_SHA"
  read -r -p 'Type the full commit SHA to authorize Git, npm, and Docker mutations: ' confirmation
  if [[ "$confirmation" != "$REQUESTED_SHA" ]]; then
    fail "Confirmation did not match the approved commit SHA"
    exit 1
  fi
}

wait_for_container_health() {
  local container_id=$1
  local description=$2
  local attempts=${3:-30}
  local status
  local attempt

  for ((attempt = 1; attempt <= attempts; attempt++)); do
    status=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' "$container_id" 2>/dev/null || true)
    case "$status" in
      healthy)
        ok "$description is healthy"
        return 0
        ;;
      unhealthy|missing)
        fail "$description health status is $status"
        return 1
        ;;
    esac
    sleep 2
  done

  fail "$description did not become healthy within $((attempts * 2)) seconds"
  return 1
}

smoke_https() {
  local url
  for url in \
    "https://ivansevill.com/" \
    "https://www.ivansevill.com/" \
    "https://ivansevill.com/healthz"; do
    if curl --fail --silent --show-error --location --max-time 15 --output /dev/null "$url"; then
      ok "HTTPS smoke passed: $url"
    else
      fail "HTTPS smoke failed: $url"
      return 1
    fi
  done
}

verify_running_release() {
  local container_id=$1
  local expected_image_id=$2
  local expected_revision=$3
  local description=$4
  local running_image_id
  local running_revision

  running_image_id=$(docker inspect --format '{{.Image}}' "$container_id") || return 1
  if [[ "$running_image_id" != "$expected_image_id" ]]; then
    fail "$description image ID does not match the expected image"
    return 1
  fi
  running_revision=$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$running_image_id") || return 1
  if [[ "$running_revision" != "$expected_revision" ]]; then
    fail "$description OCI revision does not match $expected_revision"
    return 1
  fi
  ok "$description image ID and OCI revision are verified"
}

show_diagnostics() {
  printf '%s\n' '--- portfolio service diagnostics ---' >&2
  PORTFOLIO_IMAGE="$PRODUCTION_IMAGE" docker-compose \
    --project-name "$COMPOSE_PROJECT" \
    --file "$COMPOSE_FILE" \
    ps "$SERVICE" >&2 || true
  PORTFOLIO_IMAGE="$PRODUCTION_IMAGE" docker-compose \
    --project-name "$COMPOSE_PROJECT" \
    --file "$COMPOSE_FILE" \
    logs --no-color --tail=200 "$SERVICE" >&2 || true
}

rollback() {
  local previous_image_id=$1
  local rollback_container
  local restored_image_id

  fail "Deployment failed; restoring the previous production image"
  docker tag "$previous_image_id" "$PRODUCTION_IMAGE" || return 1
  PORTFOLIO_IMAGE="$PRODUCTION_IMAGE" docker-compose \
    --project-name "$COMPOSE_PROJECT" \
    --file "$COMPOSE_FILE" \
    up -d --no-deps --no-build "$SERVICE" || return 1
  rollback_container=$(PORTFOLIO_IMAGE="$PRODUCTION_IMAGE" docker-compose \
    --project-name "$COMPOSE_PROJECT" \
    --file "$COMPOSE_FILE" \
    ps -q "$SERVICE") || return 1
  [[ -n "$rollback_container" ]] || { fail "Rollback did not recreate the portfolio container"; return 1; }
  restored_image_id=$(docker inspect --format '{{.Image}}' "$rollback_container") || return 1
  [[ "$restored_image_id" == "$previous_image_id" ]] || { fail "Rollback restored an unexpected image ID"; return 1; }
  wait_for_container_health "$rollback_container" "Rolled-back portfolio" || return 1
  smoke_https || return 1
  ok "Rollback restored image $previous_image_id with healthy HTTPS service"
}

on_exit() {
  local exit_status=$?
  local rollback_status

  trap - EXIT INT TERM
  if (( ROLLBACK_REQUIRED )); then
    if rollback "$PREVIOUS_IMAGE_ID"; then
      (( exit_status != 0 )) || exit_status=1
    else
      rollback_status=$?
      show_diagnostics
      fail "Rollback failed with status $rollback_status"
      exit_status=$rollback_status
    fi
  fi
  cleanup_runtime
  exit "$exit_status"
}

on_signal() {
  fail "Deployment interrupted by $1"
  [[ "$1" == "INT" ]] && exit 130
  exit 143
}

write_release_receipt() {
  local timestamp=$1
  local short_sha=$2
  local candidate_image_id=$3
  local previous_image_id=$4
  local rollback_tag=$5
  local receipt="$RELEASE_DIR/${timestamp}-${short_sha}.txt"
  local temporary

  install -d -m 0750 "$RELEASE_DIR"
  temporary=$(mktemp "$RELEASE_DIR/.portfolio-release.XXXXXX")
  chmod 0640 "$temporary"
  {
    printf 'service=%s\n' "$SERVICE"
    printf 'deployed_at_utc=%s\n' "$timestamp"
    printf 'commit=%s\n' "$REQUESTED_SHA"
    printf 'source=%s\n' "$SOURCE_URL"
    printf 'candidate_image=%s\n' "$CANDIDATE_IMAGE"
    printf 'candidate_image_id=%s\n' "$candidate_image_id"
    printf 'previous_image_id=%s\n' "$previous_image_id"
    printf 'rollback_tag=%s\n' "$rollback_tag"
  } >"$temporary"
  mv "$temporary" "$receipt"
  ok "Release receipt written to $receipt"
}

deploy() {
  local before_script_blob
  local after_script_blob
  local origin_main
  local current_head
  local candidate_image_id
  local candidate_container
  local running_container
  local previous_short
  local rollback_tag
  local production_container
  local timestamp
  local short_sha

  confirm_deployment

  before_script_blob=$(git -C "$REPO_DIR" rev-parse "HEAD:scripts/deploy-vps.sh")
  git -C "$REPO_DIR" fetch origin main
  origin_main=$(git -C "$REPO_DIR" rev-parse refs/remotes/origin/main)
  if [[ "$REQUESTED_SHA" != "$origin_main" ]]; then
    fail "Approved SHA must equal origin/main after fetch"
    exit 1
  fi

  git -C "$REPO_DIR" pull --ff-only origin main
  current_head=$(git -C "$REPO_DIR" rev-parse HEAD)
  if [[ "$REQUESTED_SHA" != "$current_head" ]]; then
    fail "Checked-out HEAD does not equal the approved SHA after pull"
    exit 1
  fi

  after_script_blob=$(git -C "$REPO_DIR" rev-parse "HEAD:scripts/deploy-vps.sh")
  if [[ "$before_script_blob" != "$after_script_blob" ]]; then
    if [[ "${PORTFOLIO_DEPLOY_REEXECED:-0}" == "1" ]]; then
      fail "Deployment script changed again after re-execution; refusing to loop"
      exit 1
    fi
    ok "Deployment script changed after pull; executing the approved version once"
    flock -u 9
    exec 9>&-
    exec env PORTFOLIO_DEPLOY_REEXECED=1 "$SCRIPT_PATH" --deploy "$REQUESTED_SHA"
  fi

  npm --prefix "$REPO_DIR" ci
  NATIVE_BINDINGS_DIR=$(mktemp -d /tmp/portfolio-native-bindings.XXXXXX)
  npm install --prefix "$NATIVE_BINDINGS_DIR" --no-save --package-lock=false \
    "@rollup/rollup-linux-arm64-gnu@$(node -p "require('$REPO_DIR/node_modules/rollup/package.json').version")" \
    "@tailwindcss/oxide-linux-arm64-gnu@$(node -p "require('$REPO_DIR/node_modules/@tailwindcss/oxide/package.json').version")" \
    "lightningcss-linux-arm64-gnu@$(node -p "require('$REPO_DIR/node_modules/lightningcss/package.json').version")"
  cp -a "$NATIVE_BINDINGS_DIR/node_modules/@rollup/rollup-linux-arm64-gnu" "$REPO_DIR/node_modules/@rollup/"
  cp -a "$NATIVE_BINDINGS_DIR/node_modules/@tailwindcss/oxide-linux-arm64-gnu" "$REPO_DIR/node_modules/@tailwindcss/"
  cp -a "$NATIVE_BINDINGS_DIR/node_modules/lightningcss-linux-arm64-gnu" "$REPO_DIR/node_modules/"
  rm -rf "$NATIVE_BINDINGS_DIR"
  NATIVE_BINDINGS_DIR=""
  npm --prefix "$REPO_DIR" run lint
  npm --prefix "$REPO_DIR" run build
  if ! git -C "$REPO_DIR" diff --quiet || ! git -C "$REPO_DIR" diff --cached --quiet; then
    fail "Validation changed tracked files; refusing deployment"
    exit 1
  fi
  ok "npm validation passed without tracked changes"

  short_sha=${REQUESTED_SHA:0:12}
  CANDIDATE_IMAGE="ivansevill/portfolio:$REQUESTED_SHA"
  export CANDIDATE_IMAGE
  BUILD_CONTEXT=$(mktemp -d /tmp/portfolio-build-context.XXXXXX)
  git -C "$REPO_DIR" archive "$REQUESTED_SHA" | tar -x -C "$BUILD_CONTEXT"
  PORTFOLIO_BUILD_CONTEXT="$BUILD_CONTEXT" PORTFOLIO_IMAGE="$CANDIDATE_IMAGE" docker-compose \
    --project-name "$COMPOSE_PROJECT" \
    --file "$COMPOSE_FILE" \
    build \
    --build-arg "SOURCE_URL=$SOURCE_URL" \
    --build-arg "VCS_REF=$REQUESTED_SHA" \
    --build-arg "VERSION=$short_sha" \
    "$SERVICE"

  candidate_image_id=$(docker image inspect --format '{{.Id}}' "$CANDIDATE_IMAGE")
  [[ "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.source"}}' "$CANDIDATE_IMAGE")" == "$SOURCE_URL" ]]
  [[ "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$CANDIDATE_IMAGE")" == "$REQUESTED_SHA" ]]
  [[ "$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.version"}}' "$CANDIDATE_IMAGE")" == "$short_sha" ]]
  ok "Candidate OCI provenance labels match the approved commit"

  candidate_container="portfolio-candidate-$short_sha"
  CANDIDATE_CONTAINER=$candidate_container
  docker rm -f "$CANDIDATE_CONTAINER" >/dev/null 2>&1 || true
  docker run --detach --rm --name "$CANDIDATE_CONTAINER" "$CANDIDATE_IMAGE" >/dev/null
  if ! wait_for_container_health "$CANDIDATE_CONTAINER" "Candidate container"; then
    docker logs "$CANDIDATE_CONTAINER" >&2 || true
    exit 1
  fi
  docker rm -f "$CANDIDATE_CONTAINER" >/dev/null
  CANDIDATE_CONTAINER=""

  running_container=$(PORTFOLIO_IMAGE="$PRODUCTION_IMAGE" docker-compose \
    --project-name "$COMPOSE_PROJECT" \
    --file "$COMPOSE_FILE" \
    ps -q "$SERVICE")
  if [[ -z "$running_container" ]]; then
    fail "No running portfolio container is available for rollback capture"
    exit 1
  fi
  PREVIOUS_IMAGE_ID=$(docker inspect --format '{{.Image}}' "$running_container")
  previous_short=${PREVIOUS_IMAGE_ID#sha256:}
  previous_short=${previous_short:0:12}
  timestamp=$(date -u +%Y%m%dT%H%M%SZ)
  rollback_tag="ivansevill/portfolio:rollback-${timestamp}-${previous_short}"
  if docker image inspect "$rollback_tag" >/dev/null 2>&1; then
    fail "Rollback tag already exists and will not be overwritten: $rollback_tag"
    exit 1
  fi
  docker tag "$PREVIOUS_IMAGE_ID" "$rollback_tag"
  ok "Immutable rollback image created: $rollback_tag"

  ROLLBACK_REQUIRED=1
  docker tag "$candidate_image_id" "$PRODUCTION_IMAGE"
  PORTFOLIO_IMAGE="$PRODUCTION_IMAGE" docker-compose \
    --project-name "$COMPOSE_PROJECT" \
    --file "$COMPOSE_FILE" \
    up -d --no-deps --no-build "$SERVICE"

  production_container=$(PORTFOLIO_IMAGE="$PRODUCTION_IMAGE" docker-compose \
    --project-name "$COMPOSE_PROJECT" \
    --file "$COMPOSE_FILE" \
    ps -q "$SERVICE")
  if [[ -z "$production_container" ]]; then
    fail "Compose did not return the recreated portfolio container"
    exit 1
  fi
  verify_running_release "$production_container" "$candidate_image_id" "$REQUESTED_SHA" "Production portfolio"
  wait_for_container_health "$production_container" "Production portfolio"
  smoke_https

  write_release_receipt "$timestamp" "$short_sha" "$candidate_image_id" "$PREVIOUS_IMAGE_ID" "$rollback_tag"
  ROLLBACK_REQUIRED=0
  ok "Portfolio deployed from approved commit $REQUESTED_SHA"
}

MODE=""
REQUESTED_SHA=""
CANDIDATE_IMAGE=""

main() {
  trap on_exit EXIT
  trap 'on_signal INT' INT
  trap 'on_signal TERM' TERM

  case "${1:-}" in
    --check|--dry-run)
      MODE=${1#--}
      [[ $# -eq 1 ]] || { usage >&2; exit 2; }
      ;;
    --deploy)
      MODE="deploy"
      REQUESTED_SHA=${2:-}
      [[ $# -eq 2 && "$REQUESTED_SHA" =~ $SHA_PATTERN ]] || {
        fail "--deploy requires one lowercase full 40-character commit SHA"
        usage >&2
        exit 2
      }
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      usage >&2
      exit 2
      ;;
  esac

  check_command flock >/dev/null || exit 1
  acquire_lock

  if ! run_prerequisites; then
    fail "Deployment prerequisites are not satisfied"
    exit 1
  fi

  if [[ "$MODE" == "check" ]]; then
    ok "Deployment prerequisites are satisfied"
    exit 0
  fi
  if [[ "$MODE" == "dry-run" ]]; then
    ok "Dry run completed; no fetch, pull, npm, build, image, container, or service mutation occurred"
    exit 0
  fi

  deploy
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then
  main "$@"
fi
