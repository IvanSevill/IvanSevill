#!/usr/bin/env bats

load 'test_helper/common'

setup() {
  common_setup
  printf '%s\n' "$CANDIDATE_IMAGE_ID" >"$FAKE_STATE/production-image"
  printf '%s\n' "$CANDIDATE_IMAGE_ID" >"$FAKE_STATE/service-image"
}

teardown() {
  common_teardown
}

@test "verifier help exits without production checks" {
  run "$VERIFY_UNDER_TEST" --help

  [ "$status" -eq 0 ]
  assert_output_contains "Usage:"
  [ ! -s "$FAKE_LOG" ]
}

@test "verifier rejects a malformed expected SHA" {
  run "$VERIFY_UNDER_TEST" --expected-sha invalid

  [ "$status" -eq 2 ]
  assert_output_contains "requires one lowercase full 40-character commit SHA"
  [ ! -s "$FAKE_LOG" ]
}

@test "verifier accepts a healthy release bound to the expected image and revision" {
  run "$VERIFY_UNDER_TEST" --expected-sha "$APPROVED_SHA"

  [ "$status" -eq 0 ]
  assert_output_contains "Portfolio container is healthy"
  assert_output_contains "revision=$APPROVED_SHA"
  assert_output_contains "container=service-container"
  assert_log_contains "https://ivansevill.com/"
  assert_log_contains "https://www.ivansevill.com/"
  assert_log_contains "https://ivansevill.com/healthz"
}

@test "verifier refuses a missing production container" {
  export FAKE_SCENARIO="missing-container"

  run "$VERIFY_UNDER_TEST" --expected-sha "$APPROVED_SHA"

  [ "$status" -eq 1 ]
  assert_output_contains "Portfolio container is not running"
  assert_log_excludes "curl"
}

@test "verifier refuses an unhealthy production container" {
  export FAKE_SCENARIO="health-failure"

  run "$VERIFY_UNDER_TEST" --expected-sha "$APPROVED_SHA"

  [ "$status" -eq 1 ]
  assert_output_contains "Portfolio container health is unhealthy"
  assert_log_excludes "curl"
}

@test "verifier refuses a running image that differs from the expected candidate" {
  export FAKE_SCENARIO="wrong-running-image"

  run "$VERIFY_UNDER_TEST" --expected-sha "$APPROVED_SHA"

  [ "$status" -eq 1 ]
  assert_output_contains "Running image ID does not match the expected candidate image"
  assert_log_excludes "curl"
}

@test "verifier refuses an OCI revision that differs from the expected SHA" {
  export FAKE_SCENARIO="wrong-revision"

  run "$VERIFY_UNDER_TEST" --expected-sha "$APPROVED_SHA"

  [ "$status" -eq 1 ]
  assert_output_contains "OCI revision label does not match the expected commit SHA"
  assert_log_excludes "curl"
}

@test "verifier refuses a non-canonical OCI source" {
  export FAKE_SCENARIO="wrong-source"

  run "$VERIFY_UNDER_TEST" --expected-sha "$APPROVED_SHA"

  [ "$status" -eq 1 ]
  assert_output_contains "OCI source label does not match the canonical repository"
  assert_log_excludes "curl"
}

@test "verifier refuses a non-release OCI version" {
  export FAKE_SCENARIO="invalid-version"

  run "$VERIFY_UNDER_TEST" --expected-sha "$APPROVED_SHA"

  [ "$status" -eq 1 ]
  assert_output_contains "OCI version label is missing or non-release"
  assert_log_excludes "curl"
}

@test "verifier propagates public HTTPS failure" {
  export FAKE_SCENARIO="curl-failure"

  run "$VERIFY_UNDER_TEST" --expected-sha "$APPROVED_SHA"

  [ "$status" -eq 22 ]
  assert_output_contains "Image provenance:"
}
