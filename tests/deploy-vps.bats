#!/usr/bin/env bats

load 'test_helper/common'

setup() {
  common_setup
}

teardown() {
  common_teardown
}

@test "deployment help exits successfully without running prerequisites" {
  run "$DEPLOY_UNDER_TEST" --help

  [ "$status" -eq 0 ]
  assert_output_contains "Usage:"
  [ ! -s "$FAKE_LOG" ]
}

@test "deployment rejects a malformed commit SHA before prerequisites" {
  run "$DEPLOY_UNDER_TEST" --deploy invalid

  [ "$status" -eq 2 ]
  assert_output_contains "requires one lowercase full 40-character commit SHA"
  [ ! -s "$FAKE_LOG" ]
}

@test "tag deployment rejects a non-semantic release tag before prerequisites" {
  run "$DEPLOY_UNDER_TEST" --deploy-tag latest "$APPROVED_SHA"

  [ "$status" -eq 2 ]
  assert_output_contains "requires a vMAJOR.MINOR.PATCH tag"
  [ ! -s "$FAKE_LOG" ]
}

@test "check accepts valid host repository and Compose contracts without mutations" {
  run "$DEPLOY_UNDER_TEST" --check

  [ "$status" -eq 0 ]
  assert_output_contains "Deployment prerequisites are satisfied"
  assert_log_contains "docker-compose"
  assert_log_excludes "git -C $FAKE_REPO fetch"
  assert_log_excludes "npm"
  assert_log_excludes "docker tag"
  assert_log_excludes "curl"
}

@test "dry run performs prerequisites without deployment mutations" {
  run "$DEPLOY_UNDER_TEST" --dry-run

  [ "$status" -eq 0 ]
  assert_output_contains "no fetch, pull, npm, build, image, container, or service mutation occurred"
  assert_log_excludes "git -C $FAKE_REPO fetch"
  assert_log_excludes "npm"
  assert_log_excludes "docker tag"
  assert_log_excludes "curl"
}

@test "check refuses a dirty repository" {
  export FAKE_SCENARIO="dirty-repository"

  run "$DEPLOY_UNDER_TEST" --check

  [ "$status" -eq 1 ]
  assert_output_contains "Repository is dirty"
  assert_output_contains "Deployment prerequisites are not satisfied"
}

@test "Compose contract rejects an unexpected portfolio image" {
  export FAKE_COMPOSE_VARIANT="wrong-image"

  run "$DEPLOY_UNDER_TEST" --check

  [ "$status" -eq 1 ]
  assert_output_contains "must render the required image, build context, and provenance args"
}

@test "Compose contract rejects an unexpected build context" {
  export FAKE_COMPOSE_VARIANT="wrong-context"

  run "$DEPLOY_UNDER_TEST" --check

  [ "$status" -eq 1 ]
  assert_output_contains "must render the required image, build context, and provenance args"
}

@test "Compose contract rejects a missing provenance argument" {
  export FAKE_COMPOSE_VARIANT="missing-arg"

  run "$DEPLOY_UNDER_TEST" --check

  [ "$status" -eq 1 ]
  assert_output_contains "must render the required image, build context, and provenance args"
}

@test "deployment confirmation cannot be bypassed in a non-interactive shell" {
  run env PORTFOLIO_DEPLOY_CONFIRMED=1 "$DEPLOY_UNDER_TEST" --deploy "$APPROVED_SHA"

  [ "$status" -eq 1 ]
  assert_output_contains "requires an interactive terminal"
  assert_log_excludes "git -C $FAKE_REPO fetch"
}

@test "verified semantic release tag authorizes a non-interactive deployment" {
  run "$DEPLOY_UNDER_TEST" --deploy-tag v1.2.3 "$APPROVED_SHA"

  [ "$status" -eq 0 ]
  assert_output_contains "Release tag v1.2.3 resolves to the requested commit"
  assert_output_contains "Portfolio deployed from approved commit $APPROVED_SHA"
  assert_log_contains "git -C $FAKE_REPO fetch --no-tags origin main refs/tags/v1.2.3:refs/tags/v1.2.3"
}

@test "successful deployment validates provenance and writes a release receipt" {
  run run_deploy_flow

  [ "$status" -eq 0 ]
  assert_output_contains "Candidate OCI provenance labels match the approved commit"
  assert_output_contains "Production portfolio image ID and OCI revision are verified"
  assert_output_contains "Portfolio deployed from approved commit $APPROVED_SHA"
  [ "$(<"$FAKE_STATE/production-image")" = "$CANDIDATE_IMAGE_ID" ]
  receipts=("$FAKE_RELEASE_DIR"/*.txt)
  [ -f "${receipts[0]}" ]
  receipt=$(<"${receipts[0]}")
  [[ "$receipt" == *"commit=$APPROVED_SHA"* ]]
  [[ "$receipt" == *"release_tag=manual"* ]]
  [[ "$receipt" == *"previous_image_id=$PREVIOUS_IMAGE_ID"* ]]
  assert_log_excludes "docker tag $PREVIOUS_IMAGE_ID ivansevill/portfolio:production"
}

@test "candidate provenance mismatch aborts before production retagging" {
  export FAKE_SCENARIO="wrong-revision"

  run run_deploy_flow

  [ "$status" -eq 1 ]
  [ "$(<"$FAKE_STATE/production-image")" = "$PREVIOUS_IMAGE_ID" ]
  assert_log_excludes "docker tag $CANDIDATE_IMAGE_ID ivansevill/portfolio:production"
}

@test "failed cutover rolls back to the previous image and preserves failure" {
  export FAKE_SCENARIO="cutover-failure"

  run run_deploy_flow

  [ "$status" -eq 1 ]
  assert_output_contains "Deployment failed; restoring the previous production image"
  assert_output_contains "Rollback restored image $PREVIOUS_IMAGE_ID"
  [ "$(<"$FAKE_STATE/production-image")" = "$PREVIOUS_IMAGE_ID" ]
  [ "$(<"$FAKE_STATE/service-image")" = "$PREVIOUS_IMAGE_ID" ]
  assert_log_contains "docker tag $PREVIOUS_IMAGE_ID ivansevill/portfolio:production"
}

@test "rollback rejects a restored container with an unexpected image" {
  export FAKE_SCENARIO="wrong-running-image"

  run bash -c '
    source "$DEPLOY_UNDER_TEST"
    PREVIOUS_IMAGE_ID=$PREVIOUS_IMAGE_ID
    ROLLBACK_REQUIRED=1
    trap on_exit EXIT
    false
  '

  [ "$status" -eq 1 ]
  assert_output_contains "Rollback restored an unexpected image ID"
  assert_output_contains "Rollback failed with status 1"
}

@test "release receipt failure remains inside the rollback transaction" {
  rm -rf "$FAKE_RELEASE_DIR"
  : >"$FAKE_RELEASE_DIR"

  run run_deploy_flow

  [ "$status" -eq 1 ]
  assert_output_contains "Deployment failed; restoring the previous production image"
  [ "$(<"$FAKE_STATE/production-image")" = "$PREVIOUS_IMAGE_ID" ]
  assert_log_contains "docker tag $PREVIOUS_IMAGE_ID ivansevill/portfolio:production"
}

@test "TERM during armed cutover rolls back and exits 143" {
  export FAKE_SCENARIO="signal"
  export FAKE_SIGNAL="TERM"

  run run_deploy_flow

  [ "$status" -eq 143 ]
  assert_output_contains "Deployment interrupted by TERM"
  assert_output_contains "Rollback restored image $PREVIOUS_IMAGE_ID"
  [ "$(<"$FAKE_STATE/production-image")" = "$PREVIOUS_IMAGE_ID" ]
}

@test "INT during armed cutover rolls back and exits 130" {
  export FAKE_SCENARIO="signal"
  export FAKE_SIGNAL="INT"

  run run_deploy_flow

  [ "$status" -eq 130 ]
  assert_output_contains "Deployment interrupted by INT"
  assert_output_contains "Rollback restored image $PREVIOUS_IMAGE_ID"
  [ "$(<"$FAKE_STATE/production-image")" = "$PREVIOUS_IMAGE_ID" ]
}

@test "rollback failure overrides the original deployment error" {
  export FAKE_SCENARIO="rollback-failure"
  printf '%s\n' "$CANDIDATE_IMAGE_ID" >"$FAKE_STATE/service-image"

  run bash -c '
    source "$DEPLOY_UNDER_TEST"
    PREVIOUS_IMAGE_ID=$PREVIOUS_IMAGE_ID
    ROLLBACK_REQUIRED=1
    trap on_exit EXIT
    false
  '

  [ "$status" -eq 1 ]
  assert_output_contains "Rollback failed with status 1"
}
