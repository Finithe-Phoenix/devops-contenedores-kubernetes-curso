// generate.js — Genera los 4 decks del curso (instructor) en ESPAÑOL e INGLÉS.
// Una sola fuente: tr("es", "en") elige el idioma. Ejecuta:  node generate.js
const lib = require("./lib");
const { content, bullets, codePanel, card, steps, callout, table, titleSlide, closing, newDeck, C } = lib;

let LANG = "es";
const tr = (es, en) => (LANG === "es" ? es : en);
const FOOTER = "Tecnológico de Toluca · Daniel E. González Ramírez · 24 h";

// ====================================================================
// DECK 1 — Día 1: Fundamentos DevOps, Git y Docker
// ====================================================================
function deck1() {
  const p = newDeck(tr("Día 1 — DevOps y Docker", "Day 1 — DevOps and Docker"));
  titleSlide(p, tr("CURSO-TALLER · DÍA 1", "WORKSHOP · DAY 1"),
    tr("Fundamentos DevOps,\nGit y Docker", "DevOps Fundamentals,\nGit and Docker"),
    tr("De código fuente a contenedor en ejecución", "From source code to a running container"), FOOTER);

  let s = content(p, 1, tr("// agenda · 4 días", "// agenda · 4 days"), tr("El viaje de los próximos 4 días", "The journey of the next 4 days"));
  steps(s, [tr("Docker", "Docker"), tr("Compose +\nCI/CD", "Compose +\nCI/CD"), tr("Kubernetes\n+ Helm", "Kubernetes\n+ Helm"), tr("Observar +\nSeguridad", "Observe +\nSecurity")], 2.0);
  bullets(s, [
    { text: tr("Día 1: contenerizamos una app desde cero.", "Day 1: we containerize an app from scratch."), bold: true },
    tr("Día 2: la levantamos con su base de datos y la automatizamos.", "Day 2: we run it with its database and automate it."),
    tr("Día 3: la desplegamos, escalamos y actualizamos en Kubernetes.", "Day 3: we deploy, scale and update it on Kubernetes."),
    tr("Día 4: la monitoreamos, aseguramos y la convertimos en práctica docente.", "Day 4: we monitor it, secure it and turn it into a teaching lab."),
  ], { y: 3.2, h: 2.1, fontSize: 15 });

  s = content(p, 2, tr("// el problema", "// the problem"), tr("\"En mi máquina sí funciona\"", "\"It works on my machine\""));
  callout(s, tr("El clásico que todos conocemos", "The classic we all know"),
    tr("El código corre en tu laptop... y se rompe en la del alumno, en el servidor o en la revisión. Distintas versiones, dependencias y sistemas operativos.", "The code runs on your laptop... and breaks on the student's, on the server, or in review. Different versions, dependencies and operating systems."), C.rose);
  bullets(s, [tr("DevOps existe para que \"funcione en todas partes\", no solo en una máquina.", "DevOps exists so it \"works everywhere\", not just on one machine.")], { y: 4.0, h: 0.6, fontSize: 15 });

  s = content(p, 3, tr("// concepto", "// concept"), tr("¿Qué es DevOps?", "What is DevOps?"));
  bullets(s, [
    { text: tr("Cultura: desarrollo y operación trabajan juntos, no en silos.", "Culture: development and operations work together, not in silos."), bold: true },
    tr("Automatización: build, pruebas, despliegue y monitoreo sin pasos manuales.", "Automation: build, tests, deploy and monitoring with no manual steps."),
    tr("Integración: desarrollo + pruebas + seguridad + operación en un solo flujo.", "Integration: dev + test + security + operations in a single flow."),
    tr("No es una herramienta: es una forma de pensar el ciclo completo del software.", "It's not a tool: it's a way of thinking about the full software lifecycle."),
  ]);

  s = content(p, 4, tr("// el flujo moderno", "// the modern flow"), tr("El ciclo: de la idea a producción", "The cycle: from idea to production"));
  steps(s, [tr("código", "code"), "build", "test", tr("empacar", "package"), "deploy", tr("monitor", "monitor"), tr("proteger", "secure")], 2.1);
  bullets(s, [
    tr("Cada etapa se automatiza y se repite igual siempre.", "Each stage is automated and always repeats identically."),
    tr("Si algo falla temprano, no llega a producción.", "If something fails early, it never reaches production."),
  ], { y: 3.3, h: 1.5, fontSize: 16 });

  s = content(p, 5, tr("// no confundir", "// don't confuse them"), tr("DevOps vs CI/CD vs SRE", "DevOps vs CI/CD vs SRE"));
  card(s, lib.M, 1.85, 2.78, 3.1, C.cyan, "DevOps", [tr("La cultura y las prácticas", "The culture and practices"), tr("Une dev + ops", "Unites dev + ops"), tr("El \"qué\" y el \"porqué\"", "The \"what\" and \"why\"")]);
  card(s, 3.5, 1.85, 2.78, 3.1, C.green, "CI/CD", [tr("La automatización", "The automation"), tr("Build, test, deploy", "Build, test, deploy"), tr("El \"cómo\" técnico", "The technical \"how\"")]);
  card(s, 6.2, 1.85, 2.78, 3.1, C.amber, "SRE", [tr("Operar con ingeniería", "Operate with engineering"), tr("SLOs, fiabilidad", "SLOs, reliability"), tr("El \"qué tan bien\"", "The \"how well\"")]);

  s = content(p, 6, tr("// día 1 · git", "// day 1 · git"), tr("Git: la base de todo el flujo", "Git: the base of the whole flow"));
  bullets(s, [
    tr("Todo empieza versionado: repositorio, commits, ramas.", "Everything starts versioned: repository, commits, branches."),
    tr("Rama → commit → push → pull request → merge.", "Branch → commit → push → pull request → merge."),
    tr("Un repo profesional: README, .gitignore, releases.", "A professional repo: README, .gitignore, releases."),
  ], { h: 1.7 });
  codePanel(s, [
    { text: tr("$ git clone <repo-del-curso>", "$ git clone <course-repo>"), color: C.cyan },
    "$ git checkout -b feature/dockerfile",
    tr("$ git add . && git commit -m \"feat: agrega Dockerfile\"", "$ git add . && git commit -m \"feat: add Dockerfile\""),
    "$ git push origin feature/dockerfile",
  ], { y: 3.45, h: 1.6 });

  s = content(p, 7, tr("// día 1 · docker", "// day 1 · docker"), tr("Docker: ¿qué problema resuelve?", "Docker: what problem does it solve?"));
  bullets(s, [
    { text: tr("Empaqueta la app CON todo lo que necesita para correr.", "It packages the app WITH everything it needs to run."), bold: true },
    tr("La misma imagen corre igual en tu laptop, en CI y en el servidor.", "The same image runs identically on your laptop, in CI and on the server."),
    tr("Adiós a \"instala estas 12 cosas antes de ejecutar\".", "Goodbye to \"install these 12 things before running\"."),
    tr("Ligero y rápido: comparte el kernel del sistema (no es una VM completa).", "Light and fast: it shares the system kernel (not a full VM)."),
  ]);

  s = content(p, 8, tr("// concepto clave", "// key concept"), tr("Imagen vs Contenedor", "Image vs Container"));
  card(s, lib.M, 1.85, 4.25, 3.0, C.cyan, tr("IMAGEN", "IMAGE"), [tr("Plantilla inmutable (la receta)", "Immutable template (the recipe)"), tr("Se construye: docker build", "Built with: docker build"), tr("Una imagen → muchos contenedores", "One image → many containers")]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.green, tr("CONTENEDOR", "CONTAINER"), [tr("Instancia en ejecución (el platillo)", "Running instance (the dish)"), tr("Se crea: docker run", "Created with: docker run"), tr("Tiene su propio estado y vida", "Has its own state and lifecycle")]);

  s = content(p, 9, tr("// comparación", "// comparison"), tr("Contenedor vs Máquina Virtual", "Container vs Virtual Machine"));
  card(s, lib.M, 1.85, 4.25, 3.0, C.green, tr("CONTENEDOR", "CONTAINER"), [tr("Comparte el kernel del host", "Shares the host kernel"), tr("Arranca en segundos", "Starts in seconds"), tr("MB de tamaño", "MB in size"), tr("Ideal para microservicios", "Ideal for microservices")]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.muted, tr("MÁQUINA VIRTUAL", "VIRTUAL MACHINE"), [tr("SO completo por máquina", "Full OS per machine"), tr("Arranca en minutos", "Starts in minutes"), tr("GB de tamaño", "GB in size"), tr("Aislamiento más fuerte", "Stronger isolation")]);

  s = content(p, 10, tr("// día 1 · dockerfile", "// day 1 · dockerfile"), tr("Anatomía de un Dockerfile", "Anatomy of a Dockerfile"));
  codePanel(s, [
    { text: tr("FROM node:22-alpine           # imagen base ligera", "FROM node:22-alpine           # lightweight base image"), color: C.cyan },
    tr("WORKDIR /app                  # carpeta de trabajo", "WORKDIR /app                  # working directory"),
    tr("COPY package*.json ./         # primero deps (cache de capas)", "COPY package*.json ./         # deps first (layer cache)"),
    tr("RUN npm ci --omit=dev         # instala dependencias", "RUN npm ci --omit=dev         # install dependencies"),
    tr("COPY src ./src                # luego el código", "COPY src ./src                # then the code"),
    tr("EXPOSE 8080                   # documenta el puerto", "EXPOSE 8080                   # documents the port"),
    tr("USER node                     # NO correr como root", "USER node                     # do NOT run as root"),
    { text: tr("CMD [\"node\", \"src/server.js\"]  # comando de arranque", "CMD [\"node\", \"src/server.js\"]  # startup command"), color: C.amber },
  ], { y: 1.85, h: 3.1, fontSize: 13 });

  s = content(p, 11, tr("// buenas prácticas", "// best practices"), tr("Dockerfile: inseguro vs seguro", "Dockerfile: insecure vs secure"));
  card(s, lib.M, 1.85, 4.25, 3.0, C.rose, tr("INSEGURO", "INSECURE"), ["FROM node:22 (≈1 GB)", tr("COPY . . (todo, hasta secretos)", "COPY . . (everything, even secrets)"), tr("npm install (con devDeps)", "npm install (with devDeps)"), "ENV DB_PASSWORD=... ", tr("corre como root", "runs as root")]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.green, tr("SEGURO", "SECURE"), ["node:22-alpine", tr(".dockerignore + copia selectiva", ".dockerignore + selective copy"), "npm ci --omit=dev", tr("secreto por variable/Secret", "secret via env var/Secret"), "USER node + HEALTHCHECK"]);

  s = content(p, 12, tr("// misión 1", "// mission 1"), tr("Lab 1 — Capitán de Contenedores (+100 XP)", "Lab 1 — Container Captain (+100 XP)"));
  bullets(s, [tr("Construye la imagen de la app y córrela; /health responde.", "Build the app image and run it; /health responds.")], { y: 1.8, h: 0.6, fontSize: 16 });
  codePanel(s, [
    { text: "$ docker build -t academia-devops-app:1.0.0 .", color: C.cyan },
    "$ docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0",
    "$ docker ps",
    "$ curl http://localhost:8080/health",
    { text: tr("  {\"status\":\"UP\", ...}   <- evidencia de la misión", "  {\"status\":\"UP\", ...}   <- mission evidence"), color: C.amber },
  ], { y: 2.5, h: 2.0 });

  s = content(p, 13, tr("// para clase", "// for class"), tr("Preguntas detonadoras", "Trigger questions"));
  bullets(s, [
    { text: tr("¿Qué problema resuelve un contenedor?", "What problem does a container solve?"), bold: true },
    { text: tr("¿Qué SÍ debería ir dentro de una imagen?", "What SHOULD go inside an image?"), bold: true },
    { text: tr("¿Qué NUNCA debería ir dentro de una imagen?", "What should NEVER go inside an image?"), bold: true },
    { text: tr("¿Cómo garantizas que todos tus alumnos tengan el mismo ambiente?", "How do you ensure all your students have the same environment?"), bold: true },
  ], { fontSize: 17 });

  closing(p, tr("// fin del día", "// end of day"), tr("Hoy: de código a contenedor.", "Today: from code to container."), tr("Mañana: lo levantamos con su base de datos y lo automatizamos con CI/CD.", "Tomorrow: we run it with its database and automate it with CI/CD."));
  return p;
}

// ====================================================================
// DECK 2 — Día 2: Compose, CI/CD y DevSecOps
// ====================================================================
function deck2() {
  const p = newDeck(tr("Día 2 — Compose, CI/CD, DevSecOps", "Day 2 — Compose, CI/CD, DevSecOps"));
  titleSlide(p, tr("CURSO-TALLER · DÍA 2", "WORKSHOP · DAY 2"),
    tr("Compose, CI/CD\ny DevSecOps", "Compose, CI/CD\nand DevSecOps"),
    tr("Multicontenedor + automatización + seguridad básica", "Multi-container + automation + basic security"), FOOTER);

  let s = content(p, 1, tr("// repaso", "// recap"), tr("Lo que ya logramos", "What we've achieved so far"));
  bullets(s, [
    { text: tr("Ayer: app contenerizada y corriendo.", "Yesterday: app containerized and running."), bold: true, color: C.green },
    tr("Hoy: app + base de datos juntas (Docker Compose).", "Today: app + database together (Docker Compose)."),
    tr("Hoy: automatizamos build y pruebas (CI/CD).", "Today: we automate build and tests (CI/CD)."),
    tr("Hoy: primer escaneo de seguridad (DevSecOps).", "Today: first security scan (DevSecOps)."),
  ]);

  s = content(p, 2, tr("// día 2 · compose", "// day 2 · compose"), tr("¿Por qué Docker Compose?", "Why Docker Compose?"));
  bullets(s, [
    { text: tr("Las apps reales son varios contenedores: app + base de datos + caché...", "Real apps are several containers: app + database + cache..."), bold: true },
    tr("Compose los define y levanta TODOS con un solo archivo YAML.", "Compose defines and starts them ALL with a single YAML file."),
    tr("Un comando arriba, un comando abajo. Reproducible.", "One command up, one command down. Reproducible."),
  ], { h: 1.5 });
  codePanel(s, [
    { text: tr("$ docker compose up -d      # levanta app + db", "$ docker compose up -d      # starts app + db"), color: C.cyan },
    tr("$ docker compose ps         # estado de los servicios", "$ docker compose ps         # status of the services"),
    tr("$ docker compose down -v    # apaga y borra volúmenes", "$ docker compose down -v    # stops and deletes volumes"),
  ], { y: 3.3, h: 1.5 });

  s = content(p, 3, tr("// arquitectura", "// architecture"), tr("App + Base de datos", "App + Database"));
  s.addShape("roundRect", { x: 1.2, y: 2.3, w: 2.6, h: 1.3, rectRadius: 0.1, fill: { color: C.panel }, line: { color: C.cyan, width: 1.5 } });
  s.addText("app\n(:8080)", { x: 1.2, y: 2.3, w: 2.6, h: 1.3, align: "center", valign: "middle", fontFace: lib.F.mono, fontSize: 16, bold: true, color: C.cyan, margin: 0 });
  s.addShape("line", { x: 3.8, y: 2.95, w: 1.4, h: 0, line: { color: C.green, width: 2.5, endArrowType: "triangle" } });
  s.addText(tr("red interna\n\"db\"", "internal net\n\"db\""), { x: 3.8, y: 2.35, w: 1.4, h: 0.5, align: "center", fontFace: lib.F.mono, fontSize: 10, color: C.muted, margin: 0 });
  s.addShape("roundRect", { x: 5.2, y: 2.3, w: 2.6, h: 1.3, rectRadius: 0.1, fill: { color: C.panel }, line: { color: C.green, width: 1.5 } });
  s.addText("postgres\n(:5432)", { x: 5.2, y: 2.3, w: 2.6, h: 1.3, align: "center", valign: "middle", fontFace: lib.F.mono, fontSize: 16, bold: true, color: C.green, margin: 0 });
  s.addShape("roundRect", { x: 5.6, y: 3.8, w: 1.8, h: 0.55, rectRadius: 0.08, fill: { color: C.code }, line: { color: C.line, width: 1 } });
  s.addText(tr("volumen db_data", "db_data volume"), { x: 5.6, y: 3.8, w: 1.8, h: 0.55, align: "center", valign: "middle", fontFace: lib.F.mono, fontSize: 10, color: C.amber, margin: 0 });
  bullets(s, [tr("La app encuentra a la DB por su NOMBRE de servicio (db), no por IP.", "The app finds the DB by its service NAME (db), not by IP.")], { x: 1.2, y: 4.55, w: 7, h: 0.5, fontSize: 14 });

  s = content(p, 4, tr("// concepto", "// concept"), tr("Persistencia: el volumen", "Persistence: the volume"));
  bullets(s, [
    { text: tr("Sin volumen, los datos mueren cuando el contenedor se borra.", "Without a volume, data dies when the container is removed."), color: C.rose },
    { text: tr("Con volumen, los datos SOBREVIVEN a reinicios y recreaciones.", "With a volume, data SURVIVES restarts and recreations."), color: C.green },
    tr("Demo: crea un curso, reinicia la app... el curso sigue ahí.", "Demo: create a course, restart the app... the course is still there."),
    tr("docker compose down conserva el volumen; down -v lo borra.", "docker compose down keeps the volume; down -v deletes it."),
  ]);

  s = content(p, 5, tr("// día 2 · ci/cd", "// day 2 · ci/cd"), tr("CI/CD: una línea de producción", "CI/CD: a production line"));
  steps(s, ["checkout", "install", "test", tr("build\nimagen", "build\nimage"), "scan", "deploy"], 2.1);
  bullets(s, [
    { text: tr("CI (Integración Continua): build + test en CADA cambio.", "CI (Continuous Integration): build + test on EVERY change."), bold: true },
    { text: tr("CD (Entrega Continua): llevar lo probado a un ambiente.", "CD (Continuous Delivery): ship what's tested to an environment."), bold: true },
    tr("Si un paso falla, el commit se marca rojo y no avanza.", "If a step fails, the commit goes red and stops."),
  ], { y: 3.3, h: 1.7, fontSize: 15 });

  s = content(p, 6, tr("// anatomía", "// anatomy"), tr("Un pipeline de GitHub Actions", "A GitHub Actions pipeline"));
  codePanel(s, [
    { text: tr("on: [push, pull_request]      # cuándo se dispara", "on: [push, pull_request]      # when it triggers"), color: C.cyan },
    "jobs:",
    "  build-test-scan:",
    tr("    runs-on: ubuntu-latest      # el runner (VM efímera)", "    runs-on: ubuntu-latest      # the runner (ephemeral VM)"),
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - run: npm ci",
    { text: tr("      - run: npm test            # rojo si un test falla", "      - run: npm test            # red if a test fails"), color: C.amber },
    "      - run: docker build -t app:${{ github.sha }} .",
  ], { y: 1.85, h: 3.1, fontSize: 12.5 });

  s = content(p, 7, tr("// herramientas", "// tools"), tr("GitHub Actions vs Jenkins", "GitHub Actions vs Jenkins"));
  card(s, lib.M, 1.85, 4.25, 3.0, C.cyan, "GitHub Actions", [tr("Integrado al repo", "Built into the repo"), tr("YAML sencillo, runners gratis", "Simple YAML, free runners"), tr("Ruta PRINCIPAL del curso", "MAIN path of the course"), tr("Cero servidores que mantener", "Zero servers to maintain")]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.amber, "Jenkins", [tr("Estándar empresarial", "Enterprise standard"), tr("Jenkinsfile (Groovy)", "Jenkinsfile (Groovy)"), tr("Ruta ALTERNATIVA", "ALTERNATIVE path"), tr("Requiere servidor y plugins", "Needs a server and plugins")]);

  s = content(p, 8, tr("// día 2 · devsecops", "// day 2 · devsecops"), tr("Seguridad: shift-left", "Security: shift-left"));
  callout(s, tr("Mover la seguridad a la izquierda", "Move security to the left"),
    tr("Revisar la seguridad TEMPRANO (código, imagen, pipeline) cuesta menos y rompe menos que descubrirla en producción.", "Checking security EARLY (code, image, pipeline) costs less and breaks less than discovering it in production."), C.green);
  bullets(s, [tr("Encontrar una vulnerabilidad no es lo mismo que corregirla. La herramienta acelera; el criterio humano decide.", "Finding a vulnerability is not the same as fixing it. The tool speeds you up; human judgment decides.")], { y: 4.0, h: 0.7, fontSize: 14 });

  s = content(p, 9, tr("// misión 4", "// mission 4"), tr("Trivy: escanear la imagen (+90 XP)", "Trivy: scan the image (+90 XP)"));
  codePanel(s, [
    { text: "$ trivy image academia-devops-app:1.0.0", color: C.cyan },
    "",
    "  Library   Vulnerability   Severity   Fixed in",
    { text: "  openssl   CVE-2024-xxxx   HIGH       3.1.5", color: C.rose },
    "",
    { text: tr("  Prioriza: CRITICAL/HIGH con \"Fixed in\" -> actualiza.", "  Prioritize: CRITICAL/HIGH with \"Fixed in\" -> update."), color: C.amber },
  ], { y: 1.85, h: 2.6 });
  bullets(s, [tr("Bonus: detecta el secreto quemado con --scanners secret.", "Bonus: detect the hardcoded secret with --scanners secret.")], { y: 4.6, h: 0.5, fontSize: 14 });

  s = content(p, 10, tr("// misiones de hoy", "// today's missions"), tr("Lo que te llevas del día 2", "What you take from day 2"));
  table(s, [
    [tr("Misión", "Mission"), tr("Logras", "You achieve"), "XP"],
    [tr("Lab 2 · Compose", "Lab 2 · Compose"), tr("App + DB con persistencia", "App + DB with persistence"), "120"],
    [tr("Lab 3 · CI/CD", "Lab 3 · CI/CD"), tr("Pipeline en verde", "Green pipeline"), "130"],
    [tr("Lab 4 · DevSecOps", "Lab 4 · DevSecOps"), tr("Escaneo e interpretación", "Scan and interpretation"), "90"],
  ], { colW: [3.2, 4.0, 1.6], rowH: 0.55 });

  s = content(p, 11, tr("// para clase", "// for class"), tr("Preguntas detonadoras", "Trigger questions"));
  bullets(s, [
    { text: tr("¿Por qué la app llama a la DB por nombre y no por IP?", "Why does the app call the DB by name and not by IP?"), bold: true },
    { text: tr("¿Qué validaciones debe pasar el código antes de aceptarse?", "What checks must the code pass before being accepted?"), bold: true },
    { text: tr("¿Qué diferencia hay entre compilar local y compilar en el pipeline?", "What's the difference between building locally and building in the pipeline?"), bold: true },
    { text: tr("¿Qué riesgo tiene guardar secretos en un repositorio?", "What's the risk of storing secrets in a repository?"), bold: true },
  ], { fontSize: 16 });

  closing(p, tr("// fin del día", "// end of day"), tr("Hoy: multicontenedor y automatización.", "Today: multi-container and automation."), tr("Mañana: Kubernetes — desplegar, exponer, escalar y actualizar.", "Tomorrow: Kubernetes — deploy, expose, scale and update."));
  return p;
}

// ====================================================================
// DECK 3 — Día 3: Kubernetes y Helm
// ====================================================================
function deck3() {
  const p = newDeck(tr("Día 3 — Kubernetes y Helm", "Day 3 — Kubernetes and Helm"));
  titleSlide(p, tr("CURSO-TALLER · DÍA 3", "WORKSHOP · DAY 3"),
    tr("Kubernetes\ny Helm", "Kubernetes\nand Helm"),
    tr("Desplegar, exponer, escalar, actualizar y empaquetar", "Deploy, expose, scale, update and package"), FOOTER);

  let s = content(p, 1, tr("// día 3 · k8s", "// day 3 · k8s"), tr("¿Por qué Kubernetes?", "Why Kubernetes?"));
  bullets(s, [
    { text: tr("Docker corre contenedores en UNA máquina. ¿Y si necesitas muchos, en muchas?", "Docker runs containers on ONE machine. What if you need many, on many?"), bold: true },
    tr("Kubernetes orquesta: los despliega, los reinicia si mueren, los escala.", "Kubernetes orchestrates: deploys them, restarts them if they die, scales them."),
    tr("Estado deseado: tú dices \"quiero 4 réplicas\" y K8s lo mantiene.", "Desired state: you say \"I want 4 replicas\" and K8s keeps it."),
    tr("Es el estándar de la industria para correr contenedores en producción.", "It's the industry standard for running containers in production."),
  ]);

  s = content(p, 2, tr("// arquitectura", "// architecture"), tr("Anatomía de un clúster", "Anatomy of a cluster"));
  card(s, lib.M, 1.85, 4.25, 3.0, C.cyan, "CONTROL PLANE", [tr("El \"cerebro\"", "The \"brain\""), tr("Decide y programa", "Decides and schedules"), tr("Mantiene el estado deseado", "Keeps the desired state"), "API Server, scheduler"]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.green, "WORKER NODES", [tr("Las máquinas que trabajan", "The machines that work"), tr("Aquí viven los Pods", "Pods live here"), tr("Ejecutan los contenedores", "They run the containers"), tr("Reportan su estado", "They report their status")]);

  s = content(p, 3, tr("// vocabulario", "// vocabulary"), tr("Los objetos que usaremos", "The objects we'll use"));
  table(s, [
    [tr("Objeto", "Object"), tr("Qué es", "What it is")],
    ["Pod", tr("Unidad mínima; envuelve el/los contenedor(es)", "Smallest unit; wraps the container(s)")],
    ["Deployment", tr("Gestiona réplicas y actualizaciones", "Manages replicas and updates")],
    ["Service", tr("Punto de acceso estable a los Pods", "Stable access point to the Pods")],
    ["Namespace", tr("División lógica del clúster", "Logical division of the cluster")],
    ["ConfigMap / Secret", tr("Configuración y datos sensibles", "Configuration and sensitive data")],
  ], { colW: [2.6, 6.2], rowH: 0.46 });

  s = content(p, 4, tr("// jerarquía", "// hierarchy"), "Deployment → ReplicaSet → Pods");
  steps(s, ["Deployment", "ReplicaSet", "Pod  Pod  Pod"], 2.4, C.cyan);
  bullets(s, [
    tr("El Deployment define QUÉ quieres (imagen, réplicas).", "The Deployment defines WHAT you want (image, replicas)."),
    tr("El ReplicaSet garantiza CUÁNTAS copias.", "The ReplicaSet guarantees HOW MANY copies."),
    tr("Los Pods son las copias en ejecución. Si uno muere, se recrea.", "Pods are the running copies. If one dies, it's recreated."),
  ], { y: 3.6, h: 1.5, fontSize: 15 });

  s = content(p, 5, tr("// manifiesto", "// manifest"), tr("Un Deployment en YAML", "A Deployment in YAML"));
  codePanel(s, [
    { text: "apiVersion: apps/v1", color: C.cyan },
    "kind: Deployment",
    "metadata: { name: academia-app }",
    "spec:",
    tr("  replicas: 2                  # cuántas copias", "  replicas: 2                  # how many copies"),
    "  selector: { matchLabels: { app: academia-app } }",
    "  template:",
    "    spec:",
    "      containers:",
    { text: "        - image: academia-devops-app:1.0.0", color: C.amber },
  ], { y: 1.85, h: 3.1, fontSize: 12.5 });

  s = content(p, 6, tr("// exponer", "// expose"), tr("Service: acceso estable", "Service: stable access"));
  bullets(s, [
    { text: tr("Los Pods son efímeros (cambian de IP). El Service da una dirección fija.", "Pods are ephemeral (their IP changes). The Service gives a fixed address."), bold: true },
  ], { y: 1.8, h: 0.7, fontSize: 15 });
  card(s, lib.M, 2.5, 2.78, 2.4, C.cyan, "ClusterIP", [tr("Interno al clúster", "Internal to the cluster"), "Default", tr("Acceso por port-forward", "Access via port-forward")], { fontSize: 12 });
  card(s, 3.5, 2.5, 2.78, 2.4, C.green, "NodePort", [tr("Abre un puerto", "Opens a port"), tr("en cada nodo", "on each node"), tr("Acceso externo básico", "Basic external access")], { fontSize: 12 });
  card(s, 6.2, 2.5, 2.78, 2.4, C.amber, "LoadBalancer", [tr("IP externa", "External IP"), tr("en la nube", "in the cloud"), tr("Producción real", "Real production")], { fontSize: 12 });

  s = content(p, 7, tr("// día 3 · config", "// day 3 · config"), tr("ConfigMap vs Secret", "ConfigMap vs Secret"));
  card(s, lib.M, 1.85, 4.25, 3.0, C.cyan, "ConfigMap", [tr("Config NO sensible", "NON-sensitive config"), "APP_ENV, APP_VERSION", tr("Texto plano, va en git", "Plain text, goes in git"), tr("Inyectado como variables", "Injected as variables")]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.rose, "Secret", [tr("Datos sensibles", "Sensitive data"), tr("Usuarios, contraseñas", "Users, passwords"), tr("base64 NO es cifrado", "base64 is NOT encryption"), tr("Fuera de git (Vault, etc.)", "Out of git (Vault, etc.)")]);

  s = content(p, 8, tr("// misión 7", "// mission 7"), tr("Escalar, actualizar y rollback", "Scale, update and rollback"));
  codePanel(s, [
    { text: tr("# Escalar a 4 réplicas", "# Scale to 4 replicas"), color: C.muted },
    "$ kubectl scale deployment academia-app --replicas=4",
    { text: tr("# Actualizar imagen (rolling update, sin downtime)", "# Update image (rolling update, no downtime)"), color: C.muted },
    "$ kubectl set image deploy/academia-app academia-app=...:1.0.1",
    { text: tr("# Volver atrás si algo salió mal", "# Roll back if something went wrong"), color: C.muted },
    { text: "$ kubectl rollout undo deployment/academia-app", color: C.amber },
  ], { y: 1.85, h: 2.7 });
  bullets(s, [tr("Kubernetes reemplaza los Pods de a poco: la app nunca se cae.", "Kubernetes replaces Pods gradually: the app never goes down.")], { y: 4.65, h: 0.5, fontSize: 14 });

  s = content(p, 9, tr("// pregunta clave", "// key question"), tr("1 réplica ≠ alta disponibilidad", "1 replica ≠ high availability"));
  callout(s, tr("Una sola copia es un único punto de falla", "A single copy is a single point of failure"),
    tr("Si ese Pod muere, hay segundos sin servicio mientras se recrea. Con varias réplicas, el resto sigue atendiendo. Eso es alta disponibilidad.", "If that Pod dies, there are seconds with no service while it's recreated. With several replicas, the rest keep serving. That's high availability."), C.amber);

  s = content(p, 10, tr("// día 3 · helm", "// day 3 · helm"), tr("YAML manual vs Helm", "Manual YAML vs Helm"));
  card(s, lib.M, 1.85, 4.25, 3.0, C.muted, tr("YAML manual", "Manual YAML"), [tr("3 ambientes = copiar/pegar", "3 environments = copy/paste"), tr("kubectl apply uno por uno", "kubectl apply one by one"), tr("Volver atrás: manual", "Rolling back: manual"), tr("Difícil de reutilizar", "Hard to reuse")]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.green, "Helm", [tr("Un chart, muchos values", "One chart, many values"), tr("helm install (todo junto)", "helm install (all together)"), tr("helm rollback (1 comando)", "helm rollback (1 command)"), tr("Plantillas reutilizables", "Reusable templates")]);

  s = content(p, 11, tr("// misión 8", "// mission 8"), tr("Helm en acción (+100 XP)", "Helm in action (+100 XP)"));
  codePanel(s, [
    { text: "$ helm install academia ./academia-app-chart -n academia", color: C.cyan },
    "$ helm upgrade academia ./academia-app-chart --set replicaCount=4",
    "$ helm history academia -n academia",
    { text: "$ helm rollback academia 1 -n academia", color: C.amber },
  ], { y: 1.85, h: 2.0 });
  bullets(s, [tr("Cambiar réplicas SIN editar ningún YAML: solo --set.", "Change replicas WITHOUT editing any YAML: just --set.")], { y: 4.0, h: 0.5, fontSize: 14 });

  s = content(p, 12, tr("// para clase", "// for class"), tr("Preguntas detonadoras", "Trigger questions"));
  bullets(s, [
    { text: tr("¿Qué pasa si una aplicación se cae?", "What happens if an application goes down?"), bold: true },
    { text: tr("¿Por qué una réplica NO es alta disponibilidad?", "Why is one replica NOT high availability?"), bold: true },
    { text: tr("¿Qué va en ConfigMap y qué va en Secret?", "What goes in a ConfigMap and what goes in a Secret?"), bold: true },
    { text: tr("¿Cuándo conviene Helm sobre YAML manual?", "When is Helm worth it over manual YAML?"), bold: true },
  ], { fontSize: 16 });

  closing(p, tr("// fin del día", "// end of day"), tr("Hoy: la app vive en Kubernetes.", "Today: the app lives in Kubernetes."), tr("Mañana: la observamos, la aseguramos y cerramos con el proyecto integrador.", "Tomorrow: we observe it, secure it and close with the capstone project."));
  return p;
}

// ====================================================================
// DECK 4 — Día 4: Observabilidad, DevSecOps y Proyecto
// ====================================================================
function deck4() {
  const p = newDeck(tr("Día 4 — Observabilidad, DevSecOps, Proyecto", "Day 4 — Observability, DevSecOps, Project"));
  titleSlide(p, tr("CURSO-TALLER · DÍA 4", "WORKSHOP · DAY 4"),
    tr("Observabilidad,\nDevSecOps y cierre", "Observability,\nDevSecOps and wrap-up"),
    tr("Monitorear, asegurar y convertirlo en práctica docente", "Monitor, secure and turn it into a teaching lab"), FOOTER);

  let s = content(p, 1, tr("// día 4 · observabilidad", "// day 4 · observability"), tr("Los 3 pilares", "The 3 pillars"));
  card(s, lib.M, 1.85, 2.78, 3.0, C.cyan, "LOGS", [tr("¿Qué pasó?", "What happened?"), tr("Eventos con contexto", "Events with context"), "kubectl logs"]);
  card(s, 3.5, 1.85, 2.78, 3.0, C.green, tr("MÉTRICAS", "METRICS"), [tr("¿Cómo se comporta?", "How does it behave?"), tr("Números en el tiempo", "Numbers over time"), "/metrics + Prometheus"]);
  card(s, 6.2, 1.85, 2.78, 3.0, C.amber, tr("TRAZAS", "TRACES"), [tr("¿Por dónde pasó?", "Where did it go?"), tr("Recorrido de una petición", "A request's journey"), tr("Concepto avanzado", "Advanced concept")]);

  s = content(p, 2, tr("// qué vigilar", "// what to watch"), tr("¿Qué monitorear y por qué?", "What to monitor and why?"));
  table(s, [
    [tr("Señal", "Signal"), tr("Por qué importa", "Why it matters")],
    [tr("CPU / memoria", "CPU / memory"), tr("Saturación -> lentitud o reinicios", "Saturation -> slowness or restarts")],
    [tr("Estado de Pods", "Pod status"), tr("¿Reinicios? ¿CrashLoop?", "Restarts? CrashLoop?")],
    [tr("Latencia", "Latency"), tr("Experiencia del usuario", "User experience")],
    [tr("Errores (5xx)", "Errors (5xx)"), tr("¿Algo se rompió?", "Did something break?")],
    [tr("Disponibilidad", "Availability"), tr("¿Está arriba?", "Is it up?")],
  ], { colW: [2.8, 6.0], rowH: 0.46 });

  s = content(p, 3, tr("// salud", "// health"), tr("Liveness vs Readiness", "Liveness vs Readiness"));
  card(s, lib.M, 1.85, 4.25, 3.0, C.green, "Liveness probe", [tr("¿Sigue VIVA?", "Is it still ALIVE?"), tr("Si falla -> la reinicia", "If it fails -> restart it"), tr("Detecta cuelgues", "Detects hangs")]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.cyan, "Readiness probe", [tr("¿LISTA para tráfico?", "READY for traffic?"), tr("Si falla -> no le manda peticiones", "If it fails -> no requests sent"), tr("Espera a que arranque", "Waits for startup")]);

  s = content(p, 4, tr("// misión 9", "// mission 9"), "Prometheus + Grafana");
  steps(s, [tr("app /metrics", "app /metrics"), tr("Prometheus\n(scraping)", "Prometheus\n(scraping)"), tr("Grafana\n(dashboards)", "Grafana\n(dashboards)")], 2.2, C.green);
  bullets(s, [
    tr("Prometheus \"raspa\" las métricas que la app expone en /metrics.", "Prometheus \"scrapes\" the metrics the app exposes at /metrics."),
    tr("Grafana las dibuja en dashboards: CPU, memoria, estado de Pods.", "Grafana draws them in dashboards: CPU, memory, Pod status."),
    { text: tr("Plan B (equipos modestos): /metrics + kubectl top + capturas.", "Plan B (modest machines): /metrics + kubectl top + screenshots."), color: C.amber },
  ], { y: 3.4, h: 1.6, fontSize: 15 });

  s = content(p, 5, tr("// logs", "// logs"), tr("Buenos vs inútiles vs peligrosos", "Good vs useless vs dangerous"));
  card(s, lib.M, 1.85, 2.78, 3.0, C.green, tr("ÚTIL", "USEFUL"), [tr("Timestamp + nivel", "Timestamp + level"), tr("Contexto (host, id)", "Context (host, id)"), tr("Se puede diagnosticar", "You can diagnose")], { fontSize: 12 });
  card(s, 3.5, 1.85, 2.78, 3.0, C.muted, tr("INÚTIL", "USELESS"), [tr("Solo dice \"error\"", "Just says \"error\""), tr("Sin qué/dónde/cuándo", "No what/where/when"), tr("No ayuda en nada", "Helps with nothing")], { fontSize: 12 });
  card(s, 6.2, 1.85, 2.78, 3.0, C.rose, tr("PELIGROSO", "DANGEROUS"), [tr("Loguea passwords", "Logs passwords"), tr("Datos personales", "Personal data"), tr("= secreto filtrado", "= leaked secret")], { fontSize: 12 });

  s = content(p, 6, tr("// dinámica", "// activity"), tr("Simulación de incidentes", "Incident simulation"));
  card(s, lib.M, 1.85, 4.25, 1.45, C.cyan, tr("Un Pod se reinicia solo", "A Pod restarts by itself"), [tr("describe + logs --previous -> probe u OOMKilled", "describe + logs --previous -> probe or OOMKilled")], { fontSize: 12 });
  card(s, 5.1, 1.85, 4.3, 1.45, C.green, tr("La app responde lento", "The app responds slowly"), [tr("CPU al tope -> escalar / ajustar límites", "CPU maxed -> scale / adjust limits")], { fontSize: 12 });
  card(s, lib.M, 3.45, 4.25, 1.45, C.amber, tr("La DB no responde", "The DB doesn't respond"), [tr("/health: db down -> readiness / credenciales", "/health: db down -> readiness / credentials")], { fontSize: 12 });
  card(s, 5.1, 3.45, 4.3, 1.45, C.rose, tr("CI verde, prod falla", "CI green, prod fails"), [tr("imagen no cargada / falta un Secret", "image not loaded / missing a Secret")], { fontSize: 12 });

  s = content(p, 7, tr("// devsecops", "// devsecops"), tr("Controles por capa", "Controls per layer"));
  table(s, [
    [tr("Capa", "Layer"), tr("Control mínimo", "Minimum control")],
    [tr("Código", "Code"), tr("Sin secretos; dependencias fijadas", "No secrets; pinned dependencies")],
    [tr("Imagen", "Image"), tr("Base ligera, no root, escaneada", "Lightweight base, non-root, scanned")],
    ["Pipeline", tr("Test + scan en cada cambio", "Test + scan on every change")],
    ["Kubernetes", tr("securityContext, límites, probes", "securityContext, limits, probes")],
    [tr("Secretos", "Secrets"), tr("Fuera de git (Secret / Vault)", "Out of git (Secret / Vault)")],
  ], { colW: [2.4, 6.4], rowH: 0.46 });

  s = content(p, 8, tr("// evolución", "// evolution"), tr("GitOps, Terraform y Ansible", "GitOps, Terraform and Ansible"));
  card(s, lib.M, 1.85, 2.78, 3.0, C.cyan, "GitOps", [tr("Estado deseado en git", "Desired state in git"), "Argo CD / Flux", tr("Sincroniza el clúster", "Syncs the cluster")]);
  card(s, 3.5, 1.85, 2.78, 3.0, C.green, "Terraform", [tr("Infraestructura como código", "Infrastructure as code"), tr("PROVISIONA recursos", "PROVISIONS resources"), tr("Crea la infra", "Creates the infra")]);
  card(s, 6.2, 1.85, 2.78, 3.0, C.amber, "Ansible", [tr("Automatización de config", "Config automation"), tr("CONFIGURA servidores", "CONFIGURES servers"), tr("Deja todo listo", "Gets everything ready")]);

  s = content(p, 9, tr("// el camino", "// the path"), tr("Roadmap de madurez DevOps", "DevOps maturity roadmap"));
  bullets(s, [
    { text: tr("1. Manual  ·  2. Scripts  ·  3. Docker", "1. Manual  ·  2. Scripts  ·  3. Docker"), bold: true },
    { text: tr("4. CI/CD  ·  5. Kubernetes  ·  6. Helm", "4. CI/CD  ·  5. Kubernetes  ·  6. Helm"), bold: true },
    { text: tr("7. Observabilidad  ·  8. DevSecOps", "7. Observability  ·  8. DevSecOps"), bold: true },
    { text: tr("9. GitOps  ·  10. Plataforma interna", "9. GitOps  ·  10. Internal platform"), bold: true, color: C.cyan },
  ], { fontSize: 18 });

  s = content(p, 10, tr("// misión final", "// final mission"), tr("El reto integrador (+200 XP)", "The capstone challenge (+200 XP)"));
  bullets(s, [
    { text: tr("Demuestra el flujo COMPLETO en ~5 minutos:", "Demonstrate the FULL flow in ~5 minutes:"), bold: true },
    tr("Repo -> Docker -> Compose -> Pipeline -> Kubernetes -> Escalar -> Seguridad -> Monitoreo.", "Repo -> Docker -> Compose -> Pipeline -> Kubernetes -> Scale -> Security -> Monitoring."),
    { text: tr("Y la pregunta que importa: ¿cómo lo conviertes en práctica para TUS alumnos?", "And the question that matters: how do you turn it into a lab for YOUR students?"), color: C.amber },
  ]);

  s = content(p, 11, tr("// evaluación", "// assessment"), tr("Rúbrica y rangos", "Rubric and ranks"));
  table(s, [
    [tr("Resultado", "Result"), tr("Rango desbloqueado", "Rank unlocked")],
    [tr("21-24 pts", "21-24 pts"), tr("Arquitect@ DevOps", "DevOps Architect")],
    [tr("14-20 pts", "14-20 pts"), tr("Pilot@ de Kubernetes", "Kubernetes Pilot")],
    [tr("8 criterios x 3 = 24", "8 criteria x 3 = 24"), tr("8 medallas + tarjeta de logros", "8 badges + achievement card")],
  ], { colW: [3.2, 5.6], rowH: 0.55 });

  const sc = closing(p, tr("// fin del día", "// end of day"),
    tr("DevOps no es solo herramientas: es enseñar a pensar el ciclo completo.", "DevOps isn't just tools: it's teaching people to think about the whole cycle."),
    tr("Un programa no termina cuando compila: debe probarse, empaquetarse, desplegarse, monitorearse y protegerse.", "A program isn't done when it compiles: it must be tested, packaged, deployed, monitored and protected."));
  sc.addText(tr("¡Gracias! — Daniel E. González Ramírez", "Thank you! — Daniel E. González Ramírez"), { x: lib.M, y: 4.7, w: 8.9, h: 0.4, fontFace: lib.F.mono, fontSize: 13, color: C.cyan, margin: 0 });
  return p;
}

async function main() {
  const builders = [
    [deck1, "01_Dia_1_DevOps_Docker.pptx", "01_Day_1_DevOps_Docker.pptx"],
    [deck2, "02_Dia_2_Compose_CICD_DevSecOps.pptx", "02_Day_2_Compose_CICD_DevSecOps.pptx"],
    [deck3, "03_Dia_3_Kubernetes_Helm.pptx", "03_Day_3_Kubernetes_Helm.pptx"],
    [deck4, "04_Dia_4_Observabilidad_DevSecOps_Proyecto.pptx", "04_Day_4_Observability_DevSecOps_Project.pptx"],
  ];
  for (const [fn, esName, enName] of builders) {
    LANG = "es"; await fn().writeFile({ fileName: esName });
    LANG = "en"; await fn().writeFile({ fileName: enName });
  }
  console.log("OK: 8 decks generados (4 ES + 4 EN).");
}
main();
