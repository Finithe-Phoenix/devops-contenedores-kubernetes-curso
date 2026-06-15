// Frontend de la Academia DevOps App — vanilla JS, sin dependencias.
const $ = (s) => document.querySelector(s);

// ---------- ESTADO DEL SISTEMA ----------
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
      statusCard("/health", up ? "cyan" : "amber", [
        ["estado", health.status],
        ["almacén", health.store],
        ["db", health.db],
        ["uptime", health.uptime_s + "s"],
      ]),
      statusCard("/version", "green", [
        ["versión", version.version],
        ["app", version.name],
        ["node", version.node],
      ]),
      bigCard("/courses", "amber", courses.length, "cursos registrados"),
    );
  } catch (e) {
    setHero(false, "");
    cards.innerHTML = `<div class="card amber"><h3>sin conexión</h3><p>La app no responde. ¿Está corriendo el contenedor?</p></div>`;
  }
}

function statusCard(title, color, rows) {
  const el = document.createElement("div");
  el.className = "card " + color;
  el.innerHTML = `<h3>${title}</h3>` + rows.map(([k, v]) =>
    `<div class="kv"><span>${k}</span><b></b></div>`).join("");
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
  const pill = $("#hero-status");
  pill.innerHTML = `<span class="dot ${up ? "up" : "down"}"></span> ${up ? "sistema arriba" : "sin conexión"}${store ? " · " + store : ""}`;
}

// ---------- CURSOS (CRUD) ----------
async function loadCourses() {
  const grid = $("#course-grid");
  try {
    const courses = await fetch("/courses").then((r) => r.json());
    const health = await fetch("/health").then((r) => r.json()).catch(() => ({}));
    $("#courses-store").textContent = health.store === "postgres" ? "PostgreSQL" : "en memoria";
    grid.innerHTML = "";
    if (!courses.length) { grid.innerHTML = `<p class="lead">Sin cursos. Agrega el primero arriba ☝️</p>`; return; }
    courses.forEach((c) => grid.append(courseCard(c)));
  } catch {
    grid.innerHTML = `<p class="msg err">No se pudieron cargar los cursos.</p>`;
  }
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

// ---------- INFOGRAFÍAS ----------
const INFOS = {
  es: ["El ciclo de vida DevOps", "Imagen vs Contenedor vs VM", "Docker: comandos esenciales",
    "Anatomía de un Dockerfile", "Docker Compose de un vistazo", "Pipeline CI/CD",
    "Arquitectura de Kubernetes", "kubectl: comandos esenciales", "Config, Secretos y Operación",
    "Helm de un vistazo", "DevSecOps: shift-left", "Observabilidad", "Mapa de misiones del curso", "Glosario rápido"],
  en: ["The DevOps lifecycle", "Image vs Container vs VM", "Docker: essential commands",
    "Anatomy of a Dockerfile", "Docker Compose at a glance", "CI/CD pipeline",
    "Kubernetes architecture", "kubectl: essential commands", "Config, Secrets & Operations",
    "Helm at a glance", "DevSecOps: shift-left", "Observability", "Course mission map", "Quick glossary"],
};
let lang = "es";
let order = [];

function renderGallery() {
  const g = $("#gallery");
  g.innerHTML = "";
  order = [];
  INFOS[lang].forEach((title, i) => {
    const n = String(i + 1).padStart(2, "0");
    const src = `infografias/${lang}/${n}.png`;
    order.push({ src, title, n: i + 1 });
    const t = document.createElement("div");
    t.className = "thumb";
    const img = document.createElement("img"); img.src = src; img.alt = title; img.loading = "lazy";
    const cap = document.createElement("div"); cap.className = "cap";
    cap.innerHTML = `<span class="n">${n}</span>`;
    const span = document.createElement("span"); span.textContent = title; cap.append(span);
    t.append(img, cap);
    t.onclick = () => openLightbox(i);
    g.append(t);
  });
  $("#dl-pptx").href = lang === "es" ? "downloads/Infografias_Alumnos_ES.pptx" : "downloads/Student_Infographics_EN.pptx";
}

// ---------- LIGHTBOX ----------
let lbIndex = 0;
function openLightbox(i) {
  lbIndex = i;
  const item = order[i];
  $("#lb-img").src = item.src;
  $("#lb-cap").textContent = `${item.n}/14 · ${item.title}`;
  $("#lb-dl").href = item.src;
  $("#lb-dl").setAttribute("download", `infografia-${lang}-${String(item.n).padStart(2, "0")}.png`);
  $("#lightbox").hidden = false;
}
function moveLb(d) { openLightbox((lbIndex + d + order.length) % order.length); }
function closeLb() { $("#lightbox").hidden = true; }

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  $("#course-form").addEventListener("submit", addCourse);
  $("#btn-refresh").addEventListener("click", refresh);
  document.querySelectorAll(".seg-btn").forEach((b) =>
    b.addEventListener("click", () => {
      document.querySelector(".seg-btn.active").classList.remove("active");
      b.classList.add("active"); lang = b.dataset.lang; renderGallery();
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
  renderGallery();
  refresh();
  setInterval(loadStatus, 15000); // refresca el estado cada 15s
});
