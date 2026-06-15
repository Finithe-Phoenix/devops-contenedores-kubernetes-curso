// Frontend de la Academia DevOps App — vanilla JS, sin dependencias.
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const REPO = "https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso";
const GUIDE_BASE = REPO + "/blob/main/guias/";

// ====================== ESTADO DEL SISTEMA ======================
async function loadStatus() {
  const cards = $("#status-cards");
  try {
    const [health, version, courses] = await Promise.all([
      fetch("/health").then((r) => r.json()),
      fetch("/version").then((r) => r.json()),
      fetch("/courses").then((r) => r.json()),
    ]);
    const up = health.status === "UP";
    setHero(up, health.store);
    cards.innerHTML = "";
    cards.append(
      statusCard("/health", up ? "cyan" : "amber", [["estado", health.status], ["almacén", health.store], ["db", health.db], ["uptime", health.uptime_s + "s"]]),
      statusCard("/version", "green", [["versión", version.version], ["app", version.name], ["node", version.node]]),
      bigCard("/courses", "amber", courses.length, "cursos registrados"),
    );
  } catch {
    setHero(false, "");
    cards.innerHTML = `<div class="card amber"><h3>sin conexión</h3><p>La app no responde. ¿Está corriendo el contenedor?</p></div>`;
  }
}
function statusCard(title, color, rows) {
  const el = document.createElement("div");
  el.className = "card " + color;
  el.innerHTML = `<h3>${title}</h3>` + rows.map(([k]) => `<div class="kv"><span>${k}</span><b></b></div>`).join("");
  el.querySelectorAll(".kv b").forEach((b, i) => (b.textContent = rows[i][1]));
  return el;
}
function bigCard(title, color, big, label) {
  const el = document.createElement("div");
  el.className = "card " + color;
  el.innerHTML = `<h3>${title}</h3><div class="big">${big}</div><div class="kv"><span>${label}</span></div>`;
  return el;
}
function setHero(up, store) {
  $("#hero-status").innerHTML = `<span class="dot ${up ? "up" : "down"}"></span> ${up ? "sistema arriba" : "sin conexión"}${store ? " · " + store : ""}`;
}

// ====================== CURSOS (CRUD) ======================
async function loadCourses() {
  const grid = $("#course-grid");
  try {
    const res = await fetch("/courses");
    const courses = await res.json();
    const health = await fetch("/health").then((r) => r.json()).catch(() => ({}));
    const store = health.store || "—";
    $("#courses-store").textContent = store === "postgres" ? "PostgreSQL" : (store === "memory" ? "en memoria" : "—");
    setPersistHint(store);
    logApi("GET", "/courses", res.status, `${courses.length} curso${courses.length === 1 ? "" : "s"} en la base`);
    grid.innerHTML = "";
    if (!courses.length) { grid.innerHTML = `<p class="lead">Sin cursos. Agrega el primero arriba ☝️</p>`; return; }
    courses.forEach((c) => grid.append(courseCard(c)));
  } catch { grid.innerHTML = `<p class="msg err">No se pudieron cargar los cursos.</p>`; logApi("GET", "/courses", "ERR", "sin conexión"); }
}
function setPersistHint(store) {
  const el = $("#persist-hint"); if (!el) return;
  if (store === "postgres") { el.className = "persist-hint persist"; el.textContent = "▸ store: postgres → estos datos SOBREVIVEN a reinicios (viven en el volumen — eso es el Lab 2)."; }
  else if (store === "memory") { el.className = "persist-hint ephemeral"; el.textContent = "▸ store: memory → se PIERDEN al reiniciar el contenedor (aún sin base de datos — levanta Compose para persistir)."; }
  else { el.className = "persist-hint"; el.textContent = ""; }
}
function courseCard(c) {
  const el = document.createElement("div");
  el.className = "course";
  const head = document.createElement("div"); head.className = "c-head";
  const code = document.createElement("span"); code.className = "code"; code.textContent = c.code;
  const idb = document.createElement("span"); idb.className = "c-id"; idb.textContent = "#" + c.id;
  head.append(code, idb);
  const name = document.createElement("div"); name.className = "cname"; name.textContent = c.name;
  const prof = document.createElement("div"); prof.className = "prof"; prof.textContent = c.professor ? "👤 " + c.professor : "—";
  const ep = document.createElement("div"); ep.className = "c-ep"; ep.textContent = "GET /courses/" + c.id;
  const del = document.createElement("button"); del.className = "del"; del.textContent = "✕"; del.title = "DELETE /courses/" + c.id;
  del.onclick = () => deleteCourse(c.id);
  el.append(head, name, prof, ep, del);
  return el;
}
async function addCourse(e) {
  e.preventDefault();
  const f = e.target;
  const body = { code: f.code.value.trim(), name: f.name.value.trim(), professor: f.professor.value.trim() || null };
  const res = await fetch("/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (res.ok) {
    const created = await res.json().catch(() => ({}));
    logApi("POST", "/courses", res.status, `→ creó id ${created.id} "${created.code}"`);
    showMsg("ok", `✓ Curso "${body.code}" agregado (POST 201).`); f.reset(); refresh();
  } else {
    const err = await res.json().catch(() => ({}));
    logApi("POST", "/courses", res.status, err.error || "rechazado");
    showMsg("err", "✕ " + (err.error || "No se pudo agregar."));
  }
}
async function deleteCourse(id) {
  const res = await fetch("/courses/" + id, { method: "DELETE" });
  logApi("DELETE", "/courses/" + id, res.status, res.status === 204 ? "eliminado" : "no encontrado");
  if (res.ok || res.status === 404) { showMsg("ok", "✓ Curso eliminado (DELETE 204)."); refresh(); }
  else showMsg("err", "✕ No se pudo eliminar.");
}
// Registro de peticiones HTTP en vivo (panel didáctico)
function logApi(method, path, status, note) {
  const log = $("#api-log"); if (!log) return;
  const m = ["GET", "POST", "DELETE"].includes(method) ? method : "OTHER";
  const stClass = status === "ERR" ? "err" : (Number(status) >= 500 ? "err" : Number(status) >= 400 ? "warn" : "ok");
  let t = ""; try { t = new Date().toLocaleTimeString("es-MX", { hour12: false }); } catch { t = ""; }
  const line = document.createElement("div");
  line.className = "logline";
  const lt = document.createElement("span"); lt.className = "lt"; lt.textContent = t;
  const lm = document.createElement("span"); lm.className = "lm " + m; lm.textContent = method;
  const lp = document.createElement("span"); lp.className = "lp"; lp.textContent = path;
  const ls = document.createElement("span"); ls.className = "ls " + stClass; ls.textContent = status;
  line.append(lt, lm, lp, ls);
  if (note) { const ln = document.createElement("span"); ln.className = "ln"; ln.textContent = "↳ " + note; line.append(ln); }
  log.prepend(line);
  while (log.children.length > 16) log.removeChild(log.lastChild);
}
function showMsg(kind, text) {
  const m = $("#course-msg");
  m.className = "msg " + kind; m.textContent = text; m.hidden = false;
  clearTimeout(showMsg._t); showMsg._t = setTimeout(() => (m.hidden = true), 3500);
}
function refresh() { loadStatus(); loadCourses(); }

// ====================== PROGRESO / MISIONES ======================
const MISSIONS = [
  { id: 0, lab: "Lab 0", emoji: "🧰", title: "Validar el ambiente", xp: 30, file: "00-ambiente.md" },
  { id: 1, lab: "Lab 1", emoji: "🐳", title: "Tu primera imagen Docker", xp: 100, file: "01-docker.md" },
  { id: 2, lab: "Lab 2", emoji: "🧩", title: "App multicontenedor (Compose)", xp: 120, file: "02-compose.md" },
  { id: 3, lab: "Lab 3", emoji: "⚙️", title: "Pipeline CI/CD en verde", xp: 130, file: "03-cicd.md" },
  { id: 4, lab: "Lab 4", emoji: "🛡️", title: "Escaneo DevSecOps con Trivy", xp: 90, file: "04-devsecops-trivy.md" },
  { id: 5, lab: "Lab 5", emoji: "☸️", title: "Desplegar en Kubernetes", xp: 140, file: "05-kubernetes-despliegue.md" },
  { id: 6, lab: "Lab 6", emoji: "🔐", title: "ConfigMaps y Secrets", xp: 70, file: "06-config-secrets.md" },
  { id: 7, lab: "Lab 7", emoji: "📈", title: "Escalar + rollback", xp: 110, file: "07-escalar-rollback.md" },
  { id: 8, lab: "Lab 8", emoji: "🎁", title: "Empaquetar con Helm", xp: 100, file: "08-helm.md" },
  { id: 9, lab: "Lab 9", emoji: "🔭", title: "Monitoreo y logs", xp: 90, file: "09-observabilidad.md" },
  { id: 10, lab: "Lab 10", emoji: "🏛️", title: "Proyecto integrador final", xp: 200, file: "10-proyecto-final.md" },
];
const RANKS = [
  { xp: 0, emoji: "🥚", name: "Aprendiz" },
  { xp: 150, emoji: "🐳", name: "Operador de Contenedores" },
  { xp: 350, emoji: "⚙️", name: "Ingeniero de Entrega" },
  { xp: 600, emoji: "☸️", name: "Pilot@ de Kubernetes" },
  { xp: 900, emoji: "🏛️", name: "Arquitect@ DevOps" },
];
const TOTAL_XP = MISSIONS.reduce((a, m) => a + m.xp, 0);
const PKEY = "academia_progress_v1";
let done = new Set();

function loadProgress() { try { done = new Set(JSON.parse(localStorage.getItem(PKEY) || "[]")); } catch { done = new Set(); } }
function saveProgress() { localStorage.setItem(PKEY, JSON.stringify([...done])); }

function renderMissions() {
  const box = $("#missions");
  box.innerHTML = "";
  MISSIONS.forEach((m) => {
    const el = document.createElement("div");
    el.className = "mission" + (done.has(m.id) ? " done" : "");
    el.dataset.id = m.id;
    const chk = document.createElement("input");
    chk.type = "checkbox"; chk.className = "chk"; chk.checked = done.has(m.id);
    chk.setAttribute("aria-label", "Completar " + m.title);
    chk.addEventListener("change", () => toggleMission(m.id, chk.checked));
    const body = document.createElement("div"); body.className = "body";
    body.innerHTML =
      `<div class="m-top"><span class="m-emoji">${m.emoji}</span><span class="m-title"></span></div>` +
      `<div class="m-meta">${m.lab} · <span class="m-xp">+${m.xp} XP</span></div>`;
    body.querySelector(".m-title").textContent = m.title;
    const guide = document.createElement("a");
    guide.className = "m-guide"; guide.href = GUIDE_BASE + m.file; guide.target = "_blank"; guide.rel = "noopener";
    guide.textContent = "📖 Guía paso a paso ↗";
    body.append(guide);
    el.append(chk, body);
    box.append(el);
  });
  updateProgress();
}
function toggleMission(id, checked) {
  const was = done.has(id);
  if (checked) done.add(id); else done.delete(id);
  saveProgress();
  $(`.mission[data-id="${id}"]`)?.classList.toggle("done", checked);
  updateProgress();
  if (checked && !was) {
    const m = MISSIONS.find((x) => x.id === id);
    burstConfetti();
    toast(`${m.emoji} ¡Misión completada! +${m.xp} XP`);
  }
}
function currentRank(xp) { let r = RANKS[0]; for (const x of RANKS) if (xp >= x.xp) r = x; return r; }
function nextRank(xp) { return RANKS.find((x) => x.xp > xp) || null; }
function updateProgress() {
  const xp = MISSIONS.filter((m) => done.has(m.id)).reduce((a, m) => a + m.xp, 0);
  const pct = Math.round((xp / TOTAL_XP) * 100);
  $("#xp-now").textContent = xp;
  $("#xp-total").textContent = TOTAL_XP;
  $("#xp-pct").textContent = pct + "%";
  $("#xpfill").style.width = pct + "%";
  const r = currentRank(xp), nx = nextRank(xp);
  $("#rank-emoji").textContent = r.emoji;
  $("#rank-name").textContent = r.name;
  $("#rank-next").textContent = nx ? `Siguiente: ${nx.emoji} ${nx.name} (${nx.xp - xp} XP)` : "¡Rango máximo alcanzado! 🎉";
}
function resetProgress() {
  if (!confirm("¿Reiniciar tu progreso? Se borrarán las misiones marcadas en este navegador.")) return;
  done = new Set(); saveProgress(); renderMissions();
}

// ====================== CONFETTI + TOAST ======================
function burstConfetti() {
  const c = $("#confetti");
  const colors = ["#22d3ee", "#34d399", "#fbbf24", "#fb7185", "#a78bfa"];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("i");
    const dur = 2.4 + Math.random() * 1.8;
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = dur + "s";
    p.style.animationDelay = Math.random() * 0.4 + "s";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    c.append(p);
    setTimeout(() => p.remove(), (dur + 0.6) * 1000);
  }
}
function toast(text) {
  const t = $("#toast");
  t.textContent = text; t.hidden = false;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toast._t); toast._t = setTimeout(() => { t.classList.remove("show"); setTimeout(() => (t.hidden = true), 300); }, 2600);
}

// ====================== COMANDOS (copiar) ======================
function wireCommands() {
  $$(".cmd").forEach((row) => {
    row.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(row.dataset.cmd);
        row.classList.add("copied");
        row.querySelector(".copy").textContent = "¡copiado!";
        setTimeout(() => { row.classList.remove("copied"); row.querySelector(".copy").textContent = "copiar"; }, 1600);
      } catch { toast("No se pudo copiar (permiso del navegador)"); }
    });
  });
}

// ====================== INFOGRAFÍAS + LIGHTBOX ======================
const INFOS = {
  es: ["El ciclo de vida DevOps", "Imagen vs Contenedor vs VM", "Docker: comandos esenciales", "Anatomía de un Dockerfile",
    "Docker Compose de un vistazo", "Pipeline CI/CD", "Arquitectura de Kubernetes", "kubectl: comandos esenciales",
    "Config, Secretos y Operación", "Helm de un vistazo", "DevSecOps: shift-left", "Observabilidad", "Mapa de misiones del curso", "Glosario rápido"],
  en: ["The DevOps lifecycle", "Image vs Container vs VM", "Docker: essential commands", "Anatomy of a Dockerfile",
    "Docker Compose at a glance", "CI/CD pipeline", "Kubernetes architecture", "kubectl: essential commands",
    "Config, Secrets & Operations", "Helm at a glance", "DevSecOps: shift-left", "Observability", "Course mission map", "Quick glossary"],
};
let lang = "es", order = [];
function renderGallery() {
  const g = $("#gallery"); g.innerHTML = ""; order = [];
  INFOS[lang].forEach((title, i) => {
    const n = String(i + 1).padStart(2, "0");
    const src = `infografias/${lang}/${n}.png`;
    order.push({ src, title, n: i + 1 });
    const t = document.createElement("div"); t.className = "thumb";
    const img = document.createElement("img"); img.src = src; img.alt = title; img.loading = "lazy";
    const cap = document.createElement("div"); cap.className = "cap"; cap.innerHTML = `<span class="n">${n}</span>`;
    const span = document.createElement("span"); span.textContent = title; cap.append(span);
    t.append(img, cap); t.onclick = () => openLightbox(i); g.append(t);
  });
  $("#dl-pptx").href = lang === "es" ? "downloads/Infografias_Alumnos_ES.pptx" : "downloads/Student_Infographics_EN.pptx";
}
let lbIndex = 0;
function openLightbox(i) {
  lbIndex = i; const item = order[i];
  $("#lb-img").src = item.src; $("#lb-cap").textContent = `${item.n}/14 · ${item.title}`;
  $("#lb-dl").href = item.src; $("#lb-dl").setAttribute("download", `infografia-${lang}-${String(item.n).padStart(2, "0")}.png`);
  $("#lightbox").hidden = false;
}
function moveLb(d) { openLightbox((lbIndex + d + order.length) % order.length); }
function closeLb() { $("#lightbox").hidden = true; }

// ====================== DETECTIVE DE BUGS ======================
const BUGS = [
  {
    area: "Docker", cls: "",
    code: `FROM node:22-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY src ./app\nEXPOSE 8080\nCMD ["node", "src/server.js"]`,
    options: [
      { t: "Falta la instrucción FROM", ok: false },
      { t: "COPY src ./app copia a la carpeta equivocada (debería ser ./src)", ok: true },
      { t: "npm ci está mal escrito", ok: false },
      { t: "Falta EXPOSE 8080", ok: false },
    ],
    why: "El código se copió a <strong>/app/app</strong>, pero el CMD arranca <code>src/server.js</code>. Al correr: <em>Cannot find module '/app/src/server.js'</em>. Debe ser <code>COPY src ./src</code>.",
    reto: "reto-1-docker",
  },
  {
    area: "Compose", cls: "compose",
    code: `services:\n  app:\n    build: .\n    environment:\n      DB_HOST: database\n    depends_on: [db]\n  db:\n    image: postgres:16-alpine`,
    options: [
      { t: "Falta mapear los puertos del servicio db", ok: false },
      { t: "DB_HOST: database no coincide con el nombre del servicio (db)", ok: true },
      { t: "La imagen postgres:16-alpine no existe", ok: false },
      { t: "depends_on está mal escrito", ok: false },
    ],
    why: "En Compose la app encuentra a la base de datos por el <strong>nombre del servicio</strong>. El servicio se llama <code>db</code>, no <code>database</code> → la app no resuelve el host y <code>/health</code> reporta <code>\"db\":\"down\"</code>.",
    reto: "reto-2-compose",
  },
  {
    area: "Kubernetes", cls: "k8s",
    code: `# Service\nspec:\n  selector:\n    app: academia\n---\n# Deployment (labels del Pod)\ntemplate:\n  metadata:\n    labels:\n      app: academia-app`,
    options: [
      { t: "Falta declarar el namespace", ok: false },
      { t: "El selector del Service (app: academia) no coincide con las labels del Pod (app: academia-app)", ok: true },
      { t: "Falta el campo replicas", ok: false },
      { t: "El puerto está mal configurado", ok: false },
    ],
    why: "El Service enruta por <strong>labels</strong>. Si el <code>selector</code> no coincide con las labels del Pod, sus <em>endpoints</em> quedan vacíos y no llega tráfico a ningún Pod. Deben ser idénticos (<code>app: academia-app</code>).",
    reto: "reto-3-kubernetes",
  },
];
const RETO_BASE = REPO + "/tree/main/retos/";
const BKEY = "academia_bugs_v1";
let bugsSolved = new Set();
function loadBugs() { try { bugsSolved = new Set(JSON.parse(localStorage.getItem(BKEY) || "[]")); } catch { bugsSolved = new Set(); } }
function saveBugs() { localStorage.setItem(BKEY, JSON.stringify([...bugsSolved])); }
function renderBugs() {
  const box = $("#bugs"); if (!box) return;
  box.innerHTML = "";
  BUGS.forEach((b, i) => {
    const solved = bugsSolved.has(i);
    const card = document.createElement("div");
    card.className = "bug-card" + (solved ? " solved" : "");
    const head = document.createElement("div"); head.className = "bug-head";
    const tag = document.createElement("span"); tag.className = "bug-tag " + b.cls; tag.textContent = b.area;
    const q = document.createElement("span"); q.className = "bug-q"; q.textContent = "¿Cuál es el bug?";
    head.append(tag, q);
    const pre = document.createElement("pre"); pre.className = "bug-code"; pre.textContent = b.code;
    const opts = document.createElement("div"); opts.className = "bug-options";
    const fb = document.createElement("div"); fb.className = "bug-feedback"; fb.hidden = true;
    b.options.forEach((o) => {
      const btn = document.createElement("button"); btn.className = "bug-opt"; btn.type = "button"; btn.textContent = o.t;
      btn.addEventListener("click", () => answerBug(i, o, btn, opts, fb));
      opts.append(btn);
    });
    card.append(head, pre, opts, fb);
    if (solved) revealBug(i, opts, fb);
    box.append(card);
  });
  updateBugScore();
}
function answerBug(i, opt, btn, opts, fb) {
  if (opts.dataset.answered) return;
  opts.dataset.answered = "1";
  [...opts.children].forEach((b) => (b.disabled = true));
  if (opt.ok) {
    btn.classList.add("correct");
    btn.closest(".bug-card")?.classList.add("solved");
    if (!bugsSolved.has(i)) { bugsSolved.add(i); saveBugs(); burstConfetti(); toast("🕵️ ¡Bug encontrado! Vas " + bugsSolved.size + "/" + BUGS.length); }
  } else {
    btn.classList.add("wrong");
    const correctIdx = BUGS[i].options.findIndex((o) => o.ok);
    opts.children[correctIdx]?.classList.add("correct");
  }
  showBugFeedback(i, fb);
  updateBugScore();
}
function revealBug(i, opts, fb) {
  opts.dataset.answered = "1";
  const correctIdx = BUGS[i].options.findIndex((o) => o.ok);
  [...opts.children].forEach((b, k) => { b.disabled = true; if (k === correctIdx) b.classList.add("correct"); });
  showBugFeedback(i, fb);
}
function showBugFeedback(i, fb) {
  const b = BUGS[i];
  fb.innerHTML = `<strong>¿Por qué?</strong> ${b.why}<br>👉 <a href="${RETO_BASE + b.reto}" target="_blank" rel="noopener">Arréglalo de verdad en el reto ↗</a>`;
  fb.hidden = false;
}
function updateBugScore() { const el = $("#bug-score"); if (el) el.textContent = `${bugsSolved.size}/${BUGS.length}`; }

// ====================== TOUR GUIADO ======================
const TOUR = [
  { sel: ".hero-pills", title: "Bienvenido al Centro de Mando", body: "Aquí ves el curso correr de verdad: estado en vivo, tu progreso, el API REST y las infografías. Te lo presento en 60 segundos." },
  { sel: "#estado .cards", title: "Estado del sistema", body: "Lo que la app reporta en tiempo real. /health es justo lo que Kubernetes usa (probes) para decidir si reiniciar un Pod o enviarle tráfico." },
  { sel: "#progreso .rankbar", title: "Tu progreso", body: "Marca cada misión, gana XP y sube de rango. Cada misión enlaza a su guía paso a paso, y tu avance se guarda en este navegador." },
  { sel: "#cursos .api-console", title: "La consola de peticiones", body: "Cada vez que creas o borras un curso se dispara una petición HTTP real. Aquí la ves: así conversa un frontend con un API REST." },
  { sel: "#detective .bugs", title: "Detective de bugs", body: "Pon a prueba tu ojo con tres errores reales de Docker, Compose y Kubernetes. Luego arréglalos de verdad en los retos del repo." },
  { sel: "#infografias .dl-bar", title: "Infografías", body: "14 láminas de referencia (ES/EN) listas para compartir con tus alumnos o descargar en un ZIP." },
  { sel: "#comandos .cmd-list", title: "Comandos rápidos", body: "Los esenciales para arrancar. Toca cualquiera para copiarlo. ¡Y con esto, listo para tu primera clase! 🚀" },
];
let tourI = 0;
const tourActive = () => !$("#tour-spot").hidden;
function startTour() { tourI = 0; $("#tour-spot").hidden = false; $("#tour-tip").hidden = false; showTourStep(); }
function endTour() { $("#tour-spot").hidden = true; $("#tour-tip").hidden = true; }
function showTourStep() {
  const step = TOUR[tourI];
  const el = document.querySelector(step.sel);
  if (!el) { return nextTour(); }
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  $("#tour-step").textContent = `Paso ${tourI + 1} de ${TOUR.length}`;
  $("#tour-title").textContent = step.title;
  $("#tour-body").textContent = step.body;
  $("#tour-prev").style.visibility = tourI === 0 ? "hidden" : "visible";
  $("#tour-next").textContent = tourI === TOUR.length - 1 ? "Terminar ✓" : "Siguiente ›";
  setTimeout(positionTour, 360);
}
function positionTour() {
  if (!tourActive()) return;
  const el = document.querySelector(TOUR[tourI].sel); if (!el) return;
  const r = el.getBoundingClientRect(), pad = 8, spot = $("#tour-spot"), tip = $("#tour-tip");
  spot.style.top = (r.top - pad) + "px"; spot.style.left = (r.left - pad) + "px";
  spot.style.width = (r.width + pad * 2) + "px"; spot.style.height = (r.height + pad * 2) + "px";
  const tipW = tip.offsetWidth || 380, tipH = tip.offsetHeight || 190;
  let top = r.bottom + 14; if (top + tipH > window.innerHeight - 10) top = Math.max(10, r.top - tipH - 14);
  let left = r.left; if (left + tipW > window.innerWidth - 10) left = window.innerWidth - tipW - 10; if (left < 10) left = 10;
  tip.style.top = top + "px"; tip.style.left = left + "px";
}
function nextTour() { if (tourI < TOUR.length - 1) { tourI++; showTourStep(); } else endTour(); }
function prevTour() { if (tourI > 0) { tourI--; showTourStep(); } }

// ====================== INIT ======================
document.addEventListener("DOMContentLoaded", () => {
  loadProgress(); renderMissions();
  loadBugs(); renderBugs();
  $("#btn-reset").addEventListener("click", resetProgress);
  $("#course-form").addEventListener("submit", addCourse);
  $("#btn-refresh").addEventListener("click", refresh);
  $("#btn-log-clear").addEventListener("click", () => { $("#api-log").innerHTML = ""; });
  // Tour guiado
  $("#btn-tour").addEventListener("click", startTour);
  $("#tour-next").addEventListener("click", nextTour);
  $("#tour-prev").addEventListener("click", prevTour);
  $("#tour-skip").addEventListener("click", endTour);
  window.addEventListener("resize", positionTour);
  window.addEventListener("scroll", () => { if (tourActive()) positionTour(); }, { passive: true });
  document.addEventListener("keydown", (e) => { if (tourActive() && e.key === "Escape") endTour(); });
  $$(".seg-btn").forEach((b) => b.addEventListener("click", () => {
    $(".seg-btn.active").classList.remove("active"); b.classList.add("active"); lang = b.dataset.lang; renderGallery();
  }));
  $("#lb-close").addEventListener("click", closeLb);
  $("#lb-prev").addEventListener("click", () => moveLb(-1));
  $("#lb-next").addEventListener("click", () => moveLb(1));
  $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLb(); });
  document.addEventListener("keydown", (e) => {
    if ($("#lightbox").hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") moveLb(-1);
    if (e.key === "ArrowRight") moveLb(1);
  });
  wireCommands();
  renderGallery();
  refresh();
  setInterval(loadStatus, 15000);
});
