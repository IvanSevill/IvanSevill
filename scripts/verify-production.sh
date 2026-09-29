#!/usr/bin/env bash
set -Eeuo pipefail

readonly COMPOSE_FILE="/home/ivansevill/infra/stacks/services/docker-compose.yml"
readonly COMPOSE_OVERRIDE="/home/ivansevill/projects/portfolio/deploy/docker-compose.production.yml"
readonly COMPOSE_PROJECT="services"
readonly SERVICE="portfolio"
readonly PRODUCTION_IMAGE="ivansevill/portfolio:production"
readonly EXPECTED_SOURCE="https://github.com/IvanSevill/IvanSevill"
readonly SHA_PATTERN='^[0-9a-f]{40}$'

usage() {
  cat <<'EOF'
Usage:
  scripts/verify-production.sh --expected-sha <full-commit-sha>
  scripts/verify-production.sh --help

Runs read-only container health, OCI provenance, and public HTTPS checks.
EOF
}

ok() {
  printf '[OK] %s\n' "$1"
}

fail() {
  printf '[FAIL] %s\n' "$1" >&2
}

EXPECTED_SHA=""
case "${1:-}" in
  --expected-sha)
    EXPECTED_SHA=${2:-}
    [[ $# -eq 2 && "$EXPECTED_SHA" =~ $SHA_PATTERN ]] || {
      fail "--expected-sha requires one lowercase full 40-character commit SHA"
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

for command_name in curl docker docker-compose; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    fail "Required command is unavailable: $command_name"
    exit 1
  fi
done

if [[ ! -r "$COMPOSE_FILE" ]]; then
  fail "Compose file is not readable at $COMPOSE_FILE"
  exit 1
fi
if [[ ! -r "$COMPOSE_OVERRIDE" ]]; then
  fail "Production Compose override is not readable at $COMPOSE_OVERRIDE"
  exit 1
fi

container_id=$(PORTFOLIO_IMAGE="$PRODUCTION_IMAGE" docker-compose \
  --project-name "$COMPOSE_PROJECT" \
  --file "$COMPOSE_FILE" \
  --file "$COMPOSE_OVERRIDE" \
  ps -q "$SERVICE")
if [[ -z "$container_id" ]]; then
  fail "Portfolio container is not running"
  exit 1
fi

health=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' "$container_id")
if [[ "$health" != "healthy" ]]; then
  fail "Portfolio container health is $health"
  exit 1
fi
ok "Portfolio container is healthy"

image_id=$(docker inspect --format '{{.Image}}' "$container_id")
expected_image_id=$(docker image inspect --format '{{.Id}}' "ivansevill/portfolio:$EXPECTED_SHA")
source_label=$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.source"}}' "$image_id")
revision_label=$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$image_id")
version_label=$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.version"}}' "$image_id")

if [[ "$source_label" != "$EXPECTED_SOURCE" ]]; then
  fail "OCI source label does not match the canonical repository"
  exit 1
fi
if [[ "$image_id" != "$expected_image_id" ]]; then
  fail "Running image ID does not match the expected candidate image"
  exit 1
fi
if [[ "$revision_label" != "$EXPECTED_SHA" ]]; then
  fail "OCI revision label does not match the expected commit SHA"
  exit 1
fi
if [[ -z "$version_label" || "$version_label" == "dev" || "$version_label" == "unknown" ]]; then
  fail "OCI version label is missing or non-release"
  exit 1
fi
ok "Image provenance: source=$source_label revision=$revision_label version=$version_label"

for url in \
  "https://ivansevill.com/" \
  "https://www.ivansevill.com/" \
  "https://ivansevill.com/healthz"; do
  curl --fail --silent --show-error --location --max-time 15 --output /dev/null "$url"
  ok "HTTPS check passed: $url"
done

printf 'container=%s\nimage=%s\nrevision=%s\n' "$container_id" "$image_id" "$revision_label"
