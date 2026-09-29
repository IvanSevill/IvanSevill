# CI/CD Requirements — Portfolio

## Current state (IvanSevill/IvanSevill)

Single workflow `.github/workflows/ci.yml`:
- Triggers: PR + push to `main`
- Jobs: test:scripts (Bats), lint, build
- **No deployment step**
- **No tag trigger**
- **No commit message validation**

## Reference: uvlhub_practicas CI/CD analysis

### CI workflows

| File | Trigger | What it does |
|------|---------|--------------|
| `CI_commits.yml` | Every push + PR | Validates conventional commits via `webiny/action-conventional-commits@v1.3.0` |
| `CI_lint.yml` | Every push + PR | Python lint: flake8, black, isort |
| `CI_pytest.yml` | Push to `main` + PR to `main` | pytest with MariaDB service container |

### CD workflows

| File | Trigger | What it does |
|------|---------|--------------|
| `CD_dockerhub.yml` | Release published | Builds + pushes Docker image to Docker Hub |
| `CD_webhook.yml` | Push/PR to `main` | Deploy to Render via webhook URL |

### Other

| File | Purpose |
|------|---------|
| `codacy.yml` | Code quality analysis |

### Key patterns to adopt

1. **Commit validation in CI** — `webiny/action-conventional-commits` enforces conventional commits on every push/PR
2. **Separate CI and CD workflows** — validation is independent from deployment
3. **Tag/release-based CD** — Docker Hub publish only on `release: published`, not on every push
4. **Service containers for integration tests** — MariaDB as a service in pytest workflow

## Definitive workflow

No PRs. Direct push to `main`. CI validates on every push. CD deploys only on tag, and only if CI passed.

```
push a main → CI valida:
  ├── commit-message-check  (conventional commits)
  ├── test:scripts           (Bats — hermetic)
  ├── lint
  └── build
        ↓
   todo verde → podés taggear
   algo falla → arreglás y volvés a pushar

tag v1.0.0 → CD verifica que CI pasó en ese commit → despliega al VPS
```

### Deployment conditions

1. **Tests pass** — Bats + lint + build all green on the tagged commit
2. **Commit follows conventional commits** — enforced by CI
3. **Tag matches `v*.*.*` pattern** — no arbitrary tags trigger deployment
4. **Tag points to a commit on `main`** — no direct-to-production from feature branches

### Tag strategy

- Format: `v{major}.{minor}.{patch}` (e.g., `v1.0.0`, `v1.2.3`)
- Created only after CI is green on `main`
- The tag itself is the deployment authorization — no manual step needed
- Semantic versioning: major = breaking, minor = feature, patch = fix

### Commit standard

Follow conventional commits (already used in the repo):
- `feat(scope): description`
- `fix(scope): description`
- `chore(scope): description`
- `test(scope): description`
- `docs(scope): description`
- `refactor(scope): description`

### Secrets needed in GitHub

| Secret | Purpose |
|--------|---------|
| `VPS_SSH_HOST` | Target host for deployment |
| `VPS_SSH_USER` | SSH user |
| `VPS_SSH_KEY` | Private key for deployment |
| `VPS_DEPLOY_PATH` | Path on VPS where portfolio lives |

## Open questions for Agent A

1. Should the deploy job reuse the CI workflow via `workflow_call` or duplicate steps?
2. Should we use GitHub Environments with required reviewers for production?
3. How to handle rollback — git revert + retag, or keep previous image and switch back?
4. Should the Docker image be tagged with both the version tag and the commit SHA?

## User action items (things YOU need to do)

### Screenshots to upload
Upload to `public/images/projects/<slug>/` with these exact names:

| Proyecto | Qué capturar | Nombre exacto |
|----------|-------------|---------------|
| Kaiprompt | TUI con cola de jobs visible | `kaiprompt-tui.png` |
| Kaiprompt | Output del comando `--help` | `kaiprompt-help.png` |
| quota-watch | Output del CLI con barras de quota | `quota-watch-cli.png` |
| quota-watch | TUI de OpenCode con indicador | `quota-watch-tui.png` |
| GymHub | Login page (segura) | `gymhub-login.png` |
| GymHub | Dashboard/analytics (sintético) | `gymhub-dashboard.png` |
| AISS-Miner | Swagger UI local | `aiss-miner-swagger.png` |
| AISS-Miner | GraphiQL con query | `aiss-miner-graphiql.png` |

Suggested dimensions: 1440×900 for desktop, 1280×720 for TUI captures.

### Things to clarify (pending your decision)

1. **Scroll animations** — Pantallas fijas que se navegan entre ellas (scroll snapping / scroll-driven navigation). No scroll convencional libre.
2. **Performance budget** — LCP < 2.5s, bundle < 250 KB.
3. **Master's focus** — Añadido en el branch de Experience como PLANNED/INTENDED, sin enfocar todo el portfolio a ello.
4. **Screenshots** — Pendiente: ¿los subís vos o los genero yo con comandos reales?

## References

- uvlhub_practicas: https://github.com/IvanSevill/uvlhub_practicas
- Conventional Commits: https://www.conventionalcommits.org/
- webiny/action-conventional-commits: https://github.com/webiny/action-conventional-commits
