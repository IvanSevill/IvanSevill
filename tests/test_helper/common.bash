common_setup() {
  PROJECT_ROOT=$(cd "$(dirname "$BATS_TEST_FILENAME")/.." && pwd)
  TEST_ROOT="$BATS_TEST_TMPDIR/portfolio"
  FAKE_BIN="$TEST_ROOT/bin"
  FAKE_REPO="$TEST_ROOT/repository"
  FAKE_COMPOSE_FILE="$TEST_ROOT/docker-compose.yml"
  FAKE_RELEASE_DIR="$TEST_ROOT/releases"
  FAKE_LOCK_FILE="$TEST_ROOT/deploy.lock"
  FAKE_STATE="$TEST_ROOT/state"
  FAKE_LOG="$TEST_ROOT/commands.log"
  DEPLOY_UNDER_TEST="$TEST_ROOT/deploy-vps.sh"
  VERIFY_UNDER_TEST="$TEST_ROOT/verify-production.sh"
  APPROVED_SHA="0123456789abcdef0123456789abcdef01234567"
  PREVIOUS_IMAGE_ID="sha256:previous-image"
  CANDIDATE_IMAGE_ID="sha256:candidate-image"

  mkdir -p "$FAKE_BIN" "$FAKE_REPO/.git" "$FAKE_RELEASE_DIR" "$FAKE_STATE"
  : >"$FAKE_COMPOSE_FILE"
  : >"$FAKE_LOG"
  printf '%s\n' "$PREVIOUS_IMAGE_ID" >"$FAKE_STATE/production-image"
  printf '%s\n' "$PREVIOUS_IMAGE_ID" >"$FAKE_STATE/service-image"

  create_fake_commands
  rewrite_script_paths "$PROJECT_ROOT/scripts/deploy-vps.sh" "$DEPLOY_UNDER_TEST"
  rewrite_script_paths "$PROJECT_ROOT/scripts/verify-production.sh" "$VERIFY_UNDER_TEST"

  export PROJECT_ROOT TEST_ROOT FAKE_BIN FAKE_REPO FAKE_COMPOSE_FILE
  export FAKE_RELEASE_DIR FAKE_LOCK_FILE FAKE_STATE FAKE_LOG
  export DEPLOY_UNDER_TEST VERIFY_UNDER_TEST APPROVED_SHA
  export PREVIOUS_IMAGE_ID CANDIDATE_IMAGE_ID
  export PATH="$FAKE_BIN:$PATH"
  unset FAKE_SCENARIO FAKE_COMPOSE_VARIANT FAKE_SIGNAL
}

common_teardown() {
  rm -rf "$TEST_ROOT"
}

create_fake_commands() {
  local command_name
  local fake_source="$PROJECT_ROOT/tests/test_helper/fake-command.bash"

  for command_name in curl docker docker-compose git hostname npm tailscale tar; do
    printf '#!/usr/bin/env bash\nexec bash %q %q "$@"\n' \
      "$fake_source" "$command_name" >"$FAKE_BIN/$command_name"
    chmod +x "$FAKE_BIN/$command_name"
  done
}

rewrite_script_paths() {
  local source_file=$1
  local target_file=$2
  local line

  while IFS= read -r line || [[ -n "$line" ]]; do
    case "$line" in
      'readonly REPO_DIR='*) printf 'readonly REPO_DIR=%q\n' "$FAKE_REPO" ;;
      'readonly COMPOSE_FILE='*) printf 'readonly COMPOSE_FILE=%q\n' "$FAKE_COMPOSE_FILE" ;;
      'readonly RELEASE_DIR='*) printf 'readonly RELEASE_DIR=%q\n' "$FAKE_RELEASE_DIR" ;;
      'readonly LOCK_FILE='*) printf 'readonly LOCK_FILE=%q\n' "$FAKE_LOCK_FILE" ;;
      'readonly SCRIPT_PATH='*) printf 'readonly SCRIPT_PATH=%q\n' "$DEPLOY_UNDER_TEST" ;;
      *) printf '%s\n' "$line" ;;
    esac
  done <"$source_file" >"$target_file"
  chmod +x "$target_file"
}

run_deploy_flow() {
  bash -c '
    source "$DEPLOY_UNDER_TEST"
    confirm_deployment() { :; }
    REQUESTED_SHA=$APPROVED_SHA
    trap on_exit EXIT
    trap "on_signal INT" INT
    trap "on_signal TERM" TERM
    run_prerequisites
    deploy
  '
}

assert_output_contains() {
  [[ "$output" == *"$1"* ]]
}

assert_log_contains() {
  local log
  log=$(<"$FAKE_LOG")
  [[ "$log" == *"$1"* ]]
}

assert_log_excludes() {
  local log
  log=$(<"$FAKE_LOG")
  [[ "$log" != *"$1"* ]]
}
