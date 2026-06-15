> 🌐 [English](README.en.md) · **Español**

# 📝 Tarea — De código a contenedor (a tu ritmo)

> **No te preocupes si algo falló en clase.** Esta tarea está diseñada para que **todos** puedan
> completarla: hay una ruta que **no necesita instalar nada** y otra práctica con su Plan B.
> El objetivo no es que todo salga perfecto, sino que **vivas y entiendas el ciclo**.

- **Modalidad:** individual o en equipos (máx. 3).
- **Tiempo estimado:** 60–90 min.
- **Entrega:** _____ / _____ / _______ · **Cómo entregar:** un PDF o documento con tus capturas y respuestas.
- **Recompensa:** 🐳 medalla *Capitán de Contenedores* + 🛡️ *Guardián Shift-Left* (≈ **190 XP**).

---

## 🌐 Parte 1 — Explora (sin instalar nada · obligatoria para todos)

Abre el **Centro de Mando** del curso en tu navegador (celular o laptop):
👉 **https://finithe-phoenix.github.io/devops-contenedores-kubernetes-curso/**

1. Haz el **Tour guiado** (botón ▶ arriba).
2. Completa los **3 retos del 🕵️ Detective de bugs** (Docker, Compose, Kubernetes).
3. En **Tu progreso**, marca al menos 3 misiones que ya entiendas.

**📸 Entregable 1:** una captura del **Detective de bugs en 3/3** y otra de **Tu progreso**.

---

## 🐳 Parte 2 — Practica (elige UNA opción)

### Opción A — Con Docker (si te funcionó)
Sigue la [guía del Lab 1](../guias/01-docker.md) y construye + corre la app:

```bash
git clone https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso.git
cd devops-contenedores-kubernetes-curso/01-app/node
docker build -t academia-devops-app:1.0.0 .
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0
curl http://localhost:8080/health
```

**📸 Entregable 2A:** capturas de `docker images`, `docker ps` y la respuesta de `/health`
(`{"status":"UP",...}`).

### Opción B — Sin Docker (Plan B, si NO te instaló)
Abre el reto roto [`retos/reto-1-docker/Dockerfile`](../retos/reto-1-docker/) y, **leyéndolo**, responde:

1. ¿Cuál es el **bug** del Dockerfile? (hay uno solo)
2. ¿Por qué el contenedor moriría al arrancar? (pista: `Cannot find module`)
3. Escribe la **línea corregida**.

**✍️ Entregable 2B:** tus respuestas a las 3 preguntas (3–5 renglones).

---

## 🎓 Parte 3 — Aplicación docente (obligatoria · lo más importante)

Eres profesor/a. En **media cuartilla** responde:

1. ¿En **qué materia tuya** podría entrar este laboratorio? (Programación, BD, Redes, Seguridad…)
2. ¿Qué le pedirías a **tus alumnos** como evidencia?
3. ¿Qué **error común** anticipas y cómo lo rescatarías?

**✍️ Entregable 3:** tu propuesta de cómo lo llevarías a tu clase.

---

## ✅ Rúbrica (10 puntos)

| Criterio | Excelente | Suficiente | Falta |
| -------- | --------- | ---------- | ----- |
| **Parte 1 — Explora** (3) | Detective 3/3 + progreso, con capturas | Lo hizo parcialmente | Sin evidencia |
| **Parte 2 — Practica** (4) | Opción A funcionando, o B bien razonada | Avanzó con apoyo | No intentó |
| **Parte 3 — Docente** (3) | Propuesta clara y aterrizada a su materia | Idea general | No la conecta a clase |

> 💡 **Lo único imprescindible** son la Parte 1 y la Parte 3 — esas **no necesitan Docker**.
> La Parte 2 es donde demuestras lo técnico, y aceptamos la ruta B si tu equipo no instaló.

---

### 🆘 ¿Atorado?
- Instala todo de un comando (Windows): ver [`00-prework/instalacion.md`](../00-prework/instalacion.md).
- Guías paso a paso de cada lab: [`guias/`](../guias/README.md).
- Material completo del curso: [el repositorio](https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso).

*Hazlo a tu ritmo. El error es parte del aprendizaje — de eso se trata DevOps.* 🚀
