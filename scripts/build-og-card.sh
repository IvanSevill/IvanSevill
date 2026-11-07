#!/usr/bin/env bash
set -Eeuo pipefail

readonly DEFAULT_AVATAR_URL="https://github.com/IvanSevill.png?size=640"

usage() {
  cat <<'EOF'
Usage:
  scripts/build-og-card.sh <output.jpg>
  scripts/build-og-card.sh --help

Renders the 1200x630 social card from the current GitHub avatar.
If the avatar or a tool is unavailable, the existing <output.jpg> is kept.

Environment:
  AVATAR_URL   avatar to download (default: the IvanSevill GitHub avatar)
  FONT_REGULAR regular font file (default: JetBrains Mono under /usr/share/fonts)
  FONT_BOLD    bold font file (default: JetBrains Mono Bold under /usr/share/fonts)
EOF
}

warn() {
  printf '[WARN] og-card: %s; keeping the existing image\n' "$1" >&2
}

find_font() {
  { find /usr/share/fonts -iname "$1" 2>/dev/null || true; } | head -n 1
}

if [[ "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi
if (($# != 1)); then
  usage >&2
  exit 2
fi

readonly OUTPUT=$1
readonly AVATAR_URL=${AVATAR_URL:-$DEFAULT_AVATAR_URL}
FONT_REGULAR=${FONT_REGULAR:-$(find_font 'JetBrainsMono-Regular.ttf')}
FONT_BOLD=${FONT_BOLD:-$(find_font 'JetBrainsMono-Bold.ttf')}

for command_name in wget magick; do
  if ! command -v "$command_name" >/dev/null; then
    warn "$command_name is not installed"
    exit 0
  fi
done
if [[ ! -f "$FONT_REGULAR" || ! -f "$FONT_BOLD" ]]; then
  warn "JetBrains Mono fonts were not found"
  exit 0
fi

work_dir=$(mktemp -d)
trap 'rm -rf "$work_dir"' EXIT

if ! wget -q -T 20 -O "$work_dir/avatar" "$AVATAR_URL" || [[ ! -s "$work_dir/avatar" ]]; then
  warn "could not download $AVATAR_URL"
  exit 0
fi

# Left: avatar faded into the page background. Right: name, handle and domain.
if ! magick "$work_dir/avatar" -resize 630x630^ -gravity center -extent 480x630 \
    \( -size 630x160 gradient:'rgba(5,5,7,0)-rgba(5,5,7,1)' -rotate -90 \) -gravity east -composite \
    "$work_dir/photo.png" \
  || ! magick -size 1200x630 xc:'#050507' \
    \( -size 1600x1600 radial-gradient:'rgba(0,255,157,0.14)-rgba(0,255,157,0)' \) -geometry +100-700 -composite \
    "$work_dir/photo.png" -geometry +0+0 -composite \
    -fill '#00ff9d' -font "$FONT_REGULAR" -pointsize 28 -annotate +540+170 '$ whoami' \
    -fill '#e6f1e9' -font "$FONT_BOLD" -pointsize 60 -annotate +540+255 'Iván Jesús' -annotate +540+330 'Sevillano Plaza' \
    -fill '#00ff9d' -font "$FONT_BOLD" -pointsize 36 -annotate +540+395 '@IvanSevill' \
    -fill '#a7b7b1' -font "$FONT_REGULAR" -pointsize 26 -annotate +540+460 'Software Engineering' \
    -annotate +540+498 'Developer tools · Web · Cloud' \
    -fill '#e6f1e9' -font "$FONT_REGULAR" -pointsize 26 -annotate +540+575 'ivansevill.com' \
    -strip -quality 86 "$work_dir/og-card.jpg"; then
  warn "ImageMagick could not render the card"
  exit 0
fi

mv "$work_dir/og-card.jpg" "$OUTPUT"
printf '[OK] og-card: rendered %s from %s\n' "$OUTPUT" "$AVATAR_URL"
