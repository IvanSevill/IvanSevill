# Deploy the portfolio from a release tag

Pushing a semantic-version tag such as `v1.2.3` deploys that exact commit to the VPS only after deployment-script tests, application tests, lint, and the production build pass. The tag must point to the current `main` tip.

## Release path

1. Push the approved commit to `main` and wait for CI to pass.
2. Create an annotated semantic-version tag on that exact commit.
3. Push the tag.
4. Follow the `Deploy production tag` workflow and verify the production environment URL.

```bash
git switch main
git pull --ff-only
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
```

The workflow rejects malformed tags, tags that do not point to the current `origin/main`, failed validation, dirty VPS checkouts, and unexpected tag-to-commit mappings.

## One-time setup

### Tailscale

The VPS is reachable only inside the tailnet. Create a Tailscale OAuth client with writable `auth_keys` scope and permission to create ephemeral nodes tagged `tag:ci`. The tailnet policy must allow `tag:ci` to reach the portfolio VPS on TCP port 22.

Store these repository or `Production` environment secrets:

| Secret | Value |
|---|---|
| `TS_OAUTH_CLIENT_ID` | Tailscale OAuth client ID |
| `TS_OAUTH_SECRET` | Tailscale OAuth client secret |
| `VPS_SSH_HOST` | VPS Tailscale IP or MagicDNS name |
| `VPS_SSH_USER` | Dedicated deployment SSH user |
| `VPS_SSH_KEY` | Private key for the dedicated deployment identity |
| `VPS_SSH_KNOWN_HOSTS` | Trusted `known_hosts` entry for `VPS_SSH_HOST` |

Use a dedicated SSH key, not a personal workstation key. Add its public key to the VPS account and restrict repository/environment secret access to maintainers.

Generate the host-key value from a trusted device already connected to the tailnet, verify the fingerprint against the VPS, and then save the complete output as `VPS_SSH_KNOWN_HOSTS`:

```bash
ssh-keyscan -H 100.92.89.85
```

### GitHub environment

The repository already has a GitHub environment named `Production`. The workflow associates every release with that environment and `https://ivansevill.com`. Do not add required reviewers if tags should deploy without a manual approval step.

## Deployment guarantees

| Gate | Enforcement |
|---|---|
| Release authorization | Exact `vMAJOR.MINOR.PATCH` tag |
| Source commit | Tag SHA must equal current `origin/main` |
| Validation | Bats, Vitest, ESLint, and Vite build must pass |
| Network | Ephemeral `tag:ci` Tailscale node |
| SSH trust | Dedicated key and strict host-key checking |
| Host identity | Hostname and Tailscale self identity must match `ivansevill-vm` |
| Production config | Versioned Compose override supplies image, build context, and OCI provenance arguments |
| Candidate | Isolated container must become healthy before cutover |
| Rollback | Previous image is tagged immutably and restored on any cutover failure |
| Evidence | A release receipt records tag, commit, image IDs, and rollback tag |

The workflow fast-forwards the clean VPS checkout before invoking the tagged deployment script. It never resets, cleans, force-pulls, or stashes the checkout.

## Manual fallback

Manual deployment remains available for recovery and requires interactive confirmation of the full commit SHA:

```bash
ssh ivansevill-vm
cd /home/ivansevill/projects/portfolio
scripts/deploy-vps.sh --check
scripts/deploy-vps.sh --deploy <full-commit-sha>
scripts/verify-production.sh --expected-sha <full-commit-sha>
```

Use `scripts/deploy-vps.sh --dry-run` for read-only prerequisite checks.

## Dirty checkout recovery

If the VPS checkout is dirty, stop and investigate every change. Never use `git reset`, `git clean`, or automatic stashing to make deployment pass. Reconcile legitimate changes through GitHub, then restore a clean approved checkout in a separate maintenance operation.
