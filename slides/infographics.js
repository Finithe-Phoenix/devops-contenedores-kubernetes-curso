// infographics.js — Infografías de referencia para ALUMNOS (ES + EN).
// Cada slide es una infografía independiente, lista para compartir/imprimir.
// Ejecuta:  node infographics.js
const lib = require("./lib");
const { C, F, M, SH, SHsm, bg, card, table, steps, bullets, codePanel, callout, newDeck } = lib;

let LANG = "es";
const tr = (es, en) => (LANG === "es" ? es : en);

function info(p) { const s = p.addSlide(); bg(s); return s; }

function infoTitle(s, title, subtitle, accent = C.cyan) {
  // Cuadros decorativos de acento (esquina superior derecha).
  s.addShape("roundRect", { x: 8.62, y: 0.42, w: 0.34, h: 0.34, rectRadius: 0.06, fill: { color: accent }, shadow: { ...SHsm } });
  s.addShape("roundRect", { x: 9.0, y: 0.42, w: 0.34, h: 0.34, rectRadius: 0.06, fill: { color: C.rose, transparency: 30 } });
  s.addShape("roundRect", { x: 8.62, y: 0.8, w: 0.34, h: 0.34, rectRadius: 0.06, fill: { color: C.green, transparency: 30 } });
  // Marca de título.
  s.addShape("roundRect", { x: M, y: 0.38, w: 0.52, h: 0.52, rectRadius: 0.08, fill: { color: accent }, shadow: { ...SHsm } });
  s.addText(title, { x: 1.27, y: 0.34, w: 7.2, h: 0.55, fontFace: F.head, bold: true, fontSize: 25, color: C.white, margin: 0 });
  s.addText(subtitle, { x: 1.27, y: 0.92, w: 7.2, h: 0.3, fontFace: F.mono, fontSize: 11, color: accent, margin: 0 });
  // Subrayado de acento bajo el título.
  s.addShape("rect", { x: 1.29, y: 0.86, w: 1.0, h: 0.03, fill: { color: accent } });
}

function footer(s) {
  s.addShape("rect", { x: M, y: 5.18, w: 8.8, h: 0.012, fill: { color: C.line } });
  s.addShape("ellipse", { x: M, y: 5.28, w: 0.1, h: 0.1, fill: { color: C.cyan } });
  s.addText(tr("Curso DevOps y Contenedores · Tec de Toluca · Compártelo con tus alumnos",
    "DevOps & Containers Course · Tec de Toluca · Share it with your students"),
    { x: M + 0.18, y: 5.24, w: 8.6, h: 0.3, fontFace: F.mono, fontSize: 9, color: C.muted, margin: 0 });
}

function cheat(s, x, y, w, h, accent, title, lines) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.04, fill: { color: C.panel }, line: { color: accent, width: 1 }, shadow: { ...SH } });
  s.addShape("rect", { x: x + 0.015, y: y + 0.06, w: 0.07, h: h - 0.12, fill: { color: accent } });
  s.addText(title, { x: x + 0.22, y: y + 0.1, w: w - 0.32, h: 0.3, fontFace: F.head, bold: true, fontSize: 12, color: accent, margin: 0, charSpacing: 0.5 });
  s.addShape("rect", { x: x + 0.22, y: y + 0.42, w: w - 0.42, h: 0.016, fill: { color: C.line } });
  const arr = lines.map((l) => ({ text: l, options: { breakLine: true, fontSize: 10.5, color: C.text, paraSpaceAfter: 3 } }));
  s.addText(arr, { x: x + 0.22, y: y + 0.52, w: w - 0.34, h: h - 0.62, fontFace: F.mono, valign: "top", align: "left" });
}

function build(p) {
  let s;

  // 1 — Ciclo DevOps
  s = info(p);
  infoTitle(s, tr("El ciclo de vida DevOps", "The DevOps lifecycle"), tr("// de la idea a producción, una y otra vez", "// from idea to production, over and over"));
  steps(s, [tr("código", "code"), "build", "test", tr("empacar", "package"), "deploy", tr("monitor", "monitor"), tr("proteger", "secure")], 1.55);
  table(s, [
    [tr("Etapa", "Stage"), tr("Qué haces", "What you do"), tr("Herramienta", "Tool")],
    [tr("Código", "Code"), tr("Versionas el código", "Version your code"), "Git"],
    ["Build / Test", tr("Compilas y pruebas", "Build and test"), "npm, Maven"],
    [tr("Empacar", "Package"), tr("Creas una imagen", "Create an image"), "Docker"],
    ["Deploy", tr("Despliegas y escalas", "Deploy and scale"), "Kubernetes, Helm"],
    [tr("Monitor", "Monitor"), tr("Observas la salud", "Watch the health"), "Prometheus, Grafana"],
    [tr("Proteger", "Secure"), tr("Escaneas vulnerabilidades", "Scan vulnerabilities"), "Trivy"],
  ], { y: 2.7, colW: [1.7, 4.0, 3.1], rowH: 0.34, fs: 11 });
  footer(s);

  // 2 — Imagen vs Contenedor vs VM
  s = info(p);
  infoTitle(s, tr("Imagen vs Contenedor vs VM", "Image vs Container vs VM"), tr("// los 3 conceptos que más se confunden", "// the 3 most confused concepts"));
  card(s, M, 1.45, 2.93, 3.4, C.cyan, tr("IMAGEN", "IMAGE"), [tr("Plantilla inmutable", "Immutable template"), tr("La \"receta\"", "The \"recipe\""), tr("docker build", "docker build"), tr("Se versiona con tags", "Versioned with tags"), tr("1 imagen → N contenedores", "1 image → N containers")]);
  card(s, 3.54, 1.45, 2.93, 3.4, C.green, tr("CONTENEDOR", "CONTAINER"), [tr("Instancia en ejecución", "Running instance"), tr("El \"platillo\"", "The \"dish\""), tr("docker run", "docker run"), tr("Comparte el kernel", "Shares the kernel"), tr("Arranca en segundos", "Starts in seconds")]);
  card(s, 6.47, 1.45, 2.93, 3.4, C.muted, tr("MÁQUINA VIRTUAL", "VIRTUAL MACHINE"), [tr("SO completo", "Full OS"), tr("Más pesada (GB)", "Heavier (GB)"), tr("Arranca en minutos", "Starts in minutes"), tr("Aislamiento fuerte", "Strong isolation"), tr("Hipervisor", "Hypervisor")]);
  footer(s);

  // 3 — Docker cheat sheet
  s = info(p);
  infoTitle(s, tr("Docker — comandos esenciales", "Docker — essential commands"), tr("// tu chuleta de bolsillo", "// your pocket cheat sheet"), C.cyan);
  cheat(s, M, 1.45, 4.3, 1.65, C.cyan, tr("Imágenes", "Images"), ["docker build -t app:1.0 .", "docker images", "docker rmi app:1.0", "docker pull node:22-alpine"]);
  cheat(s, 5.1, 1.45, 4.3, 1.65, C.green, tr("Contenedores", "Containers"), ["docker run -d -p 8080:8080 app", "docker ps   /   docker ps -a", "docker stop <id>   docker rm <id>"]);
  cheat(s, M, 3.25, 4.3, 1.75, C.amber, tr("Inspeccionar", "Inspect"), ["docker logs -f <id>", "docker exec -it <id> sh", "docker stats <id>", "docker inspect <id>"]);
  cheat(s, 5.1, 3.25, 4.3, 1.75, C.rose, tr("Limpieza", "Cleanup"), ["docker system df", "docker system prune", "docker volume ls", "docker network ls"]);
  footer(s);

  // 4 — Anatomía del Dockerfile
  s = info(p);
  infoTitle(s, tr("Anatomía de un Dockerfile", "Anatomy of a Dockerfile"), tr("// cada línea, explicada", "// every line, explained"), C.green);
  codePanel(s, [
    { text: tr("FROM node:22-alpine        # imagen base ligera", "FROM node:22-alpine        # lightweight base image"), color: C.cyan },
    tr("WORKDIR /app               # carpeta de trabajo", "WORKDIR /app               # working directory"),
    tr("COPY package*.json ./      # deps primero (cache)", "COPY package*.json ./      # deps first (cache)"),
    tr("RUN npm ci --omit=dev      # instala dependencias", "RUN npm ci --omit=dev      # install dependencies"),
    tr("COPY src ./src             # luego el código", "COPY src ./src             # then the code"),
    tr("EXPOSE 8080                # documenta el puerto", "EXPOSE 8080                # documents the port"),
    tr("USER node                  # no correr como root", "USER node                  # don't run as root"),
    { text: tr("CMD [\"node\",\"src/server.js\"]  # arranque", "CMD [\"node\",\"src/server.js\"]  # startup"), color: C.amber },
  ], { y: 1.5, h: 2.5, fontSize: 13, title: "Dockerfile" });
  bullets(s, [
    { text: tr("Regla de oro: del cambio menos frecuente al más frecuente (aprovecha la cache de capas).", "Golden rule: from least to most frequently changed (leverages layer cache)."), color: C.amber },
  ], { y: 4.2, h: 0.8, fontSize: 12 });
  footer(s);

  // 5 — Docker Compose
  s = info(p);
  infoTitle(s, tr("Docker Compose de un vistazo", "Docker Compose at a glance"), tr("// varios contenedores, un comando", "// many containers, one command"), C.amber);
  codePanel(s, [
    "services:",
    "  app:",
    "    build: .",
    "    ports: [\"8080:8080\"]",
    tr("    environment: { DB_HOST: db }   # encuentra a la db por NOMBRE", "    environment: { DB_HOST: db }   # finds db by NAME"),
    "    depends_on: { db: { condition: service_healthy } }",
    "  db:",
    "    image: postgres:16-alpine",
    tr("    volumes: [ db_data:/var/lib/postgresql/data ]   # persistencia", "    volumes: [ db_data:/var/lib/postgresql/data ]   # persistence"),
  ], { x: M, y: 1.45, w: 5.5, h: 3.5, fontSize: 11.5, title: "docker-compose.yml" });
  cheat(s, 6.35, 1.45, 3.05, 3.5, C.green, tr("Comandos", "Commands"), ["docker compose up -d", "docker compose ps", "docker compose logs -f app", "docker compose down", tr("docker compose down -v", "docker compose down -v"), tr("  (borra el volumen)", "  (deletes the volume)")]);
  footer(s);

  // 6 — Pipeline CI/CD
  s = info(p);
  infoTitle(s, tr("Pipeline CI/CD", "CI/CD pipeline"), tr("// una línea de producción para tu código", "// a production line for your code"), C.cyan);
  steps(s, ["checkout", "install", "test", tr("build imagen", "build image"), "scan", "deploy"], 1.5);
  table(s, [
    [tr("Etapa", "Stage"), tr("Qué pasa", "What happens"), tr("Si falla...", "If it fails...")],
    ["checkout", tr("Trae el código al runner", "Brings code to the runner"), "-"],
    ["install / test", tr("Instala deps y corre pruebas", "Installs deps and runs tests"), tr("pipeline ROJO", "pipeline RED")],
    [tr("build imagen", "build image"), tr("Construye la imagen Docker", "Builds the Docker image"), tr("pipeline ROJO", "pipeline RED")],
    ["scan", tr("Escanea vulnerabilidades", "Scans vulnerabilities"), tr("alerta / bloquea", "warns / blocks")],
    ["deploy", tr("Publica y despliega (CD)", "Publishes and deploys (CD)"), "rollback"],
  ], { y: 2.55, colW: [2.1, 4.3, 2.4], rowH: 0.38, fs: 11 });
  footer(s);

  // 7 — Arquitectura Kubernetes
  s = info(p);
  infoTitle(s, tr("Arquitectura de Kubernetes", "Kubernetes architecture"), tr("// quién es quién en el clúster", "// who's who in the cluster"), C.cyan);
  card(s, M, 1.45, 4.3, 1.7, C.cyan, "CONTROL PLANE", [tr("El cerebro: decide y programa", "The brain: decides and schedules"), tr("Mantiene el estado deseado (API Server, scheduler)", "Keeps desired state (API Server, scheduler)")], { fontSize: 11.5 });
  card(s, 5.1, 1.45, 4.3, 1.7, C.green, "WORKER NODES", [tr("Las máquinas que ejecutan los Pods", "The machines running the Pods"), tr("Reportan su estado al control plane", "Report status to the control plane")], { fontSize: 11.5 });
  table(s, [
    [tr("Objeto", "Object"), tr("Para qué sirve", "What it's for")],
    ["Pod", tr("Envuelve el/los contenedor(es)", "Wraps the container(s)")],
    ["Deployment", tr("Réplicas + actualizaciones (rolling)", "Replicas + updates (rolling)")],
    ["Service", tr("Acceso estable (ClusterIP/NodePort/LB)", "Stable access (ClusterIP/NodePort/LB)")],
    ["ConfigMap / Secret", tr("Configuración / datos sensibles", "Config / sensitive data")],
  ], { y: 3.3, colW: [2.5, 6.3], rowH: 0.36, fs: 11 });
  footer(s);

  // 8 — kubectl cheat sheet
  s = info(p);
  infoTitle(s, tr("kubectl — comandos esenciales", "kubectl — essential commands"), tr("// hablar con el clúster", "// talking to the cluster"), C.green);
  cheat(s, M, 1.45, 4.3, 1.7, C.cyan, tr("Ver", "View"), ["kubectl get pods,svc -n academia", "kubectl describe pod <pod>", "kubectl get events"]);
  cheat(s, 5.1, 1.45, 4.3, 1.7, C.green, tr("Desplegar", "Deploy"), ["kubectl apply -f archivo.yaml", "kubectl rollout status deploy/app", "kubectl port-forward svc/app 8080:80"]);
  cheat(s, M, 3.25, 4.3, 1.75, C.amber, tr("Operar", "Operate"), ["kubectl scale deploy/app --replicas=4", "kubectl set image deploy/app app=img:1.1", "kubectl rollout undo deploy/app"]);
  cheat(s, 5.1, 3.25, 4.3, 1.75, C.rose, tr("Diagnosticar", "Diagnose"), ["kubectl logs -f deploy/app", "kubectl logs <pod> --previous", "kubectl get pods -w"]);
  footer(s);

  // 9 — ConfigMap vs Secret + Escalar/Rollback
  s = info(p);
  infoTitle(s, tr("Config, Secretos y Operación", "Config, Secrets & Operations"), tr("// separar config del código + operar en vivo", "// separate config from code + operate live"), C.rose);
  card(s, M, 1.45, 4.3, 1.95, C.cyan, "ConfigMap", [tr("Config NO sensible (APP_ENV...)", "NON-sensitive config (APP_ENV...)"), tr("Texto plano, va en git", "Plain text, goes in git"), tr("Se inyecta como variables", "Injected as variables")], { fontSize: 11.5 });
  card(s, 5.1, 1.45, 4.3, 1.95, C.rose, "Secret", [tr("Datos sensibles (passwords)", "Sensitive data (passwords)"), tr("base64 NO es cifrado", "base64 is NOT encryption"), tr("Fuera de git (Vault, etc.)", "Out of git (Vault, etc.)")], { fontSize: 11.5 });
  cheat(s, M, 3.55, 8.8, 1.45, C.amber, tr("Escalar · Actualizar · Rollback", "Scale · Update · Rollback"), ["kubectl scale deploy/app --replicas=4", "kubectl set image deploy/app app=img:1.1   # rolling update", tr("kubectl rollout undo deploy/app             # vuelve a la version anterior", "kubectl rollout undo deploy/app             # back to previous version")]);
  footer(s);

  // 10 — Helm
  s = info(p);
  infoTitle(s, tr("Helm de un vistazo", "Helm at a glance"), tr("// el gestor de paquetes de Kubernetes", "// the Kubernetes package manager"), C.green);
  card(s, M, 1.45, 4.3, 1.7, C.muted, tr("YAML manual", "Manual YAML"), [tr("3 ambientes = copiar/pegar", "3 environments = copy/paste"), tr("Rollback manual", "Manual rollback"), tr("Difícil de reutilizar", "Hard to reuse")], { fontSize: 11.5 });
  card(s, 5.1, 1.45, 4.3, 1.7, C.green, "Helm", [tr("Un chart, muchos values", "One chart, many values"), tr("helm rollback en 1 comando", "helm rollback in 1 command"), tr("Plantillas reutilizables", "Reusable templates")], { fontSize: 11.5 });
  cheat(s, M, 3.3, 8.8, 1.7, C.cyan, tr("Comandos", "Commands"), ["helm install academia ./chart -n academia --create-namespace", "helm upgrade academia ./chart --set replicaCount=4", "helm history academia   /   helm rollback academia 1", "helm uninstall academia -n academia"]);
  footer(s);

  // 11 — DevSecOps
  s = info(p);
  infoTitle(s, tr("DevSecOps: seguridad shift-left", "DevSecOps: shift-left security"), tr("// seguridad en cada capa, no al final", "// security at every layer, not at the end"), C.rose);
  table(s, [
    [tr("Capa", "Layer"), tr("Control mínimo", "Minimum control"), tr("Herramienta", "Tool")],
    [tr("Código", "Code"), tr("Sin secretos; deps fijadas", "No secrets; pinned deps"), "trivy fs, npm audit"],
    [tr("Imagen", "Image"), tr("Base ligera, no root, escaneada", "Light base, non-root, scanned"), "trivy image"],
    ["Pipeline", tr("Test + scan en cada cambio", "Test + scan on every change"), "GitHub Actions"],
    ["Kubernetes", tr("securityContext, límites, probes", "securityContext, limits, probes"), "trivy config"],
    [tr("Secretos", "Secrets"), tr("Fuera de git", "Out of git"), "Secret, Vault"],
  ], { y: 1.5, colW: [1.9, 4.2, 2.7], rowH: 0.4, fs: 11 });
  bullets(s, [{ text: tr("La herramienta detecta; el criterio humano decide.", "The tool detects; human judgment decides."), color: C.amber }], { y: 4.45, h: 0.5, fontSize: 12 });
  footer(s);

  // 12 — Observabilidad
  s = info(p);
  infoTitle(s, tr("Observabilidad", "Observability"), tr("// ¿está viva? ¿sana? ¿por qué falló?", "// is it alive? healthy? why did it fail?"), C.cyan);
  card(s, M, 1.45, 2.93, 1.95, C.cyan, "LOGS", [tr("¿Qué pasó?", "What happened?"), tr("Eventos con contexto", "Events with context"), "kubectl logs -f"], { fontSize: 11.5 });
  card(s, 3.54, 1.45, 2.93, 1.95, C.green, tr("MÉTRICAS", "METRICS"), [tr("¿Cómo se comporta?", "How does it behave?"), tr("Números en el tiempo", "Numbers over time"), "Prometheus"], { fontSize: 11.5 });
  card(s, 6.47, 1.45, 2.93, 1.95, C.amber, tr("TRAZAS", "TRACES"), [tr("¿Por dónde pasó?", "Where did it go?"), tr("Recorrido de petición", "Request journey"), tr("(avanzado)", "(advanced)")], { fontSize: 11.5 });
  cheat(s, M, 3.55, 8.8, 1.45, C.green, "Probes", [tr("readinessProbe -> /health   # LISTA para tráfico?  (no envía peticiones si falla)", "readinessProbe -> /health   # READY for traffic?  (no requests if it fails)"), tr("livenessProbe  -> /health   # sigue VIVA?         (la reinicia si falla)", "livenessProbe  -> /health   # still ALIVE?        (restarts it if it fails)")]);
  footer(s);

  // 13 — Mapa de misiones
  s = info(p);
  infoTitle(s, tr("Mapa de misiones del curso", "Course mission map"), tr("// completa misiones, gana XP y medallas", "// complete missions, earn XP and badges"), C.amber);
  table(s, [
    ["Lab", tr("Misión / Medalla", "Mission / Badge"), "XP"],
    ["1", tr("Docker — Capitán de Contenedores", "Docker — Container Captain"), "100"],
    ["2", tr("Compose — Maestro Multicontenedor", "Compose — Multi-container Master"), "120"],
    ["3", tr("CI/CD — Automatizador", "CI/CD — Automator"), "130"],
    ["4", tr("Trivy — Guardián Shift-Left", "Trivy — Shift-Left Guardian"), "90"],
    ["5", tr("Kubernetes — Timonel del Clúster", "Kubernetes — Cluster Helmsman"), "140"],
    ["6", tr("Config/Secret — Custodio de Secretos", "Config/Secret — Keeper of Secrets"), "70"],
    ["7", tr("Escalar/Rollback — Operador en Vivo", "Scale/Rollback — Live Operator"), "110"],
    ["8", tr("Helm — Empaquetador", "Helm — Packager"), "100"],
    ["9", tr("Monitoreo — Observador", "Monitoring — Observer"), "90"],
    ["10", tr("Proyecto final — Arquitect@ DevOps", "Final project — DevOps Architect"), "200"],
  ], { y: 1.4, colW: [0.8, 6.6, 1.4], rowH: 0.31, fs: 10.5, hs: 11 });
  footer(s);

  // 14 — Glosario rápido
  s = info(p);
  infoTitle(s, tr("Glosario rápido", "Quick glossary"), tr("// los términos que más vas a oír", "// the terms you'll hear most"), C.green);
  const gl = (t, d) => ({ text: `${t}: ${d}`, options: { bullet: { indent: 12 }, breakLine: true, fontSize: 10.5, color: C.text, paraSpaceAfter: 5 } });
  s.addText([
    gl(tr("Imagen", "Image"), tr("plantilla de la app", "app template")),
    gl(tr("Contenedor", "Container"), tr("imagen en ejecución", "running image")),
    gl("Pod", tr("unidad mínima en K8s", "smallest K8s unit")),
    gl("Deployment", tr("gestiona réplicas", "manages replicas")),
    gl("Service", tr("acceso estable a Pods", "stable access to Pods")),
    gl("Namespace", tr("división del clúster", "cluster division")),
    gl("ConfigMap", tr("config no sensible", "non-sensitive config")),
  ], { x: M, y: 1.5, w: 4.3, h: 3.5, fontFace: F.body, valign: "top" });
  s.addText([
    gl("Secret", tr("datos sensibles", "sensitive data")),
    gl("Helm", tr("paquetes de K8s", "K8s packages")),
    gl("CI/CD", tr("build/test/deploy automático", "automated build/test/deploy")),
    gl("Pipeline", tr("pasos automatizados", "automated steps")),
    gl(tr("Observabilidad", "Observability"), tr("logs, métricas, trazas", "logs, metrics, traces")),
    gl("DevSecOps", tr("seguridad integrada", "integrated security")),
    gl("Rollback", tr("volver a la versión previa", "back to previous version")),
  ], { x: 5.1, y: 1.5, w: 4.3, h: 3.5, fontFace: F.body, valign: "top" });
  footer(s);

  return p;
}

async function main() {
  LANG = "es"; await build(newDeck("Infografías para alumnos — DevOps")).writeFile({ fileName: "Infografias_Alumnos_ES.pptx" });
  LANG = "en"; await build(newDeck("Student infographics — DevOps")).writeFile({ fileName: "Student_Infographics_EN.pptx" });
  console.log("OK: 2 decks de infografías (ES + EN), 14 infografías c/u.");
}
main();
