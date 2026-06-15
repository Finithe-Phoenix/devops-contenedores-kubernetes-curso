> 🌐 [English](03-cicd.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 3: pipeline CI/CD en verde

**Misión:** dejar el pipeline de GitHub Actions en **verde** · **XP:** +130 · **Medalla:** ⚙️ Automatizador · **Tiempo:** ~30 min · **Dificultad:** ★★☆

## 🎒 Antes de empezar

- Una **cuenta de GitHub** y `git` instalado (`git --version` debe responder).
- El repositorio del curso en GitHub. El de referencia es: **https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso** (mira la pestaña **Actions**).
- Haber completado el **Lab 2**: ya entiendes que la imagen se construye y la app se prueba.
- No necesitas instalar nada más: el pipeline corre en **máquinas de GitHub** (runners), no en tu PC.

> 💡 Idea clave: cada vez que haces `git push`, una **máquina limpia** repite exactamente los mismos pasos (instalar → probar → construir → escanear). Si algo falla, el commit se marca en **rojo**. Eso es **Integración Continua (CI)**.

## 🧭 Qué vas a lograr

- Entender el `.github/workflows/ci.yml` paso a paso.
- Hacer un `push` y ver el pipeline ponerse **verde en ~30 segundos**.
- Provocar a propósito un **rojo** rompiendo un test, y luego **arreglarlo** para volver al verde.
- Salir sabiendo leer el panel de **Actions** como un profesional.

## 👣 Pasos

### Paso 1 — Conocer el archivo que lo gobierna todo

```bash
cat .github/workflows/ci.yml
```

**Lo que verás:**

```yaml
name: CI Pipeline
on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]
jobs:
  build-test-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4   # Node 22
      - run: npm ci
      - run: npm test
      - run: docker build -t academia-devops-app:${{ github.sha }} .
      - run: trivy image ... --exit-code 0   # escaneo de seguridad (no rompe el build)
```

**¿Qué pasó?** Leíste la "línea de producción" de tu código. Se dispara en cada `push` y cada `pull_request` a `main`, corre en `ubuntu-latest` y encadena 5 pasos: **checkout → npm ci → npm test → docker build → trivy**.

### Paso 2 — Asegurar que tus cambios están confirmados

```bash
git status
```

**Lo que verás:**

```
On branch main
nothing to commit, working tree clean
```

**¿Qué pasó?** Confirmamos que no hay cambios sin guardar. Un árbol limpio significa que lo que está en GitHub es exactamente lo que probará el pipeline.

### Paso 3 — Disparar el pipeline con un push

```bash
git commit --allow-empty -m "ci: disparar pipeline"
git push origin main
```

**Lo que verás:**

```
To github.com:Finithe-Phoenix/devops-contenedores-kubernetes-curso.git
   a1b2c3d..e4f5g6h  main -> main
```

**¿Qué pasó?** Subimos un commit (vacío, solo para disparar). En cuanto GitHub lo recibe, lanza el workflow `CI Pipeline` automáticamente. Ya no hay vuelta atrás: la máquina limpia empezó a trabajar.

### Paso 4 — Ver el pipeline ponerse verde

Abre en tu navegador la pestaña **Actions** del repo:
**https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso/actions**

**Lo que verás:**

```
✔ CI Pipeline · Build · Test · Scan        success   ~30s
   ✔ Checkout del codigo
   ✔ Configurar Node.js 22
   ✔ Instalar dependencias (npm ci)
   ✔ Ejecutar pruebas        ✓ tests 8/8 passing
   ✔ Construir imagen Docker
   ✔ Escanear imagen con Trivy
```

**¿Qué pasó?** 🎉 El pipeline quedó **verde en ~30s**. Los 8 tests pasaron (`8/8`), la imagen se construyó y Trivy escaneó la imagen reportando sin romper el build (`--exit-code 0`). Eso es CI funcionando.

### Paso 5 — Romper un test a propósito (provocar el ROJO)

Abre `01-app/node/test/app.test.js` y cambia un `assert` para que falle. Por ejemplo, en el test de `/health`:

```js
// Cambia el código de estado esperado a uno incorrecto a propósito:
assert.equal(res.status, 500); // 👈 debería ser 200 — esto romperá el test
```

Luego confirma y sube:

```bash
git commit -am "test: romper un assert a proposito"
git push origin main
```

**Lo que verás (en Actions):**

```
✘ CI Pipeline · Build · Test · Scan        failure   ~20s
   ✔ Instalar dependencias (npm ci)
   ✘ Ejecutar pruebas        ✗ tests 7/8  (1 failed)
   ⊘ Construir imagen Docker   (omitido: un paso anterior falló)
```

**¿Qué pasó?** El paso `npm test` falló, así que el job se detuvo **rojo** y **no** construyó la imagen. Esa es la magia de CI: un código roto **nunca avanza**. El semáforo rojo protege a tu rama `main`.

### Paso 6 — Arreglarlo (volver al VERDE)

Revierte el `assert` a su valor correcto:

```js
assert.equal(res.status, 200); // 👈 restaurado: ahora el test vuelve a pasar
```

Confirma y sube de nuevo:

```bash
git commit -am "fix: restaurar el assert correcto"
git push origin main
```

**Lo que verás (en Actions):**

```
✔ CI Pipeline · Build · Test · Scan        success   ~30s
   ✔ Ejecutar pruebas        ✓ tests 8/8 passing
```

**¿Qué pasó?** Con el `assert` correcto, los 8 tests vuelven a pasar y el pipeline regresa a **verde**. Acabas de vivir el ciclo completo de CI: rojo → diagnóstico → arreglo → verde. Eso es exactamente lo que harás a diario en un equipo real.

## ✅ Checkpoint

Has completado el lab si:

- [ ] Viste tu workflow **verde en ~30s** en la pestaña Actions.
- [ ] El paso de pruebas reportó **8/8** tests en verde.
- [ ] Rompiste un test y viste el pipeline ponerse **rojo** (y la imagen NO se construyó).
- [ ] Arreglaste el `assert` y el pipeline volvió a **verde**.

## 🧯 Si algo falla

| Síntoma | Causa | Solución |
| ------- | ----- | -------- |
| `npm ci` falla | Falta `package-lock.json` en el commit | Asegúrate de versionarlo (`git add package-lock.json`) |
| El job no arranca | Rama equivocada en `on:` | Debe coincidir con tu rama; el workflow escucha `main` |
| Tests pasan local pero fallan en CI | Dependencia del entorno local | El runner es **limpio**: todo debe estar declarado en el repo |
| No veo ninguna ejecución en Actions | Hiciste push a otra rama | El trigger es `push`/`pull_request` a `main` |
| Trivy "rompe" el build | `exit-code: 1` | En clase usamos `0` (reporta sin bloquear); en prod, `1` para bloquear |
| `docker build` falla en CI | Error en el `Dockerfile` o `.dockerignore` | Reproduce local: `cd 01-app/node && docker build -t prueba .` |

## 🏆 Reto extra (+30 XP)

Convierte el escaneo de seguridad en un **guardián real**:

1. En `.github/workflows/ci.yml`, cambia `--exit-code 0` por `--exit-code 1` en el paso de Trivy.
2. Haz push y observa qué pasa en Actions.
3. Si Trivy encuentra una vulnerabilidad CRITICAL/HIGH **sin parche disponible**, el build ahora se pondrá **rojo**.
4. Decide en clase: ¿bloquearías el merge por vulnerabilidades, o solo las reportarías? Justifícalo. (En `main` real, lo común es **bloquear**.)

> Bonus: explora la **Ruta empresarial** en `04-cicd/jenkins/Jenkinsfile`. Tiene exactamente las mismas etapas (Checkout → Install → Test → Docker Build → Security Scan), pero en sintaxis Jenkins. Compara ambos y verás que CI/CD es un **concepto**, no una herramienta.

## 🎓 Cómo enseñarlo a tus alumnos

- **El semáforo lo explica todo:** verde = avanza, rojo = se detiene. Antes de mostrar YAML, dibuja la línea de producción `commit → install → test → build → scan`. El concepto entra primero; la sintaxis después.
- **Provoca el rojo en vivo:** rompe un `assert` frente a la clase y haz push. Ver el pipeline caer en rojo en tiempo real es mil veces más memorable que explicarlo.
- **"La máquina limpia":** insiste en que el runner es efímero y sin tu config local. Por eso "en mi máquina funciona" no sirve: si no está en el repo, no existe para CI.
- **CI vs CD:** aclara que hoy solo hacemos **CI** (construir + probar cada cambio). El **CD** (desplegar la imagen probada) lo conectarán en el día de Kubernetes. No los mezcles temprano.
- **Pregunta docente:** "¿qué validaciones DEBERÍA pasar el código de tus alumnos antes de aceptarse?" (tests, lint, escaneo, formato...). Que ellos diseñen su propio pipeline ideal.

## ⏭️ Siguiente

Tu pipeline ya prueba y construye en cada cambio. El siguiente paso es endurecer la seguridad antes de desplegar:
➡️ **[Guía Lab 4 — DevSecOps con Trivy](04-devsecops-trivy.md)** 🛡️.
