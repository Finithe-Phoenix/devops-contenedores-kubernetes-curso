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
    const courses = await fetch("/courses").then((r) => r.json());
    const health = await fetch("/health").then((r) => r.json()).catch(() => ({}));
    $("#courses-store").textContent = health.store === "postgres" ? "PostgreSQL" : "en memoria";
    grid.innerHTML = "";
    if (!courses.length) { grid.innerHTML = `<p class="lead">Sin cursos. Agrega el primero arriba ☝️</p>`; return; }
    courses.forEach((c) => grid.append(courseCard(c)));
  } catch { grid.innerHTML = `<p class="msg err">No se pudieron cargar los cursos.</p>`; }
}
function courseCard(c) {
  const el = document.createElement("div");
  el.className = "course";
  const code = document.createElement("div"); code.className = "code"; code.textContent = c.code;
  const name = document.createElement("div"); name.className = "cname"; name.textContent = c.name;
  const prof = document.createElement("div"); prof.className = "prof"; prof.textContent = c.professor ? "👤 " + c.professor : "—";
  const del = document.createElement("button"); del.className = "del"; del.textContent = "✕"; del.title = "Eliminar";
  del.onclick = () => deleteCourse(c.id);
  el.append(code, name, prof, del);
  return el;
}
async function addCourse(e) {
  e.preventDefault();
  const f = e.target;
  const body = { code: f.code.value.trim(), name: f.name.value.trim(), professor: f.professor.value.trim() || null };
  const res = await fetch("/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (res.ok) { showMsg("ok", `✓ Curso "${body.code}" agregado.`); f.reset(); refresh(); }
  else { const err = await res.json().catch(() => ({})); showMsg("err", "✕ " + (err.error || "No se pudo agregar.")); }
}
async function deleteCourse(id) {
  const res = await fetch("/courses/" + id, { method: "DELETE" });
  if (res.ok || res.status === 404) { showMsg("ok", "✓ Curso eliminado."); refresh(); }
  else showMsg("err", "✕ No se pudo eliminar.");
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

// ====================== INIT ======================
document.addEventListener("DOMContentLoaded", () => {
  loadProgress(); renderMissions();
  $("#btn-reset").addEventListener("click", resetProgress);
  $("#course-form").addEventListener("submit", addCourse);
  $("#btn-refresh").addEventListener("click", refresh);
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
