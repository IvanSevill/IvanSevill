#!/usr/bin/env bash
set -u

command_name=$1
shift

printf '%s' "$command_name" >>"$FAKE_LOG"
printf ' %q' "$@" >>"$FAKE_LOG"
printf '\n' >>"$FAKE_LOG"

case "$command_name" in
  hostname)
    printf '%s\n' 'ivansevill-vm'
    ;;
  tailscale)
    printf '%s\n' '{"Self":{"Online":true,"HostName":"ivansevill-vm"}}'
    ;;
  git)
    case " $* " in
      *" symbolic-ref --quiet --short HEAD "*) printf '%s\n' 'main' ;;
      *" remote get-url origin "*) printf '%s\n' 'https://github.com/IvanSevill/IvanSevill.git' ;;
      *" status --porcelain --untracked-files=normal "*)
        [[ "${FAKE_SCENARIO:-}" == "dirty-repository" ]] && printf '%s\n' ' M changed-file'
        ;;
      *" show-ref --verify --quiet refs/remotes/origin/main "*) ;;
      *" rev-parse HEAD:scripts/deploy-vps.sh "*) printf '%s\n' 'unchanged-script-blob' ;;
      *" rev-parse refs/tags/v1.2.3^{commit} "*) printf '%s\n' "$APPROVED_SHA" ;;
      *" rev-parse refs/remotes/origin/main "*|*" rev-parse HEAD ") printf '%s\n' "$APPROVED_SHA" ;;
      *" fetch origin main "*|*" fetch --no-tags origin main refs/tags/v1.2.3:refs/tags/v1.2.3 "*|*" pull --ff-only origin main "*|*" diff --quiet "*|*" diff --cached --quiet "*) ;;
      *" archive $APPROVED_SHA "*) ;;
      *) printf 'Unexpected git invocation: %s\n' "$*" >&2; exit 90 ;;
    esac
    ;;
  npm)
    prefix=""
    while (($#)); do
      if [[ "$1" == "--prefix" ]]; then
        prefix=$2
        shift 2
      else
        shift
      fi
    done
    if [[ -n "$prefix" ]]; then
      mkdir -p \
        "$prefix/node_modules/rollup" \
        "$prefix/node_modules/@tailwindcss/oxide" \
        "$prefix/node_modules/@rollup/rollup-linux-arm64-gnu" \
        "$prefix/node_modules/@tailwindcss/oxide-linux-arm64-gnu" \
        "$prefix/node_modules/lightningcss" \
        "$prefix/node_modules/lightningcss-linux-arm64-gnu"
      printf '{"version":"1.0.0"}\n' >"$prefix/node_modules/rollup/package.json"
      printf '{"version":"1.0.0"}\n' >"$prefix/node_modules/@tailwindcss/oxide/package.json"
      printf '{"version":"1.0.0"}\n' >"$prefix/node_modules/lightningcss/package.json"
    fi
    ;;
  tar)
    ;;
  docker-compose)
    case " $* " in
      *" config --format json "*)
        image=${PORTFOLIO_IMAGE:-ivansevill/portfolio:production}
        context=${PORTFOLIO_BUILD_CONTEXT:-missing}
        args='"SOURCE_URL":"","VCS_REF":"","VERSION":""'
        case "${FAKE_COMPOSE_VARIANT:-valid}" in
          wrong-image) image='unexpected/image:latest' ;;
          wrong-context) context='/unexpected/context' ;;
          missing-arg) args='"SOURCE_URL":"","VCS_REF":""' ;;
          invalid-json) printf '%s\n' 'not-json'; exit 0 ;;
        esac
        printf '{"services":{"portfolio":{"image":"%s","build":{"context":"%s","args":{%s}}}}}\n' \
          "$image" "$context" "$args"
        ;;
      *" build "*) ;;
      *" up -d --no-deps --no-build portfolio "*)
        current_image=$(<"$FAKE_STATE/production-image")
        if [[ "${FAKE_SCENARIO:-}" == "rollback-failure" && "$current_image" == "$PREVIOUS_IMAGE_ID" ]]; then
          exit 7
        fi
        printf '%s\n' "$current_image" >"$FAKE_STATE/service-image"
        ;;
      *" ps -q portfolio "*)
        [[ "${FAKE_SCENARIO:-}" == "missing-container" ]] || printf '%s\n' 'service-container'
        ;;
      *" ps portfolio "*|*" logs --no-color --tail=200 portfolio "*) ;;
      *) printf 'Unexpected docker-compose invocation: %s\n' "$*" >&2; exit 91 ;;
    esac
    ;;
  docker)
    case " $* " in
      *" image inspect "*)
        format=""
        target=${!#}
        while (($#)); do
          if [[ "$1" == "--format" ]]; then
            format=$2
            break
          fi
          shift
        done
        if [[ -z "$format" ]]; then
          [[ "${FAKE_SCENARIO:-}" == "rollback-tag-exists" ]] && exit 0
          exit 1
        fi
        case "$format" in
          '{{.Id}}') printf '%s\n' "$CANDIDATE_IMAGE_ID" ;;
          *'org.opencontainers.image.source'*)
            if [[ "${FAKE_SCENARIO:-}" == "wrong-source" ]]; then
              printf '%s\n' 'https://example.invalid/source'
            else
              printf '%s\n' 'https://github.com/IvanSevill/IvanSevill'
            fi
            ;;
          *'org.opencontainers.image.revision'*)
            if [[ "${FAKE_SCENARIO:-}" == "wrong-revision" ]]; then
              printf '%s\n' 'ffffffffffffffffffffffffffffffffffffffff'
            else
              printf '%s\n' "$APPROVED_SHA"
            fi
            ;;
          *'org.opencontainers.image.version'*)
            if [[ "${FAKE_SCENARIO:-}" == "invalid-version" ]]; then
              printf '%s\n' 'dev'
            else
              printf '%s\n' "${APPROVED_SHA:0:12}"
            fi
            ;;
          *) printf 'Unexpected docker image format: %s\n' "$format" >&2; exit 92 ;;
        esac
        ;;
      *" inspect --format "*)
        format=$3
        target=$4
        case "$format" in
          *State.Health*)
            current_image=$(<"$FAKE_STATE/service-image")
            if [[ "${FAKE_SCENARIO:-}" == "health-failure" ]]; then
              printf '%s\n' 'unhealthy'
            elif [[ "${FAKE_SCENARIO:-}" == "cutover-failure" && "$target" == "service-container" && "$current_image" == "$CANDIDATE_IMAGE_ID" ]]; then
              printf '%s\n' 'unhealthy'
            else
              printf '%s\n' 'healthy'
            fi
            ;;
          '{{.Image}}')
            if [[ "$target" == "service-container" ]]; then
              if [[ "${FAKE_SCENARIO:-}" == "wrong-running-image" ]]; then
                printf '%s\n' 'sha256:unexpected-image'
              else
                printf '%s\n' "$(<"$FAKE_STATE/service-image")"
              fi
            else
              printf '%s\n' "$CANDIDATE_IMAGE_ID"
            fi
            ;;
          *) printf 'Unexpected docker inspect format: %s\n' "$format" >&2; exit 93 ;;
        esac
        ;;
      *" tag "*)
        source_image=$2
        target_image=$3
        if [[ "$target_image" == "ivansevill/portfolio:production" ]]; then
          printf '%s\n' "$source_image" >"$FAKE_STATE/production-image"
          if [[ "${FAKE_SCENARIO:-}" == "signal" && "$source_image" == "$CANDIDATE_IMAGE_ID" ]]; then
            kill "-${FAKE_SIGNAL:-TERM}" "$PPID"
          fi
        fi
        ;;
      *" run --detach --rm --name "*|*" rm -f "*|*" logs "*) ;;
      *) printf 'Unexpected docker invocation: %s\n' "$*" >&2; exit 94 ;;
    esac
    ;;
  curl)
    [[ "${FAKE_SCENARIO:-}" == "curl-failure" ]] && exit 22
    exit 0
    ;;
  *)
    printf 'Unexpected fake command: %s\n' "$command_name" >&2
    exit 95
    ;;
esac
