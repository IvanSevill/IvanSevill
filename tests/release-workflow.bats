#!/usr/bin/env bats

setup() {
  PROJECT_ROOT=$(cd "$(dirname "$BATS_TEST_FILENAME")/.." && pwd)
  WORKFLOW="$PROJECT_ROOT/.github/workflows/deploy.yml"
  workflow=$(<"$WORKFLOW")
}

@test "release workflow is gated by semantic version tags and validation" {
  [[ "$workflow" == *'tags:'* ]]
  [[ "$workflow" == *'"v*.*.*"'* ]]
  [[ "$workflow" == *'needs: validate'* ]]
  [[ "$workflow" == *'npm run test:scripts'* ]]
  [[ "$workflow" == *'npm test'* ]]
  [[ "$workflow" == *'npm run lint'* ]]
  [[ "$workflow" == *'npm run build'* ]]
}

@test "release workflow reaches the VPS through Tailscale and strict SSH" {
  [[ "$workflow" == *'tailscale/github-action@'* ]]
  [[ "$workflow" == *'tags: tag:ci'* ]]
  [[ "$workflow" == *'StrictHostKeyChecking=yes'* ]]
  [[ "$workflow" == *'VPS_SSH_KNOWN_HOSTS'* ]]
  [[ "$workflow" == *'--deploy-tag "$release_tag" "$release_sha"'* ]]
}

@test "release workflow refuses dirty or non-main VPS checkouts" {
  [[ "$workflow" == *'symbolic-ref --quiet --short HEAD'* ]]
  [[ "$workflow" == *'status --porcelain --untracked-files=normal'* ]]
  [[ "$workflow" == *'pull --ff-only origin main'* ]]
  [[ "$workflow" != *'git reset'* ]]
  [[ "$workflow" != *'git clean'* ]]
}
