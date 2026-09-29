# Kaiprompt Fix — Pre-flight Quota Check

## Problem

Kaiprompt marked jobs as "running" and launched the adapter BEFORE checking if quota was available. When quota was exhausted, the adapter would fail immediately, but the job already showed as "running" briefly before being requeued.

## Root Cause

In `execution-loop.mjs`, the `start()` function called `markRunning(job)` before launching the adapter. Quota detection was **reactive** (after failure) not **proactive** (before launch).

## Fix

Added a provider-aware pre-flight quota check before `markRunning()`:

- `src/adapters/quota-client.mjs` maps each job to the quota provider that funds it. Claude jobs use Claude quota; Codex and OpenCode/OpenAI jobs use Codex quota.
- `src/core/quota-retry.mjs` converts fresh canonical quota snapshots into either `launch` or `pause` decisions.
- `src/runner/execution-loop.mjs` checks quota before claiming capacity or marking the job as running.
- `src/runner/lifecycle.mjs` persists a paused job as `pending` until the authoritative reset time plus a 60-second grace period.
- Stale, unavailable, or malformed quota data fails open to the existing reactive detection path instead of blocking work indefinitely.

## Behavior

- **Claude**: checks the canonical Claude quota snapshot before launch.
- **Codex**: checks the canonical Codex quota snapshot before launch.
- **OpenCode with OpenAI**: maps to the same Codex entitlement and quota snapshot.
- **Other or unknown providers**: launch normally and retain reactive quota detection.
- A fresh exhausted window keeps the job pending until the latest active reset plus 60 seconds.
- Stale or unavailable snapshots do not block launch.

## Dockerization

Kaiprompt can be dockerized. The Dockerfile would:

1. Use a Node.js base image
2. Copy the repository
3. Set up the data volume for `~/.kaiprompt/`
4. Expose the API port
5. Run the daemon or TUI

Example Dockerfile structure:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
VOLUME ["/root/.kaiprompt"]
EXPOSE 3000
CMD ["node", "kaiprompt.mjs", "daemon", "start"]
```

This would allow running Kaiprompt in a container with persistent storage for the queue, sessions, and usage data.

## Time Discrepancy Note

The discrepancy was caused by two different data sources:

1. The approximately 3h41m value came from the canonical Codex quota snapshot and its authoritative reset timestamp.
2. The approximately 4h54m value came from reactive detection after OpenCode returned an exhausted-quota error without reset metadata. That path conservatively assumed a five-hour wait; the displayed value was the remaining portion of that fallback.

The pre-flight check now prefers the canonical timestamp. The 60-second grace period only adds one minute; it did not explain the earlier difference.

## Verification

- Focused quota tests: 44/44 passing.
- Architecture check: passing with zero cycles and zero forbidden dependencies.
- Syntax checks: passing.
- Full Node test suite: 548/550 passing. The remaining runner path and daemon takeover failures are outside this change's touched behavior and are tracked separately.

## Related Documents

- `docs/portfolio/cicd-requirements.md` — CI/CD workflow requirements
- `docs/portfolio/user-action-items.md` — user action items and pending decisions
