#!/usr/bin/env bats

setup() {
  SCRIPT="$BATS_TEST_DIRNAME/../scripts/build-og-card.sh"
  WORK_DIR=$(mktemp -d)
  mkdir -p "$WORK_DIR/bin"
  printf 'existing card\n' >"$WORK_DIR/og-card.jpg"
  printf 'font\n' >"$WORK_DIR/font.ttf"
  export FONT_REGULAR="$WORK_DIR/font.ttf" FONT_BOLD="$WORK_DIR/font.ttf"
}

teardown() {
  rm -rf "$WORK_DIR"
}

fake() {
  printf '#!/usr/bin/env bash\n%s\n' "$2" >"$WORK_DIR/bin/$1"
  chmod +x "$WORK_DIR/bin/$1"
}

@test "og card help exits without rendering" {
  run "$SCRIPT" --help

  [ "$status" -eq 0 ]
  [[ "$output" == *"Usage:"* ]]
}

@test "og card requires exactly one output path" {
  run "$SCRIPT"

  [ "$status" -eq 2 ]
}

@test "og card keeps the existing image when the avatar download fails" {
  fake wget 'exit 4'
  fake magick 'echo "magick must not run" >&2; exit 1'

  PATH="$WORK_DIR/bin:$PATH" run "$SCRIPT" "$WORK_DIR/og-card.jpg"

  [ "$status" -eq 0 ]
  [[ "$output" == *"could not download"* ]]
  [ "$(cat "$WORK_DIR/og-card.jpg")" = "existing card" ]
}

@test "og card keeps the existing image when rendering fails" {
  fake wget 'while (($#)); do [[ "$1" == "-O" ]] && printf avatar >"$2"; shift; done'
  fake magick 'exit 1'

  PATH="$WORK_DIR/bin:$PATH" run "$SCRIPT" "$WORK_DIR/og-card.jpg"

  [ "$status" -eq 0 ]
  [[ "$output" == *"could not render"* ]]
  [ "$(cat "$WORK_DIR/og-card.jpg")" = "existing card" ]
}

@test "og card replaces the image after a successful render" {
  fake wget 'while (($#)); do [[ "$1" == "-O" ]] && printf avatar >"$2"; shift; done'
  fake magick 'for last; do :; done; printf "new card\n" >"$last"'

  PATH="$WORK_DIR/bin:$PATH" run "$SCRIPT" "$WORK_DIR/og-card.jpg"

  [ "$status" -eq 0 ]
  [ "$(cat "$WORK_DIR/og-card.jpg")" = "new card" ]
}
