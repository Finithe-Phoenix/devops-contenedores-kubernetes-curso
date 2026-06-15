> 🌐 [English](pipeline-explicado.en.md) · **Español**

# ⚙️ Lab 3 — CI/CD: el pipeline explicado

> **Misión:** dejar el pipeline en **verde**. **Recompensa:** +130 XP y la medalla ⚙️ *Automatizador*.

## La idea: una línea de producción para tu código

```
   commit  ─►  CHECKOUT ─► INSTALL ─► TEST ─► BUILD IMAGEN ─► SCAN ─►  (deploy)
                  │           │         │          │           │
              traer código  deps    pruebas    Docker      seguridad
```

Cada vez que alguien sube código, una máquina limpia repite **exactamente** los mismos
pasos. Si algo falla, el commit se marca en **rojo** y no avanza. Eso es **Integración Continua**.

## Anatomía (vocabulario)

| Término | Qué es | En nuestro `ci.yml` |
| ------- | ------ | ------------------- |
| **Workflow** | El pipeline completo | `name: CI Pipeline` |
| **Trigger** (`on`) | El evento que lo dispara | `push` y `pull_request` a `main` |
| **Job** | Conjunto de pasos en una máquina | `build-test-scan` |
| **Runner** | La máquina efímera que ejecuta | `ubuntu-latest` |
| **Step** | Una acción individual | checkout, test, build... |
| **Action** (`uses`) | Paso reutilizable de la comunidad | `actions/checkout@v4` |

## ¿Dónde está el archivo?

- **El que se ejecuta:** [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) (GitHub exige esa ruta).
- **La copia comentada para clase:** [`github-actions/ci.yml`](github-actions/ci.yml).
- **Ruta empresarial:** [`jenkins/Jenkinsfile`](jenkins/Jenkinsfile).

## CI vs CD

- **CI (Continuous Integration):** construir + probar **cada cambio** automáticamente. ← lo hacemos hoy.
- **CD (Continuous Delivery/Deployment):** llevar la imagen ya probada a un ambiente
  (publicar al registry y desplegar). ← lo conectamos en el día de Kubernetes.

## Reto de la misión (provoca un rojo y arréglalo)

1. Rompe un test a propósito (cambia un `assert`) y haz push → mira el pipeline en **rojo**.
2. Arréglalo y vuelve a hacer push → **verde**.
3. **Pregunta docente:** ¿qué validaciones DEBERÍA pasar el código de tus alumnos antes de aceptarse?

## ❗ Errores comunes

| Síntoma | Causa | Solución |
| ------- | ----- | -------- |
| `npm ci` falla | Falta `package-lock.json` en el commit | Asegúrate de versionarlo |
| El job no arranca | Rama equivocada en `on:` | Debe coincidir con tu rama (`main`) |
| Tests pasan local pero fallan en CI | Dependencia del entorno local | El runner es limpio: todo debe estar declarado |
| Trivy "rompe" el build | `exit-code: 1` | En clase usamos `0`; en prod, `1` para bloquear |
