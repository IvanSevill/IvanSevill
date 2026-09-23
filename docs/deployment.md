# Deploy the portfolio from an approved Git commit

GitHub `main` is the source of truth. CI validates changes but never deploys them. Production changes only through an explicit SSH session and `scripts/deploy-vps.sh --deploy <full-commit-sha>` after that exact commit has passed review and CI.

## Quick path

1. Make changes with Codex in the local Fedora clone.
2. Run `npm ci`, install the platform-native bindings as CI does, then run `npm run lint`, `npm run build`, and the repository checks.
3. Review the diff, then commit and push only after explicit approval.
4. Wait for the GitHub Actions CI workflow to pass on the approved commit.
5. Obtain explicit deployment approval for the full 40-character commit SHA.
6. SSH to the VPS manually and run the versioned deployment script from the repository.
7. Run `scripts/verify-production.sh --expected-sha <full-commit-sha>` and review the release receipt.

```bash
ssh ivansevill-vm
cd /home/ivansevill/projects/portfolio
scripts/deploy-vps.sh --check
scripts/deploy-vps.sh --deploy <full-commit-sha>
scripts/verify-production.sh --expected-sha <full-commit-sha>
```

Use `scripts/deploy-vps.sh --dry-run` to repeat all safe prerequisite checks without fetching, pulling, installing dependencies, building images, or changing containers or services.

## Authority boundaries

| Area | Authority |
|------|-----------|
| Application source and deployment scripts | Approved commits on GitHub `main` |
| Pull request and push validation | GitHub Actions CI; lint and build only |
| Deployment decision | Explicit human approval of one full commit SHA |
| Production configuration and secrets | VPS infrastructure files outside this repository |
| Runtime release evidence | OCI image labels, immutable rollback tags, and release receipts |

Do not edit application source on the VPS. Do not store credentials, `.env` files, private addresses, or production-only configuration in Git. CI has read-only repository permission and contains no deployment, SSH, registry login, environment, artifact publishing, or self-hosted runner steps.

The application currently has no automated test suite. CI therefore runs the available deterministic checks: `npm ci`, exact-version Linux native bindings without changing the lockfile, `npm run lint`, and `npm run build`. Do not add a fictitious `npm test` step.

## Deployment gates

The deployment script refuses to continue unless all of these conditions hold:

- The host name and online Tailscale self identity match the expected VPS.
- The checkout is clean, attached to `main`, and uses the exact canonical GitHub origin.
- The approved full SHA equals fetched `origin/main` and checked-out `HEAD` after a fast-forward-only pull.
- Rendered `services.portfolio` uses `${PORTFOLIO_IMAGE:-ivansevill/portfolio:production}`, `${PORTFOLIO_BUILD_CONTEXT:-...}`, and the `SOURCE_URL`, `VCS_REF`, and `VERSION` build arguments.
- `npm ci`, lint, and build pass without changing tracked files.
- The candidate is built from a temporary `git archive` of the approved SHA and has matching OCI source, revision, and version labels.
- An isolated candidate container reaches its Docker health check without publishing ports.
- The operator types the complete approved SHA at the confirmation prompt.

If a pull replaces the deployment script, the old process executes the newly approved script exactly once. The script never resets, cleans, stashes, force-pulls, or deploys a commit other than current `origin/main`.

## Release and rollback

Before recreating the service, the script records the running image ID and creates an immutable `ivansevill/portfolio:rollback-<timestamp>-<image-id>` tag. It then points `ivansevill/portfolio:production` at the validated candidate and recreates only the `portfolio` service with `--no-deps --no-build`.

The release must prove its running image ID and OCI revision, pass a bounded container health wait, and pass HTTPS checks for the root domain, `www`, and `/healthz`. Until the atomic release receipt succeeds, any error or `INT`/`TERM` interruption restores the previous image, proves its running image ID, health, and HTTPS, and propagates rollback failures. It does not modify dependent services.

Successful deployments write a non-secret receipt under `/home/ivansevill/infra/releases/portfolio/<timestamp>-<shortsha>.txt`. Receipts identify the commit, image IDs, source, and rollback tag; they must never contain credentials or environment values.

## Dirty checkout recovery

If the VPS checkout is dirty, stop. Investigate why each change exists and preserve evidence before deciding what to do. Never use `git reset`, `git clean`, or automatic stashing to make a deployment pass. Reconcile legitimate source changes through review and GitHub, then restore the VPS to an approved clean commit through an explicit maintenance transaction.

## Production preparation still required

The current production Compose definition is intentionally out of scope for this repository change. Before the first deployment, an authorized production-preparation transaction must:

1. Change the portfolio image to `${PORTFOLIO_IMAGE:-ivansevill/portfolio:production}`.
2. Set the portfolio build context to `${PORTFOLIO_BUILD_CONTEXT:-<repository-path>}` and pass the `SOURCE_URL`, `VCS_REF`, and `VERSION` build arguments.
3. Run `scripts/deploy-vps.sh --check` and verify that every gate passes.

`--check` only reports this pending state. It never edits Compose.
