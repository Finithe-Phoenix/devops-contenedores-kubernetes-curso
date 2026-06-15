// Generador de los 4 decks del curso "DevOps y Contenedores con Docker & Kubernetes".
// Tema oscuro tipo terminal/neón. Ejecuta:  node generate.js
const pptxgen = require("pptxgenjs");

const C = {
  bg: "0B1B2B", panel: "12293D", panel2: "16314A", code: "081320",
  cyan: "22D3EE", green: "34D399", rose: "FB7185", amber: "FBBF24",
  text: "E8EEF5", muted: "A8B4C4", white: "FFFFFF", line: "284963",
};
const F = { head: "Trebuchet MS", body: "Calibri", mono: "Consolas" };
const M = 0.6;

function bg(s, color = C.bg) { s.background = { color }; }

function header(s, num, kicker, title) {
  s.addShape("roundRect", { x: M, y: 0.5, w: 0.62, h: 0.62, rectRadius: 0.1, fill: { color: C.cyan } });
  s.addText(String(num), { x: M, y: 0.5, w: 0.62, h: 0.62, align: "center", valign: "middle", fontFace: F.mono, fontSize: 22, bold: true, color: C.bg, margin: 0 });
  s.addText(kicker, { x: 1.4, y: 0.53, w: 8.2, h: 0.28, fontFace: F.mono, fontSize: 11, color: C.cyan, margin: 0, charSpacing: 1 });
  s.addText(title, { x: 1.4, y: 0.82, w: 8.2, h: 0.62, fontFace: F.head, fontSize: 25, bold: true, color: C.white, margin: 0 });
}

function content(p, num, kicker, title) { const s = p.addSlide(); bg(s); header(s, num, kicker, title); return s; }

function bullets(s, items, o = {}) {
  const arr = items.map((t) => {
    const obj = typeof t === "object";
    return { text: obj ? t.text : t, options: { bullet: { indent: 16 }, breakLine: true, color: (obj && t.color) || C.text, fontSize: o.fontSize || 16, bold: obj && t.bold, paraSpaceAfter: 10 } };
  });
  s.addText(arr, { x: o.x ?? M, y: o.y ?? 1.8, w: o.w ?? 8.9, h: o.h ?? 3.3, fontFace: F.body, valign: "top" });
}

function codePanel(s, lines, o = {}) {
  const x = o.x ?? M, y = o.y ?? 1.85, w = o.w ?? 8.8, h = o.h ?? 3.0;
  s.addShape("rect", { x, y, w, h, fill: { color: C.code }, line: { color: C.line, width: 1 } });
  const arr = lines.map((l) => { const obj = typeof l === "object"; return { text: obj ? l.text : l, options: { breakLine: true, color: (obj && l.color) || C.green, fontSize: o.fontSize || 13.5 } }; });
  s.addText(arr, { x: x + 0.22, y: y + 0.14, w: w - 0.44, h: h - 0.28, fontFace: F.mono, valign: "top", align: "left" });
}

function card(s, x, y, w, h, accent, titleText, items, o = {}) {
  s.addShape("rect", { x, y, w, h, fill: { color: C.panel }, line: { color: accent, width: 1.25 } });
  s.addShape("rect", { x, y, w: 0.09, h, fill: { color: accent } });
  s.addText(titleText, { x: x + 0.26, y: y + 0.16, w: w - 0.42, h: 0.42, fontFace: F.head, bold: true, fontSize: o.titleSize || 15, color: accent, margin: 0 });
  const arr = items.map((t) => ({ text: typeof t === "object" ? t.text : t, options: { bullet: { indent: 13 }, breakLine: true, color: C.text, fontSize: o.fontSize || 12.5, paraSpaceAfter: 7 } }));
  s.addText(arr, { x: x + 0.26, y: y + 0.64, w: w - 0.5, h: h - 0.8, fontFace: F.body, valign: "top" });
}

function steps(s, labels, y, accent = C.cyan) {
  const n = labels.length, gap = 0.16, totalW = 8.9;
  const bw = (totalW - gap * (n - 1)) / n;
  let x = M;
  labels.forEach((lab) => {
    s.addShape("roundRect", { x, y, w: bw, h: 0.85, rectRadius: 0.07, fill: { color: C.panel }, line: { color: accent, width: 1.25 } });
    s.addText(lab, { x: x + 0.04, y, w: bw - 0.08, h: 0.85, align: "center", valign: "middle", fontFace: F.body, fontSize: 11.5, bold: true, color: C.text, margin: 0 });
    x += bw + gap;
  });
}

function callout(s, big, sub, accent = C.amber, y = 2.1) {
  s.addShape("rect", { x: M, y, w: 8.8, h: 1.7, fill: { color: C.panel }, line: { color: accent, width: 1.5 } });
  s.addShape("rect", { x: M, y, w: 0.1, h: 1.7, fill: { color: accent } });
  s.addText(big, { x: M + 0.35, y: y + 0.22, w: 8.2, h: 0.85, fontFace: F.head, bold: true, fontSize: 24, color: accent, margin: 0 });
  s.addText(sub, { x: M + 0.35, y: y + 1.0, w: 8.2, h: 0.6, fontFace: F.body, fontSize: 15, color: C.text, margin: 0 });
}

function table(s, rows, o = {}) {
  const head = rows[0].map((c) => ({ text: c, options: { fill: { color: C.cyan }, color: C.bg, bold: true, fontSize: o.hs || 12.5, align: "left", valign: "middle" } }));
  const body = rows.slice(1).map((r, ri) => r.map((c) => ({ text: c, options: { fill: { color: ri % 2 ? C.panel : C.panel2 }, color: C.text, fontSize: o.fs || 11.5, align: "left", valign: "middle" } })));
  s.addTable([head, ...body], { x: o.x ?? M, y: o.y ?? 1.8, w: o.w ?? 8.8, colW: o.colW, rowH: o.rowH || 0.38, border: { type: "solid", pt: 1, color: C.line }, fontFace: F.body, margin: 4, valign: "middle" });
}

function titleSlide(p, kicker, title, subtitle, footer) {
  const s = p.addSlide(); bg(s);
  s.addShape("roundRect", { x: 8.55, y: 0.5, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: C.cyan } });
  s.addShape("roundRect", { x: 9.1, y: 0.5, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: C.rose, transparency: 25 } });
  s.addShape("roundRect", { x: 8.55, y: 1.05, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: C.green, transparency: 25 } });
  s.addText(kicker, { x: M, y: 1.55, w: 8, h: 0.4, fontFace: F.mono, fontSize: 15, color: C.cyan, margin: 0, charSpacing: 1 });
  s.addText(title, { x: M, y: 2.0, w: 8.9, h: 1.5, fontFace: F.head, bold: true, fontSize: 38, color: C.white, margin: 0 });
  s.addText(subtitle, { x: M, y: 3.6, w: 8.9, h: 0.6, fontFace: F.body, fontSize: 17, color: C.muted, margin: 0 });
  s.addShape("rect", { x: M, y: 4.75, w: 8.8, h: 0.012, fill: { color: C.line } });
  s.addText(footer, { x: M, y: 4.9, w: 8.9, h: 0.4, fontFace: F.mono, fontSize: 12, color: C.muted, margin: 0 });
  return s;
}

function closing(p, big, sub) {
  const s = p.addSlide(); bg(s);
  s.addText("// fin del día", { x: M, y: 1.9, w: 8, h: 0.4, fontFace: F.mono, fontSize: 14, color: C.cyan, margin: 0 });
  s.addText(big, { x: M, y: 2.3, w: 8.9, h: 1.4, fontFace: F.head, bold: true, fontSize: 30, color: C.white, margin: 0 });
  s.addText(sub, { x: M, y: 3.7, w: 8.9, h: 0.8, fontFace: F.body, fontSize: 16, color: C.muted, margin: 0 });
  return s;
}

function newDeck(title) { const p = new pptxgen(); p.layout = "LAYOUT_16x9"; p.author = "Daniel Eduardo Gonzalez Ramirez"; p.title = title; return p; }

// ====================================================================
// DECK 1 — DÍA 1: Fundamentos DevOps, Git y Docker
// ====================================================================
function deck1() {
  const p = newDeck("Día 1 — DevOps y Docker");
  titleSlide(p, "CURSO-TALLER · DÍA 1", "Fundamentos DevOps,\nGit y Docker", "De código fuente a contenedor en ejecución", "Tecnológico de Toluca · Daniel E. González Ramírez · 24 h");

  let s = content(p, 1, "// agenda · 4 días", "El viaje de los próximos 4 días");
  steps(s, ["Docker", "Compose +\nCI/CD", "Kubernetes\n+ Helm", "Observar +\nSeguridad"], 2.0);
  bullets(s, [
    { text: "Día 1: contenerizamos una app desde cero.", bold: true },
    "Día 2: la levantamos con su base de datos y la automatizamos.",
    "Día 3: la desplegamos, escalamos y actualizamos en Kubernetes.",
    "Día 4: la monitoreamos, aseguramos y la convertimos en práctica docente.",
  ], { y: 3.2, h: 2.1, fontSize: 15 });

  s = content(p, 2, "// el problema", "\"En mi máquina sí funciona\"");
  callout(s, "El clásico que todos conocemos", "El código corre en tu laptop... y se rompe en la del alumno, en el servidor o en la revisión. Distintas versiones, dependencias y sistemas operativos.", C.rose);
  bullets(s, ["DevOps existe para que \"funcione en todas partes\", no solo en una máquina."], { y: 4.0, h: 0.6, fontSize: 15 });

  s = content(p, 3, "// concepto", "¿Qué es DevOps?");
  bullets(s, [
    { text: "Cultura: desarrollo y operación trabajan juntos, no en silos.", bold: true },
    "Automatización: build, pruebas, despliegue y monitoreo sin pasos manuales.",
    "Integración: desarrollo + pruebas + seguridad + operación en un solo flujo.",
    "No es una herramienta: es una forma de pensar el ciclo completo del software.",
  ]);

  s = content(p, 4, "// el flujo moderno", "El ciclo: de la idea a producción");
  steps(s, ["código", "build", "test", "empacar", "deploy", "monitor", "proteger"], 2.1);
  bullets(s, ["Cada etapa se automatiza y se repite igual siempre.", "Si algo falla temprano, no llega a producción."], { y: 3.3, h: 1.5, fontSize: 16 });

  s = content(p, 5, "// no confundir", "DevOps vs CI/CD vs SRE");
  card(s, M, 1.85, 2.78, 3.1, C.cyan, "DevOps", ["La cultura y las prácticas", "Une dev + ops", "El \"qué\" y el \"porqué\""]);
  card(s, 3.5, 1.85, 2.78, 3.1, C.green, "CI/CD", ["La automatización", "Build, test, deploy", "El \"cómo\" técnico"]);
  card(s, 6.2, 1.85, 2.78, 3.1, C.amber, "SRE", ["Operar con ingeniería", "SLOs, fiabilidad", "El \"qué tan bien\""]);

  s = content(p, 6, "// día 1 · git", "Git: la base de todo el flujo");
  bullets(s, [
    "Todo empieza versionado: repositorio, commits, ramas.",
    "Rama → commit → push → pull request → merge.",
    "Un repo profesional: README, .gitignore, releases.",
  ], { h: 1.7 });
  codePanel(s, [
    { text: "$ git clone <repo-del-curso>", color: C.cyan },
    "$ git checkout -b feature/dockerfile",
    "$ git add . && git commit -m \"feat: agrega Dockerfile\"",
    "$ git push origin feature/dockerfile",
  ], { y: 3.45, h: 1.6 });

  s = content(p, 7, "// día 1 · docker", "Docker: ¿qué problema resuelve?");
  bullets(s, [
    { text: "Empaqueta la app CON todo lo que necesita para correr.", bold: true },
    "La misma imagen corre igual en tu laptop, en CI y en el servidor.",
    "Adiós a \"instala estas 12 cosas antes de ejecutar\".",
    "Ligero y rápido: comparte el kernel del sistema (no es una VM completa).",
  ]);

  s = content(p, 8, "// concepto clave", "Imagen vs Contenedor");
  card(s, M, 1.85, 4.25, 3.0, C.cyan, "IMAGEN", ["Plantilla inmutable (la receta)", "Se construye: docker build", "Una imagen → muchos contenedores"]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.green, "CONTENEDOR", ["Instancia en ejecución (el platillo)", "Se crea: docker run", "Tiene su propio estado y vida"]);

  s = content(p, 9, "// comparación", "Contenedor vs Máquina Virtual");
  card(s, M, 1.85, 4.25, 3.0, C.green, "CONTENEDOR", ["Comparte el kernel del host", "Arranca en segundos", "MB de tamaño", "Ideal para microservicios"]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.muted, "MÁQUINA VIRTUAL", ["SO completo por máquina", "Arranca en minutos", "GB de tamaño", "Aislamiento más fuerte"]);

  s = content(p, 10, "// día 1 · dockerfile", "Anatomía de un Dockerfile");
  codePanel(s, [
    { text: "FROM node:22-alpine           # imagen base ligera", color: C.cyan },
    "WORKDIR /app                  # carpeta de trabajo",
    "COPY package*.json ./         # primero deps (cache de capas)",
    "RUN npm ci --omit=dev         # instala dependencias",
    "COPY src ./src                # luego el código",
    "EXPOSE 8080                   # documenta el puerto",
    "USER node                     # NO correr como root",
    { text: "CMD [\"node\", \"src/server.js\"]  # comando de arranque", color: C.amber },
  ], { y: 1.85, h: 3.1, fontSize: 13 });

  s = content(p, 11, "// buenas prácticas", "Dockerfile: inseguro vs seguro");
  card(s, M, 1.85, 4.25, 3.0, C.rose, "INSEGURO", ["FROM node:22 (≈1 GB)", "COPY . . (todo, hasta secretos)", "npm install (con devDeps)", "ENV DB_PASSWORD=... (quemado)", "corre como root"]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.green, "SEGURO", ["node:22-alpine (ligera)", ".dockerignore + copia selectiva", "npm ci --omit=dev", "secreto por variable/Secret", "USER node + HEALTHCHECK"]);

  s = content(p, 12, "// misión 1", "Lab 1 — Capitán de Contenedores (+100 XP)");
  bullets(s, ["Construye la imagen de la app y córrela; /health responde."], { y: 1.8, h: 0.6, fontSize: 16 });
  codePanel(s, [
    { text: "$ docker build -t academia-devops-app:1.0.0 .", color: C.cyan },
    "$ docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0",
    "$ docker ps",
    "$ curl http://localhost:8080/health",
    { text: "  {\"status\":\"UP\", ...}   <- evidencia de la misión", color: C.amber },
  ], { y: 2.5, h: 2.0 });

  s = content(p, 13, "// para clase", "Preguntas detonadoras");
  bullets(s, [
    { text: "¿Qué problema resuelve un contenedor?", bold: true },
    { text: "¿Qué SÍ debería ir dentro de una imagen?", bold: true },
    { text: "¿Qué NUNCA debería ir dentro de una imagen?", bold: true },
    { text: "¿Cómo garantizas que todos tus alumnos tengan el mismo ambiente?", bold: true },
  ], { fontSize: 17 });

  closing(p, "Hoy: de código a contenedor.", "Mañana: lo levantamos con su base de datos y lo automatizamos con CI/CD.");
  return p;
}

// ====================================================================
// DECK 2 — DÍA 2: Docker Compose, CI/CD y DevSecOps
// ====================================================================
function deck2() {
  const p = newDeck("Día 2 — Compose, CI/CD, DevSecOps");
  titleSlide(p, "CURSO-TALLER · DÍA 2", "Compose, CI/CD\ny DevSecOps", "Multicontenedor + automatización + seguridad básica", "Tecnológico de Toluca · Daniel E. González Ramírez · 24 h");

  let s = content(p, 1, "// repaso", "Lo que ya logramos");
  bullets(s, [
    { text: "Ayer: app contenerizada y corriendo.", bold: true, color: C.green },
    "Hoy: app + base de datos juntas (Docker Compose).",
    "Hoy: automatizamos build y pruebas (CI/CD).",
    "Hoy: primer escaneo de seguridad (DevSecOps).",
  ]);

  s = content(p, 2, "// día 2 · compose", "¿Por qué Docker Compose?");
  bullets(s, [
    { text: "Las apps reales son varios contenedores: app + base de datos + caché...", bold: true },
    "Compose los define y levanta TODOS con un solo archivo YAML.",
    "Un comando arriba, un comando abajo. Reproducible.",
  ], { h: 1.5 });
  codePanel(s, [
    { text: "$ docker compose up -d      # levanta app + db", color: C.cyan },
    "$ docker compose ps         # estado de los servicios",
    "$ docker compose down -v    # apaga y borra volúmenes",
  ], { y: 3.3, h: 1.5 });

  s = content(p, 3, "// arquitectura", "App + Base de datos");
  s.addShape("roundRect", { x: 1.2, y: 2.3, w: 2.6, h: 1.3, rectRadius: 0.1, fill: { color: C.panel }, line: { color: C.cyan, width: 1.5 } });
  s.addText("app\n(:8080)", { x: 1.2, y: 2.3, w: 2.6, h: 1.3, align: "center", valign: "middle", fontFace: F.mono, fontSize: 16, bold: true, color: C.cyan, margin: 0 });
  s.addShape("line", { x: 3.8, y: 2.95, w: 1.4, h: 0, line: { color: C.green, width: 2.5, endArrowType: "triangle" } });
  s.addText("red interna\n\"db\"", { x: 3.8, y: 2.35, w: 1.4, h: 0.5, align: "center", fontFace: F.mono, fontSize: 10, color: C.muted, margin: 0 });
  s.addShape("roundRect", { x: 5.2, y: 2.3, w: 2.6, h: 1.3, rectRadius: 0.1, fill: { color: C.panel }, line: { color: C.green, width: 1.5 } });
  s.addText("postgres\n(:5432)", { x: 5.2, y: 2.3, w: 2.6, h: 1.3, align: "center", valign: "middle", fontFace: F.mono, fontSize: 16, bold: true, color: C.green, margin: 0 });
  s.addShape("roundRect", { x: 5.6, y: 3.8, w: 1.8, h: 0.55, rectRadius: 0.08, fill: { color: C.code }, line: { color: C.line, width: 1 } });
  s.addText("volumen db_data", { x: 5.6, y: 3.8, w: 1.8, h: 0.55, align: "center", valign: "middle", fontFace: F.mono, fontSize: 10, color: C.amber, margin: 0 });
  bullets(s, ["La app encuentra a la DB por su NOMBRE de servicio (db), no por IP."], { x: 1.2, y: 4.55, w: 7, h: 0.5, fontSize: 14 });

  s = content(p, 4, "// concepto", "Persistencia: el volumen");
  bullets(s, [
    { text: "Sin volumen, los datos mueren cuando el contenedor se borra.", color: C.rose },
    { text: "Con volumen, los datos SOBREVIVEN a reinicios y recreaciones.", color: C.green },
    "Demo: crea un curso, reinicia la app... el curso sigue ahí.",
    "docker compose down conserva el volumen; down -v lo borra.",
  ]);

  s = content(p, 5, "// día 2 · ci/cd", "CI/CD: una línea de producción");
  steps(s, ["checkout", "install", "test", "build\nimagen", "scan", "deploy"], 2.1);
  bullets(s, [
    { text: "CI (Integración Continua): build + test en CADA cambio.", bold: true },
    { text: "CD (Entrega Continua): llevar lo probado a un ambiente.", bold: true },
    "Si un paso falla, el commit se marca rojo y no avanza.",
  ], { y: 3.3, h: 1.7, fontSize: 15 });

  s = content(p, 6, "// anatomía", "Un pipeline de GitHub Actions");
  codePanel(s, [
    { text: "on: [push, pull_request]      # cuándo se dispara", color: C.cyan },
    "jobs:",
    "  build-test-scan:",
    "    runs-on: ubuntu-latest      # el runner (VM efímera)",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "      - run: npm ci",
    { text: "      - run: npm test            # rojo si un test falla", color: C.amber },
    "      - run: docker build -t app:${{ github.sha }} .",
  ], { y: 1.85, h: 3.1, fontSize: 12.5 });

  s = content(p, 7, "// herramientas", "GitHub Actions vs Jenkins");
  card(s, M, 1.85, 4.25, 3.0, C.cyan, "GitHub Actions", ["Integrado al repo", "YAML sencillo, runners gratis", "Ruta PRINCIPAL del curso", "Cero servidores que mantener"]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.amber, "Jenkins", ["Estándar empresarial", "Jenkinsfile (Groovy)", "Ruta ALTERNATIVA", "Requiere servidor y plugins"]);

  s = content(p, 8, "// día 2 · devsecops", "Seguridad: shift-left");
  callout(s, "Mover la seguridad a la izquierda", "Revisar la seguridad TEMPRANO (código, imagen, pipeline) cuesta menos y rompe menos que descubrirla en producción.", C.green);
  bullets(s, ["Encontrar una vulnerabilidad no es lo mismo que corregirla. La herramienta acelera; el criterio humano decide."], { y: 4.0, h: 0.7, fontSize: 14 });

  s = content(p, 9, "// misión 4", "Trivy: escanear la imagen (+90 XP)");
  codePanel(s, [
    { text: "$ trivy image academia-devops-app:1.0.0", color: C.cyan },
    "",
    "  Library   Vulnerability   Severity   Fixed in",
    { text: "  openssl   CVE-2024-xxxx   HIGH       3.1.5", color: C.rose },
    "",
    { text: "  Prioriza: CRITICAL/HIGH con \"Fixed in\" -> actualiza.", color: C.amber },
  ], { y: 1.85, h: 2.6 });
  bullets(s, ["Bonus: detecta el secreto quemado con --scanners secret."], { y: 4.6, h: 0.5, fontSize: 14 });

  s = content(p, 10, "// misiones de hoy", "Lo que te llevas del día 2");
  table(s, [
    ["Misión", "Logras", "XP"],
    ["Lab 2 · Compose", "App + DB con persistencia", "120"],
    ["Lab 3 · CI/CD", "Pipeline en verde", "130"],
    ["Lab 4 · DevSecOps", "Escaneo e interpretación", "90"],
  ], { colW: [3.2, 4.0, 1.6], rowH: 0.55 });

  s = content(p, 11, "// para clase", "Preguntas detonadoras");
  bullets(s, [
    { text: "¿Por qué la app llama a la DB por nombre y no por IP?", bold: true },
    { text: "¿Qué validaciones debe pasar el código antes de aceptarse?", bold: true },
    { text: "¿Qué diferencia hay entre compilar local y compilar en el pipeline?", bold: true },
    { text: "¿Qué riesgo tiene guardar secretos en un repositorio?", bold: true },
  ], { fontSize: 16 });

  closing(p, "Hoy: multicontenedor y automatización.", "Mañana: Kubernetes — desplegar, exponer, escalar y actualizar.");
  return p;
}

// ====================================================================
// DECK 3 — DÍA 3: Kubernetes y Helm
// ====================================================================
function deck3() {
  const p = newDeck("Día 3 — Kubernetes y Helm");
  titleSlide(p, "CURSO-TALLER · DÍA 3", "Kubernetes\ny Helm", "Desplegar, exponer, escalar, actualizar y empaquetar", "Tecnológico de Toluca · Daniel E. González Ramírez · 24 h");

  let s = content(p, 1, "// día 3 · k8s", "¿Por qué Kubernetes?");
  bullets(s, [
    { text: "Docker corre contenedores en UNA máquina. ¿Y si necesitas muchos, en muchas?", bold: true },
    "Kubernetes orquesta: los despliega, los reinicia si mueren, los escala.",
    "Estado deseado: tú dices \"quiero 4 réplicas\" y K8s lo mantiene.",
    "Es el estándar de la industria para correr contenedores en producción.",
  ]);

  s = content(p, 2, "// arquitectura", "Anatomía de un clúster");
  card(s, M, 1.85, 4.25, 3.0, C.cyan, "CONTROL PLANE", ["El \"cerebro\"", "Decide y programa", "Mantiene el estado deseado", "API Server, scheduler"]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.green, "WORKER NODES", ["Las máquinas que trabajan", "Aquí viven los Pods", "Ejecutan los contenedores", "Reportan su estado"]);

  s = content(p, 3, "// vocabulario", "Los objetos que usaremos");
  table(s, [
    ["Objeto", "Qué es"],
    ["Pod", "Unidad mínima; envuelve el/los contenedor(es)"],
    ["Deployment", "Gestiona réplicas y actualizaciones"],
    ["Service", "Punto de acceso estable a los Pods"],
    ["Namespace", "División lógica del clúster"],
    ["ConfigMap / Secret", "Configuración y datos sensibles"],
  ], { colW: [2.6, 6.2], rowH: 0.46 });

  s = content(p, 4, "// jerarquía", "Deployment → ReplicaSet → Pods");
  steps(s, ["Deployment", "ReplicaSet", "Pod  Pod  Pod"], 2.4, C.cyan);
  bullets(s, [
    "El Deployment define QUÉ quieres (imagen, réplicas).",
    "El ReplicaSet garantiza CUÁNTAS copias.",
    "Los Pods son las copias en ejecución. Si uno muere, se recrea.",
  ], { y: 3.6, h: 1.5, fontSize: 15 });

  s = content(p, 5, "// manifiesto", "Un Deployment en YAML");
  codePanel(s, [
    { text: "apiVersion: apps/v1", color: C.cyan },
    "kind: Deployment",
    "metadata: { name: academia-app }",
    "spec:",
    "  replicas: 2                  # cuántas copias",
    "  selector: { matchLabels: { app: academia-app } }",
    "  template:",
    "    spec:",
    "      containers:",
    { text: "        - image: academia-devops-app:1.0.0", color: C.amber },
  ], { y: 1.85, h: 3.1, fontSize: 12.5 });

  s = content(p, 6, "// exponer", "Service: acceso estable");
  bullets(s, [
    { text: "Los Pods son efímeros (cambian de IP). El Service da una dirección fija.", bold: true },
  ], { y: 1.8, h: 0.7, fontSize: 15 });
  card(s, M, 2.5, 2.78, 2.4, C.cyan, "ClusterIP", ["Interno al clúster", "Default", "Acceso por port-forward"], { fontSize: 12 });
  card(s, 3.5, 2.5, 2.78, 2.4, C.green, "NodePort", ["Abre un puerto", "en cada nodo", "Acceso externo básico"], { fontSize: 12 });
  card(s, 6.2, 2.5, 2.78, 2.4, C.amber, "LoadBalancer", ["IP externa", "en la nube", "Producción real"], { fontSize: 12 });

  s = content(p, 7, "// día 3 · config", "ConfigMap vs Secret");
  card(s, M, 1.85, 4.25, 3.0, C.cyan, "ConfigMap", ["Config NO sensible", "APP_ENV, APP_VERSION", "Texto plano, va en git", "Inyectado como variables"]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.rose, "Secret", ["Datos sensibles", "Usuarios, contraseñas", "base64 NO es cifrado", "Fuera de git (Vault, etc.)"]);

  s = content(p, 8, "// misión 7", "Escalar, actualizar y rollback");
  codePanel(s, [
    { text: "# Escalar a 4 réplicas", color: C.muted },
    "$ kubectl scale deployment academia-app --replicas=4",
    { text: "# Actualizar imagen (rolling update, sin downtime)", color: C.muted },
    "$ kubectl set image deploy/academia-app academia-app=...:1.0.1",
    { text: "# Volver atrás si algo salió mal", color: C.muted },
    { text: "$ kubectl rollout undo deployment/academia-app", color: C.amber },
  ], { y: 1.85, h: 2.7 });
  bullets(s, ["Kubernetes reemplaza los Pods de a poco: la app nunca se cae."], { y: 4.65, h: 0.5, fontSize: 14 });

  s = content(p, 9, "// pregunta clave", "1 réplica ≠ alta disponibilidad");
  callout(s, "Una sola copia es un único punto de falla", "Si ese Pod muere, hay segundos sin servicio mientras se recrea. Con varias réplicas, el resto sigue atendiendo. Eso es alta disponibilidad.", C.amber);

  s = content(p, 10, "// día 3 · helm", "YAML manual vs Helm");
  card(s, M, 1.85, 4.25, 3.0, C.muted, "YAML manual", ["3 ambientes = copiar/pegar", "kubectl apply uno por uno", "Volver atrás: manual", "Difícil de reutilizar"]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.green, "Helm", ["Un chart, muchos values", "helm install (todo junto)", "helm rollback (1 comando)", "Plantillas reutilizables"]);

  s = content(p, 11, "// misión 8", "Helm en acción (+100 XP)");
  codePanel(s, [
    { text: "$ helm install academia ./academia-app-chart -n academia", color: C.cyan },
    "$ helm upgrade academia ./academia-app-chart --set replicaCount=4",
    "$ helm history academia -n academia",
    { text: "$ helm rollback academia 1 -n academia", color: C.amber },
  ], { y: 1.85, h: 2.0 });
  bullets(s, ["Cambiar réplicas SIN editar ningún YAML: solo --set."], { y: 4.0, h: 0.5, fontSize: 14 });

  s = content(p, 12, "// para clase", "Preguntas detonadoras");
  bullets(s, [
    { text: "¿Qué pasa si una aplicación se cae?", bold: true },
    { text: "¿Por qué una réplica NO es alta disponibilidad?", bold: true },
    { text: "¿Qué va en ConfigMap y qué va en Secret?", bold: true },
    { text: "¿Cuándo conviene Helm sobre YAML manual?", bold: true },
  ], { fontSize: 16 });

  closing(p, "Hoy: la app vive en Kubernetes.", "Mañana: la observamos, la aseguramos y cerramos con el proyecto integrador.");
  return p;
}

// ====================================================================
// DECK 4 — DÍA 4: Observabilidad, DevSecOps y Proyecto
// ====================================================================
function deck4() {
  const p = newDeck("Día 4 — Observabilidad, DevSecOps, Proyecto");
  titleSlide(p, "CURSO-TALLER · DÍA 4", "Observabilidad,\nDevSecOps y cierre", "Monitorear, asegurar y convertirlo en práctica docente", "Tecnológico de Toluca · Daniel E. González Ramírez · 24 h");

  let s = content(p, 1, "// día 4 · observabilidad", "Los 3 pilares");
  card(s, M, 1.85, 2.78, 3.0, C.cyan, "LOGS", ["¿Qué pasó?", "Eventos con contexto", "kubectl logs"]);
  card(s, 3.5, 1.85, 2.78, 3.0, C.green, "MÉTRICAS", ["¿Cómo se comporta?", "Números en el tiempo", "/metrics + Prometheus"]);
  card(s, 6.2, 1.85, 2.78, 3.0, C.amber, "TRAZAS", ["¿Por dónde pasó?", "Recorrido de una petición", "Concepto avanzado"]);

  s = content(p, 2, "// qué vigilar", "¿Qué monitorear y por qué?");
  table(s, [
    ["Señal", "Por qué importa"],
    ["CPU / memoria", "Saturación -> lentitud o reinicios"],
    ["Estado de Pods", "¿Reinicios? ¿CrashLoop?"],
    ["Latencia", "Experiencia del usuario"],
    ["Errores (5xx)", "¿Algo se rompió?"],
    ["Disponibilidad", "¿Está arriba?"],
  ], { colW: [2.8, 6.0], rowH: 0.46 });

  s = content(p, 3, "// salud", "Liveness vs Readiness");
  card(s, M, 1.85, 4.25, 3.0, C.green, "Liveness probe", ["¿Sigue VIVA?", "Si falla -> la reinicia", "Detecta cuelgues"]);
  card(s, 5.1, 1.85, 4.3, 3.0, C.cyan, "Readiness probe", ["¿LISTA para tráfico?", "Si falla -> no le manda peticiones", "Espera a que arranque"]);

  s = content(p, 4, "// misión 9", "Prometheus + Grafana");
  steps(s, ["app /metrics", "Prometheus\n(scraping)", "Grafana\n(dashboards)"], 2.2, C.green);
  bullets(s, [
    "Prometheus \"raspa\" las métricas que la app expone en /metrics.",
    "Grafana las dibuja en dashboards: CPU, memoria, estado de Pods.",
    { text: "Plan B (equipos modestos): /metrics + kubectl top + capturas.", color: C.amber },
  ], { y: 3.4, h: 1.6, fontSize: 15 });

  s = content(p, 5, "// logs", "Buenos vs inútiles vs peligrosos");
  card(s, M, 1.85, 2.78, 3.0, C.green, "ÚTIL", ["Timestamp + nivel", "Contexto (host, id)", "Se puede diagnosticar"], { fontSize: 12 });
  card(s, 3.5, 1.85, 2.78, 3.0, C.muted, "INÚTIL", ["Solo dice \"error\"", "Sin qué/dónde/cuándo", "No ayuda en nada"], { fontSize: 12 });
  card(s, 6.2, 1.85, 2.78, 3.0, C.rose, "PELIGROSO", ["Loguea passwords", "Datos personales", "= secreto filtrado"], { fontSize: 12 });

  s = content(p, 6, "// dinámica", "Simulación de incidentes");
  card(s, M, 1.85, 4.25, 1.45, C.cyan, "Un Pod se reinicia solo", ["describe + logs --previous -> probe u OOMKilled"], { fontSize: 12 });
  card(s, 5.1, 1.85, 4.3, 1.45, C.green, "La app responde lento", ["CPU al tope -> escalar / ajustar límites"], { fontSize: 12 });
  card(s, M, 3.45, 4.25, 1.45, C.amber, "La DB no responde", ["/health: db down -> readiness / credenciales"], { fontSize: 12 });
  card(s, 5.1, 3.45, 4.3, 1.45, C.rose, "CI verde, prod falla", ["imagen no cargada / falta un Secret"], { fontSize: 12 });

  s = content(p, 7, "// devsecops", "Controles por capa");
  table(s, [
    ["Capa", "Control mínimo"],
    ["Código", "Sin secretos; dependencias fijadas"],
    ["Imagen", "Base ligera, no root, escaneada"],
    ["Pipeline", "Test + scan en cada cambio"],
    ["Kubernetes", "securityContext, límites, probes"],
    ["Secretos", "Fuera de git (Secret / Vault)"],
  ], { colW: [2.4, 6.4], rowH: 0.46 });

  s = content(p, 8, "// evolución", "GitOps, Terraform y Ansible");
  card(s, M, 1.85, 2.78, 3.0, C.cyan, "GitOps", ["Estado deseado en git", "Argo CD / Flux", "Sincroniza el clúster"]);
  card(s, 3.5, 1.85, 2.78, 3.0, C.green, "Terraform", ["Infraestructura como código", "PROVISIONA recursos", "Crea la infra"]);
  card(s, 6.2, 1.85, 2.78, 3.0, C.amber, "Ansible", ["Automatización de config", "CONFIGURA servidores", "Deja todo listo"]);

  s = content(p, 9, "// el camino", "Roadmap de madurez DevOps");
  bullets(s, [
    { text: "1. Manual  ·  2. Scripts  ·  3. Docker", bold: true },
    { text: "4. CI/CD  ·  5. Kubernetes  ·  6. Helm", bold: true },
    { text: "7. Observabilidad  ·  8. DevSecOps", bold: true },
    { text: "9. GitOps  ·  10. Plataforma interna", bold: true, color: C.cyan },
  ], { fontSize: 18 });

  s = content(p, 10, "// misión final", "El reto integrador (+200 XP)");
  bullets(s, [
    { text: "Demuestra el flujo COMPLETO en ~5 minutos:", bold: true },
    "Repo -> Docker -> Compose -> Pipeline -> Kubernetes -> Escalar -> Seguridad -> Monitoreo.",
    { text: "Y la pregunta que importa: ¿cómo lo conviertes en práctica para TUS alumnos?", color: C.amber },
  ]);

  s = content(p, 11, "// evaluación", "Rúbrica y rangos");
  table(s, [
    ["Resultado", "Rango desbloqueado"],
    ["21-24 pts", "Arquitect@ DevOps"],
    ["14-20 pts", "Pilot@ de Kubernetes"],
    ["8 criterios x 3 = 24", "8 medallas + tarjeta de logros"],
  ], { colW: [3.2, 5.6], rowH: 0.55 });

  const sc = closing(p, "DevOps no es solo herramientas: es enseñar a pensar el ciclo completo.", "Un programa no termina cuando compila: debe probarse, empaquetarse, desplegarse, monitorearse y protegerse.");
  sc.addText("¡Gracias! — Daniel E. González Ramírez", { x: M, y: 4.7, w: 8.9, h: 0.4, fontFace: F.mono, fontSize: 13, color: C.cyan, margin: 0 });

  return p;
}

async function main() {
  await deck1().writeFile({ fileName: "01_Dia_1_DevOps_Docker.pptx" });
  await deck2().writeFile({ fileName: "02_Dia_2_Compose_CICD_DevSecOps.pptx" });
  await deck3().writeFile({ fileName: "03_Dia_3_Kubernetes_Helm.pptx" });
  await deck4().writeFile({ fileName: "04_Dia_4_Observabilidad_DevSecOps_Proyecto.pptx" });
  console.log("OK: 4 decks generados.");
}
main();
