# User Action Items — Portfolio

## Screenshots to upload

Upload to `public/images/projects/<slug>/` with these exact names:

| Proyecto | Qué capturar | Nombre exacto | Dimensiones |
|----------|-------------|---------------|-------------|
| Kaiprompt | TUI con cola de jobs visible | `kaiprompt-tui.png` | 1440×900 |
| Kaiprompt | Output del comando `--help` | `kaiprompt-help.png` | 1440×900 |
| quota-watch | Output del CLI con barras de quota | `quota-watch-cli.png` | 1440×900 |
| quota-watch | TUI de OpenCode con indicador | `quota-watch-tui.png` | 1280×720 |
| GymHub | Login page (segura, sin datos personales) | `gymhub-login.png` | 1440×900 |
| GymHub | Dashboard/analytics (sintético o redactado) | `gymhub-dashboard.png` | 1440×900 |
| AISS-Miner | Swagger UI local | `aiss-miner-swagger.png` | 1440×900 |
| AISS-Miner | GraphiQL con query | `aiss-miner-graphiql.png` | 1440×900 |

## Decisions

1. **Scroll animations** — Pantallas fijas que se navegan entre ellas (scroll snapping / scroll-driven navigation). No scroll convencional libre.
2. **Performance budget** — LCP < 2.5s, bundle < 250 KB.
3. **Master's focus** — Añadido en el branch de Experience como PLANNED/INTENDED, sin enfocar todo el portfolio a ello.
4. **Screenshots** — Pendiente: ¿los subís vos o los genero yo con comandos reales?

## Tech stack to display

Python, Java, JavaScript, TypeScript, Node, React, FastAPI, FastMCP

## AI section content

- Claude Code (harness para Claude)
- OpenCode (harness para ChatGPT/Codex)
- Codex
- Agentes: SDD y TDD con agentes de IA
- MCPs: Engram (memoria persistente), GitHub, Render/Vercel (despliegue)

## Commit hash

Build-time injection (se inyecta al compilar, no runtime)
