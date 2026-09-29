export const FEATURED_PROJECT_SLUGS = [
  'kaiprompt',
  'gymhub',
  'personal-cloud-homelab',
  'quota-watch',
  'aiss-miner',
]

const project = (shared, en, es) => ({ ...shared, content: { en, es } })

export const featuredProjects = [
  project(
    {
      slug: 'kaiprompt',
      name: 'Kaiprompt',
      type: { en: 'Independent developer tool', es: 'Herramienta independiente para desarrollo' },
      status: { en: 'Active development', es: 'Desarrollo activo' },
      role: { en: 'Creator and maintainer', es: 'Creador y mantenedor' },
      stack: ['Node.js', 'ES modules', 'Terminal UI', 'Kotlin', 'Jetpack Compose', 'HTTP', 'SSE', 'AES-256-GCM'],
      links: { github: 'https://github.com/IvanSevill/kaiprompt' },
      deployment: {
        en: 'Local-first CLI/TUI with an optional Android companion; no hosted Kaiprompt backend.',
        es: 'CLI/TUI local con aplicación Android opcional; Kaiprompt no tiene un backend alojado.',
      },
      architectureImage: '/images/projects/kaiprompt/architecture.svg',
      media: [
        {
          src: '/images/projects/kaiprompt/kaiprompt-tui.png',
          width: 934,
          height: 431,
          kind: 'terminal',
          alt: {
            en: 'Kaiprompt TUI showing queued jobs with engine, prompt and status',
            es: 'TUI de Kaiprompt con trabajos en cola, motor, prompt y estado',
          },
          caption: {
            en: 'Kaiprompt queue TUI with synthetic jobs demonstrating the local-first scheduler.',
            es: 'TUI de cola de Kaiprompt con trabajos sintéticos que muestran el planificador local.',
          },
        },
        {
          src: '/images/projects/kaiprompt/cli-help.svg',
          width: 1400,
          height: 820,
          kind: 'terminal',
          alt: {
            en: 'Kaiprompt CLI help showing queue, runner, session and mobile commands',
            es: 'Ayuda real de la CLI de Kaiprompt con comandos de cola, ejecución, sesiones y móvil',
          },
          caption: {
            en: 'Rendered from the real `node kaip.mjs help` output, with paths and user data omitted.',
            es: 'Renderizado a partir de la salida real de `node kaip.mjs help`, sin rutas ni datos personales.',
          },
        },
      ],
    },
    {
      summary: 'A local-first queue and scheduler for Claude Code, Codex and OpenCode jobs, with persistent engine-specific sessions and an Android monitoring companion.',
      eyebrow: 'Local agent orchestration',
      problem: 'Coding-agent work is often interrupted by quota windows or needs to start while nobody is at the terminal. Kaiprompt separates queueing from execution and keeps related jobs attached to the correct engine session.',
      features: [
        'Queues sequential, priority and scheduled jobs without launching them at creation time.',
        'Resumes engine-specific sessions by target and serializes jobs that share a conversation.',
        'Checks fresh provider-aware quota snapshots before launch and keeps exhausted jobs pending until the authoritative reset time.',
        'Provides plain and full-screen runners plus local HTTP/SSE monitoring for the Android companion.',
        'Pairs devices with bearer authentication and AES-256-GCM sealed response payloads.',
      ],
      decisions: [
        'The Node.js core uses only platform APIs, keeping installation and local operation dependency-free.',
        'Engine adapters isolate Claude Code, Codex and OpenCode command and session semantics.',
        'Execution remains on the user machine; remote access is monitoring rather than hosted execution.',
      ],
      challenges: [
        'Mapping each engine to the quota provider that funds it while preserving a safe reactive fallback.',
        'Preserving queue order and session identity across scheduled, sequential and parallel target lanes.',
        'Defining an honest security boundary for local HTTP, remote tunnels and paired mobile clients.',
      ],
      lessons: [
        'Provider adapters need explicit capability differences rather than a false universal abstraction.',
        'Persisted runner state and clear failure semantics matter more than visual polish in unattended tools.',
      ],
      limitations: [
        'Active independent project, not presented as a mature production service.',
        'Jobs do not run while the host machine and runner are offline.',
        'Stale, unavailable or malformed quota snapshots fail open to reactive detection rather than blocking work indefinitely.',
        'Unknown providers retain reactive quota detection because no canonical pre-flight source is available.',
        'The Android companion monitors the queue but deliberately exposes limited mutation controls.',
      ],
      future: [
        'Broaden canonical pre-flight coverage only when a provider exposes a trustworthy quota source.',
        'Continue hardening provider adapters and Android release delivery.',
      ],
    },
    {
      summary: 'Cola y planificador local para trabajos de Claude Code, Codex y OpenCode, con sesiones persistentes por motor y una aplicación Android de monitorización.',
      eyebrow: 'Orquestación local de agentes',
      problem: 'El trabajo con agentes de código suele interrumpirse por ventanas de cuota o necesita empezar sin nadie frente al terminal. Kaiprompt separa la creación de la cola de su ejecución y conserva cada trabajo en la sesión correcta del motor.',
      features: [
        'Encola trabajos secuenciales, prioritarios y programados sin ejecutarlos al crearlos.',
        'Reanuda sesiones específicas de cada motor por objetivo y serializa trabajos de una misma conversación.',
        'Consulta cuotas por proveedor antes de ejecutar y mantiene los trabajos agotados pendientes hasta la hora de restablecimiento autoritativa.',
        'Incluye ejecutores en texto y pantalla completa, además de monitorización HTTP/SSE local para Android.',
        'Empareja dispositivos con autenticación bearer y respuestas selladas con AES-256-GCM.',
      ],
      decisions: [
        'El núcleo Node.js usa únicamente APIs de la plataforma para mantener una instalación sin dependencias.',
        'Los adaptadores aíslan las diferencias de comandos y sesiones de Claude Code, Codex y OpenCode.',
        'La ejecución permanece en el equipo local; el acceso remoto monitoriza, no hospeda los trabajos.',
      ],
      challenges: [
        'Relacionar cada motor con el proveedor que financia su cuota sin perder un fallback reactivo seguro.',
        'Conservar orden e identidad de sesión entre carriles programados, secuenciales y paralelos.',
        'Definir un límite de seguridad honesto para HTTP local, túneles remotos y clientes emparejados.',
      ],
      lessons: [
        'Los adaptadores deben expresar diferencias de capacidad y evitar una abstracción universal ficticia.',
        'El estado persistente y una semántica clara de fallos importan más que el acabado visual en herramientas desatendidas.',
      ],
      limitations: [
        'Proyecto independiente activo, no presentado como servicio maduro de producción.',
        'Los trabajos no se ejecutan si el equipo y el runner están apagados.',
        'Las capturas de cuota obsoletas, ausentes o malformadas permiten ejecutar y delegan la detección al flujo reactivo.',
        'Los proveedores desconocidos conservan la detección reactiva porque no existe una fuente canónica previa.',
        'La aplicación Android monitoriza la cola y limita deliberadamente las operaciones de escritura.',
      ],
      future: [
        'Ampliar la comprobación previa solo cuando un proveedor disponga de una fuente de cuota fiable.',
        'Seguir endureciendo adaptadores y la distribución de versiones Android.',
      ],
    },
  ),
  project(
    {
      slug: 'gymhub',
      name: 'GymHub',
      type: { en: 'Independent personal product and bachelor capstone', es: 'Producto personal independiente y trabajo de fin de grado' },
      status: { en: 'Active development', es: 'Desarrollo activo' },
      role: { en: 'Creator and full-stack developer', es: 'Creador y desarrollador full-stack' },
      stack: ['React 19', 'TypeScript', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Google Calendar', 'Fitbit', 'Gemini', 'MCP'],
      links: { github: 'https://github.com/IvanSevill/GymHub' },
      deployment: {
        en: 'Designed as a responsive web application; deployment availability is not asserted here.',
        es: 'Diseñada como aplicación web responsive; aquí no se afirma disponibilidad de despliegue.',
      },
      architectureImage: '/images/projects/gymhub/architecture.svg',
      media: [
        {
          src: '/images/projects/gymhub/gymhub-dashboard.png',
          width: 1107,
          height: 631,
          kind: 'screenshot',
          alt: {
            en: 'GymHub analytics dashboard with workout volume, frequency and personal records',
            es: 'Panel de analítica de GymHub con volumen, frecuencia y récords personales',
          },
          caption: {
            en: 'GymHub analytics dashboard with synthetic training data.',
            es: 'Panel de analítica de GymHub con datos sintéticos de entrenamiento.',
          },
        },
        {
          src: '/images/projects/gymhub/login-page.webp',
          width: 1135,
          height: 748,
          kind: 'screenshot',
          alt: {
            en: 'GymHub login screen with Google sign-in and product feature summary',
            es: 'Pantalla de acceso de GymHub con inicio de sesión de Google y resumen del producto',
          },
          caption: {
            en: 'Genuine login screen from the project documentation; it contains no account or health data.',
            es: 'Pantalla de acceso real de la documentación del proyecto; no contiene datos de cuenta ni salud.',
          },
        },
      ],
    },
    {
      summary: 'A responsive React fitness platform with a FastAPI core, calendar and Fitbit integrations, analytics, and a separate Gemini assistant service backed by 27 MCP tools.',
      eyebrow: 'Personal fitness data platform',
      problem: 'Workout logs, calendar plans and wearable data live in separate systems. GymHub joins them into one single-user workspace that turns raw records into actionable training context.',
      features: [
        'Creates and tracks workouts with bidirectional Google Calendar synchronization.',
        'Imports Fitbit activity, sleep and health summaries and relates activity to workout sessions.',
        'Presents responsive analytics for volume, frequency, personal records, duration and muscle balance.',
        'Runs a separate FastAPI AI service that streams Gemini responses over SSE.',
        'Exposes 27 MCP tools through a dedicated server for authenticated read and write workflows.',
      ],
      decisions: [
        'React and Vite provide a focused SPA while TanStack Query owns remote server state.',
        'FastAPI and SQLAlchemy keep validation, API boundaries and local/hosted databases explicit.',
        'The AI service never reads the database directly; it reaches user data through authenticated backend APIs.',
      ],
      challenges: [
        'Keeping Calendar and Fitbit synchronization understandable when external providers partially fail.',
        'Building useful analytics around flexible historical set-value notation.',
        'Maintaining user authentication across the web core, AI service and per-request MCP process.',
      ],
      lessons: [
        'External integrations need visible partial-success diagnostics, not a single optimistic success flag.',
        'Separating the assistant service reduces coupling and makes AI availability independent from core tracking.',
      ],
      limitations: [
        'Single-user personal product rather than a general multi-tenant platform.',
        'No Android application is part of GymHub; the client is a responsive React web app.',
        'This portfolio does not claim current production availability or a current coverage percentage.',
        'No license claim is made because the repository does not currently contain a LICENSE file.',
      ],
      future: [
        'Continue improving synchronization diagnostics and recovery.',
        'Expand analytics only where additional metrics lead to clear training decisions.',
      ],
    },
    {
      summary: 'Plataforma web responsive de fitness con React, núcleo FastAPI, integraciones con Calendar y Fitbit, analítica y un servicio Gemini separado respaldado por 27 herramientas MCP.',
      eyebrow: 'Plataforma personal de datos de entrenamiento',
      problem: 'Los entrenamientos, la planificación y los datos del wearable viven en sistemas distintos. GymHub los reúne en un espacio personal que convierte registros en contexto útil para entrenar.',
      features: [
        'Crea y registra entrenamientos con sincronización bidireccional de Google Calendar.',
        'Importa actividad, sueño y salud de Fitbit y relaciona cada actividad con su entrenamiento.',
        'Ofrece analítica responsive de volumen, frecuencia, récords, duración y equilibrio muscular.',
        'Ejecuta un servicio FastAPI de IA separado que transmite respuestas de Gemini mediante SSE.',
        'Expone 27 herramientas MCP en un servidor dedicado para flujos autenticados de lectura y escritura.',
      ],
      decisions: [
        'React y Vite forman una SPA enfocada, mientras TanStack Query gestiona el estado remoto.',
        'FastAPI y SQLAlchemy explicitan validación, límites API y bases de datos locales o alojadas.',
        'El servicio de IA no accede directamente a la base de datos; usa las APIs autenticadas del backend.',
      ],
      challenges: [
        'Hacer comprensibles los fallos parciales de sincronización con Calendar y Fitbit.',
        'Construir analítica útil sobre la notación flexible de series históricas.',
        'Mantener la identidad entre núcleo web, servicio de IA y proceso MCP por petición.',
      ],
      lessons: [
        'Las integraciones externas necesitan diagnósticos de éxito parcial, no una única señal optimista.',
        'Separar el asistente reduce acoplamiento y desacopla su disponibilidad del registro principal.',
      ],
      limitations: [
        'Producto personal para un usuario, no plataforma multiusuario general.',
        'GymHub no incluye una aplicación Android; el cliente es una web React responsive.',
        'No se afirma disponibilidad actual en producción ni un porcentaje actual de cobertura.',
        'No se afirma una licencia porque el repositorio no contiene actualmente un archivo LICENSE.',
      ],
      future: [
        'Seguir mejorando el diagnóstico y recuperación de sincronizaciones.',
        'Ampliar la analítica solo cuando nuevas métricas conduzcan a decisiones claras.',
      ],
    },
  ),
  project(
    {
      slug: 'personal-cloud-homelab',
      name: 'Personal Cloud & Homelab',
      type: { en: 'Independent infrastructure case study', es: 'Caso independiente de infraestructura' },
      status: { en: 'Implemented and maintained', es: 'Implementado y mantenido' },
      role: { en: 'Infrastructure designer and operator', es: 'Diseñador y operador de infraestructura' },
      stack: ['Ubuntu ARM64', 'Oracle/KVM', 'Docker Compose', 'Reverse proxy', 'Tailscale', 'SMB', 'Restic', 'Uptime Kuma', 'Netdata', 'Pi-hole'],
      links: {},
      deployment: {
        en: 'Private infrastructure under the public-safe host label `ivansevill-vm`; no public repository is required.',
        es: 'Infraestructura privada bajo el nombre público seguro `ivansevill-vm`; no requiere repositorio público.',
      },
      architectureImage: '/images/projects/personal-cloud-homelab/architecture.svg',
      media: [],
    },
    {
      summary: 'A private Ubuntu ARM64 cloud and homelab environment with containerized services, private access, layered monitoring and tested encrypted Vaultwarden recovery.',
      eyebrow: 'Private infrastructure case study',
      problem: 'A useful personal platform needs repeatable operations, private access and recoverable state without exposing the services or operational details that make it safe.',
      features: [
        'Runs Docker Compose stacks on an Ubuntu ARM64 Oracle/KVM virtual machine.',
        'Combines reverse proxying with Tailscale and private DNS for intentionally separated access paths.',
        'Uses SMB-backed central storage for persistent service data where appropriate.',
        'Monitors availability, hosts, DNS and container health with multiple independent signals and Sentinel checks.',
        'Creates encrypted Restic backups for Vaultwarden and has completed an isolated restore test.',
        'Uses a GitHub-first release workflow for this portfolio.',
      ],
      decisions: [
        'Public documentation describes control layers and outcomes while omitting addresses, private names and service inventory.',
        'Private-network access is the default for sensitive services instead of relying only on application login screens.',
        'Recovery is treated as a tested procedure, not merely a successful backup command.',
      ],
      challenges: [
        'Keeping operational documentation useful without publishing attack-useful topology.',
        'Coordinating persistent data across a virtual machine and network-backed storage.',
        'Separating health signals so a single failed monitor cannot define the whole system state.',
      ],
      lessons: [
        'A backup becomes trustworthy only after an isolated restore demonstrates usable data.',
        'Architecture documentation should state residual failure domains as clearly as implemented controls.',
      ],
      limitations: [
        'Central storage remains a single, non-redundant failure domain.',
        'The encrypted Vaultwarden backup is off-host from the VPS, but the system is not presented as full 3-2-1 backup coverage.',
        'Addresses, private hostnames, internal service inventory and security-sensitive configuration are intentionally omitted.',
      ],
      future: [
        'AI infrastructure is planned exploration, not an implemented capability.',
        'Add independent storage redundancy and broaden restore exercises before claiming stronger resilience.',
      ],
    },
    {
      summary: 'Entorno privado de nube y homelab sobre Ubuntu ARM64 con servicios en contenedores, acceso privado, monitorización por capas y recuperación cifrada de Vaultwarden probada.',
      eyebrow: 'Caso de estudio de infraestructura privada',
      problem: 'Una plataforma personal útil necesita operaciones repetibles, acceso privado y estado recuperable sin exponer los detalles operativos que la mantienen segura.',
      features: [
        'Ejecuta stacks Docker Compose en una máquina virtual Ubuntu ARM64 sobre Oracle/KVM.',
        'Combina proxy inverso, Tailscale y DNS privado para separar intencionadamente las vías de acceso.',
        'Usa almacenamiento central mediante SMB para datos persistentes cuando corresponde.',
        'Monitoriza disponibilidad, host, DNS y salud de contenedores con señales independientes y Sentinel.',
        'Genera copias Restic cifradas de Vaultwarden y ha completado una restauración aislada.',
        'Aplica un flujo GitHub-first para publicar este portfolio.',
      ],
      decisions: [
        'La documentación pública explica controles y resultados sin direcciones, nombres privados ni inventario.',
        'Los servicios sensibles usan acceso por red privada en lugar de depender solo del inicio de sesión.',
        'La recuperación se trata como procedimiento probado, no como un comando de copia exitoso.',
      ],
      challenges: [
        'Documentar operaciones sin publicar una topología útil para un atacante.',
        'Coordinar datos persistentes entre una máquina virtual y almacenamiento de red.',
        'Separar señales de salud para que un monitor no defina por sí solo el estado completo.',
      ],
      lessons: [
        'Una copia solo es fiable cuando una restauración aislada demuestra que sus datos son utilizables.',
        'La arquitectura debe declarar los dominios de fallo residuales con la misma claridad que los controles.',
      ],
      limitations: [
        'El almacenamiento central sigue siendo un punto de fallo único sin redundancia.',
        'La copia cifrada de Vaultwarden está fuera del VPS, pero no se presenta como una estrategia 3-2-1 completa.',
        'Se omiten deliberadamente direcciones, nombres privados, inventario y configuración sensible.',
      ],
      future: [
        'La infraestructura de IA es una exploración planificada, no una capacidad implementada.',
        'Añadir redundancia de almacenamiento y ampliar las pruebas antes de afirmar mayor resiliencia.',
      ],
    },
  ),
  project(
    {
      slug: 'quota-watch',
      name: 'quota-watch',
      type: { en: 'Independent developer tool', es: 'Herramienta independiente para desarrollo' },
      status: { en: 'Active development', es: 'Desarrollo activo' },
      role: { en: 'Creator and maintainer', es: 'Creador y mantenedor' },
      stack: ['Node.js', 'ES modules', 'Claude Code', 'Codex app-server', 'OpenCode plugin', 'Terminal UI'],
      links: { github: 'https://github.com/IvanSevill/quota-watch' },
      deployment: {
        en: 'Local-first command-line and OpenCode integration; no hosted service or npm publication is claimed.',
        es: 'Integración local de línea de comandos y OpenCode; no se afirma servicio alojado ni publicación en npm.',
      },
      architectureImage: '/images/projects/quota-watch/architecture.svg',
      media: [
        {
          src: '/images/projects/quota-watch/quota-watch-tui.png',
          width: 430,
          height: 238,
          kind: 'terminal',
          alt: {
            en: 'quota-watch indicator inside OpenCode TUI showing Claude and Codex quota status',
            es: 'Indicador de quota-watch en la TUI de OpenCode con cuotas de Claude y Codex',
          },
          caption: {
            en: 'quota-watch OpenCode TUI indicator with synthetic quota data.',
            es: 'Indicador de quota-watch en la TUI de OpenCode con datos sintéticos.',
          },
        },
        {
          src: '/images/projects/quota-watch/quota-terminal.svg',
          width: 1400,
          height: 760,
          kind: 'terminal',
          alt: {
            en: 'Synthetic quota-watch terminal sample showing Claude and Codex freshness-aware quota data',
            es: 'Muestra sintética de quota-watch con cuotas de Claude y Codex y estado de frescura',
          },
          caption: {
            en: 'Synthetic, non-sensitive values rendered in the real documented CLI/schema format; local execution had no usage snapshot available.',
            es: 'Valores sintéticos y no sensibles con el formato real documentado; la ejecución local no disponía de una captura de uso.',
          },
        },
      ],
    },
    {
      summary: 'A local-first Node.js tool that normalizes Claude and Codex quota data, freshness and fallback provenance for people, scripts and OpenCode.',
      eyebrow: 'Quota observability',
      problem: 'Claude and Codex expose limits through different local surfaces. Automation needs one bounded schema that says not only what a value is, but how fresh and trustworthy it is.',
      features: [
        'Reads Claude quota snapshots captured by the status-line integration.',
        'Uses the Codex local app-server first and a tightly allow-listed rollout fallback when required.',
        'Normalizes provider, source, freshness, limits, credits and reached state into a provider-neutral schema.',
        'Caches last-known-good values and marks stale data instead of silently presenting it as current.',
        'Exposes CLI, OpenCode server-tool and optional TUI integrations.',
      ],
      decisions: [
        'The core uses zero runtime dependencies and does not read credentials or make its own network calls.',
        'Every fallback identifies its source and official status rather than hiding provenance.',
        'The optional OpenCode TUI has its own dependencies and is not described as dependency-free.',
      ],
      challenges: [
        'Normalizing different quota window shapes without inventing precision a provider does not expose.',
        'Extracting only allow-listed rate-limit records from local Codex rollouts.',
        'Treating stale, unavailable and exhausted states as distinct automation outcomes.',
      ],
      lessons: [
        'Freshness and provenance belong in the domain schema, not in UI-only warning text.',
        'A conservative unknown state is safer than converting missing provider data into zero.',
      ],
      limitations: [
        'Implemented provider collection covers Claude and Codex only.',
        'Gemini and generic OpenAI provider support are not claimed.',
        'No npm publication, production proof or precise cumulative context accounting is claimed.',
        'Codex rollout parsing is a bounded best-effort fallback and is labeled unofficial.',
      ],
      future: [
        'Add providers only after a verifiable local source and explicit freshness contract exist.',
        'Continue validating the optional TUI against real OpenCode host behavior.',
      ],
    },
    {
      summary: 'Herramienta Node.js local que normaliza cuota, frescura y procedencia de Claude y Codex para personas, scripts y OpenCode.',
      eyebrow: 'Observabilidad de cuota',
      problem: 'Claude y Codex exponen límites mediante superficies locales distintas. La automatización necesita un esquema acotado que indique valor, frescura y procedencia.',
      features: [
        'Lee capturas de cuota de Claude generadas por la integración de la línea de estado.',
        'Usa primero el app-server local de Codex y un fallback de rollout estrictamente limitado.',
        'Normaliza proveedor, fuente, frescura, límites, créditos y estado en un esquema neutral.',
        'Conserva el último valor válido y marca datos obsoletos en vez de presentarlos como actuales.',
        'Ofrece CLI, herramienta de servidor OpenCode e integración TUI opcional.',
      ],
      decisions: [
        'El núcleo no tiene dependencias de ejecución, no lee credenciales y no realiza llamadas de red propias.',
        'Cada fallback identifica su procedencia y carácter oficial.',
        'La TUI opcional de OpenCode tiene sus propias dependencias y no se presenta como libre de dependencias.',
      ],
      challenges: [
        'Normalizar ventanas distintas sin inventar una precisión que el proveedor no ofrece.',
        'Extraer únicamente registros de cuota permitidos de los rollouts locales de Codex.',
        'Tratar obsolescencia, indisponibilidad y agotamiento como resultados diferentes.',
      ],
      lessons: [
        'La frescura y procedencia pertenecen al esquema de dominio, no solo a avisos visuales.',
        'Un estado desconocido conservador es más seguro que convertir datos ausentes en cero.',
      ],
      limitations: [
        'La recolección implementada cubre únicamente Claude y Codex.',
        'No se afirma soporte para Gemini ni para un proveedor OpenAI genérico.',
        'No se afirma publicación npm, prueba de producción ni contexto acumulado preciso.',
        'El análisis de rollouts de Codex es un fallback acotado y se identifica como no oficial.',
      ],
      future: [
        'Añadir proveedores solo cuando exista una fuente local verificable y un contrato explícito de frescura.',
        'Seguir validando la TUI opcional en el host real de OpenCode.',
      ],
    },
  ),
  project(
    {
      slug: 'aiss-miner',
      name: 'AISS-Miner',
      type: { en: 'Academic team project', es: 'Proyecto académico en equipo' },
      status: { en: 'Completed academic prototype', es: 'Prototipo académico completado' },
      role: { en: 'Co-developer and public repository curator', es: 'Codesarrollador y responsable del repositorio público' },
      stack: ['Java 21', 'Spring Boot', 'REST', 'GraphQL', 'JPA', 'H2', 'GitHub API', 'GitLab API', 'Bitbucket API'],
      links: { github: 'https://github.com/IvanSevill/AISS-Miner' },
      deployment: {
        en: 'Academic prototype with no verified live deployment.',
        es: 'Prototipo académico sin despliegue en vivo verificado.',
      },
      architectureImage: '/images/projects/aiss-miner/architecture.svg',
      media: [
        {
          src: '/images/projects/aiss-miner/aiss-miner-swagger.png',
          width: 1293,
          height: 551,
          kind: 'screenshot',
          alt: {
            en: 'AISS-Miner local Swagger UI showing REST API endpoints',
            es: 'Swagger UI local de AISS-Miner con endpoints REST',
          },
          caption: {
            en: 'AISS-Miner local Swagger UI with REST API endpoints.',
            es: 'Swagger UI local de AISS-Miner con endpoints REST.',
          },
        },
        {
          src: '/images/projects/aiss-miner/aiss-miner-graphiql.png',
          width: 700,
          height: 501,
          kind: 'screenshot',
          alt: {
            en: 'AISS-Miner GraphiQL interface with a query and JSON response',
            es: 'Interfaz GraphiQL de AISS-Miner con consulta y respuesta JSON',
          },
          caption: {
            en: 'AISS-Miner GraphiQL query with JSON response.',
            es: 'Consulta GraphiQL de AISS-Miner con respuesta JSON.',
          },
        },
      ],
    },
    {
      summary: 'A three-person academic integration project where three Spring adapters normalize GitHub, GitLab and Bitbucket repository data into a central GitMiner core.',
      eyebrow: 'Secondary academic case study',
      problem: 'Repository platforms expose similar concepts through incompatible APIs. The project explored a canonical model that lets one core ingest and query repositories from three providers.',
      features: [
        'Three Spring Boot adapters map GitHub, GitLab and Bitbucket responses into a common model.',
        'A central GitMiner service exposes REST and GraphQL interfaces.',
        'JPA persists canonical repositories, commits, issues, comments and users in H2.',
        'Adapter-to-core flows demonstrate cross-service normalization in an academic setting.',
      ],
      decisions: [
        'Provider concerns stay in separate adapters while the core owns canonical persistence and query APIs.',
        'The project favors a visible multi-service integration model over a single provider-switching codebase.',
      ],
      challenges: [
        'Reconciling provider fields and identifiers into one shared domain model.',
        'Keeping REST forwarding and GraphQL naming aligned across independently developed modules.',
      ],
      lessons: [
        'Canonical models need explicit provider identity when source identifiers can collide.',
        'Integration errors must propagate consistently; an upstream failure cannot be hidden behind a success response.',
      ],
      limitations: [
        'Academic prototype, not a production, analytics or deployment case study.',
        'H2 persistence is transient and there is no verified CI, release or live service.',
        'Specific module ownership is not attributed because the public aggregate history was re-uploaded and flattened.',
        'No valid MIT license claim is made because the repository has no LICENSE file.',
      ],
      future: [
        'Add provider-qualified identifiers and durable persistence.',
        'Align GraphQL examples with the schema and propagate adapter failures with accurate HTTP status.',
        'Replace live-API smoke tests with deterministic contract fixtures.',
      ],
    },
    {
      summary: 'Proyecto académico de tres personas donde tres adaptadores Spring normalizan datos de GitHub, GitLab y Bitbucket en un núcleo GitMiner central.',
      eyebrow: 'Caso académico secundario',
      problem: 'Las plataformas de repositorios exponen conceptos similares mediante APIs incompatibles. El proyecto exploró un modelo canónico para ingerir y consultar tres proveedores desde un núcleo.',
      features: [
        'Tres adaptadores Spring Boot transforman respuestas de GitHub, GitLab y Bitbucket a un modelo común.',
        'Un servicio GitMiner central expone interfaces REST y GraphQL.',
        'JPA persiste repositorios, commits, incidencias, comentarios y usuarios canónicos en H2.',
        'Los flujos adaptador-núcleo demuestran normalización entre servicios en un entorno académico.',
      ],
      decisions: [
        'Cada adaptador contiene las particularidades del proveedor y el núcleo gestiona persistencia y consultas.',
        'El proyecto prioriza un modelo visible de integración multiservicio frente a un único código con conmutadores.',
      ],
      challenges: [
        'Conciliar campos e identificadores de proveedores en un dominio compartido.',
        'Mantener alineados el reenvío REST y los nombres GraphQL entre módulos independientes.',
      ],
      lessons: [
        'Los modelos canónicos necesitan identidad de proveedor cuando los identificadores pueden colisionar.',
        'Los errores de integración deben propagarse; un fallo upstream no puede ocultarse tras una respuesta exitosa.',
      ],
      limitations: [
        'Prototipo académico, no caso de producción, analítica ni despliegue.',
        'La persistencia H2 es transitoria y no hay CI, versión ni servicio en vivo verificados.',
        'No se atribuyen módulos concretos porque el historial público agregado fue reimportado y aplanado.',
        'No se afirma una licencia MIT válida porque el repositorio carece de archivo LICENSE.',
      ],
      future: [
        'Añadir identificadores cualificados por proveedor y persistencia duradera.',
        'Alinear ejemplos GraphQL con el esquema y propagar fallos con estados HTTP correctos.',
        'Sustituir smoke tests contra APIs reales por fixtures de contrato deterministas.',
      ],
    },
  ),
]

export const secondaryProjects = [
  { name: 'Heat Distribution', stack: 'C++ · OpenMP · Raylib', href: 'https://github.com/IvanSevill/HeatDistribution' },
  { name: 'USB-GPT', stack: 'Python · local LLM', href: 'https://github.com/IvanSevill/Usb-GPT' },
  { name: 'AI Travel Assistant', stack: 'Python · Streamlit · Gemini', href: 'https://github.com/IvanSevill/AI-travel-assistant' },
  { name: 'LensPort Extension', stack: 'JavaScript · OCR · Flask', href: 'https://github.com/IvanSevill/LensPortExtension' },
  { name: 'Rock Paper Scissors', stack: 'React · FastAPI · MediaPipe', href: 'https://github.com/IvanSevill/RockPaperScissors' },
]

export function getProjectBySlug(slug) {
  return featuredProjects.find((item) => item.slug === slug)
}

export function getLocalizedProject(projectData, language = 'en') {
  if (!projectData) return undefined
  const locale = language.toLowerCase().startsWith('es') ? 'es' : 'en'
  const localizedFacts = Object.fromEntries(
    ['type', 'status', 'role', 'deployment'].map((key) => [key, projectData[key][locale]]),
  )
  const pendingMedia = (projectData.pendingMedia ?? []).map((item) => ({
    ...item,
    title: item.title[locale],
  }))
  return { ...projectData, ...localizedFacts, ...projectData.content[locale], pendingMedia, locale }
}

export function projectPath(slug) {
  return `/projects/${slug}`
}
