> 🌐 [English](misiones.en.md) · **Español**

# 🗺️ Misiones detalladas

Cada misión sigue el mismo formato: **Objetivo → Evidencia → XP → Reto extra → Pregunta docente**.

---

## Misión 0 — 🧰 Kit Listo (30 XP)
- **Objetivo:** dejar el ambiente listo (git, Docker, Node, kubectl, helm).
- **Evidencia:** salida de `bash scripts/check-env.sh`.
- **Reto extra (+10):** instalar `kind` y crear un clúster vacío.
- **Pregunta docente:** ¿cómo garantizas que TODOS tus alumnos tengan el mismo ambiente?

## Misión 1 — 🐳 Capitán de Contenedores (100 XP)
- **Objetivo:** construir la imagen y correr el contenedor; `/health` responde.
- **Evidencia:** `docker images`, `docker ps`, respuesta de `/health`.
- **Reto extra (+20):** construir `Dockerfile.insecure` y comparar tamaños.
- **Pregunta docente:** ¿qué NUNCA debe ir dentro de una imagen?

## Misión 2 — 🧩 Maestro Multicontenedor (120 XP)
- **Objetivo:** levantar app + PostgreSQL con Compose; los datos persisten.
- **Evidencia:** `/health` con `"store":"postgres"`, curso que sobrevive a `restart`.
- **Reto extra (+15):** romper a propósito el `DB_HOST` y diagnosticar con logs.
- **Pregunta docente:** ¿por qué la app llama a la DB por nombre y no por IP?

## Misión 3 — ⚙️ Automatizador (130 XP)
- **Objetivo:** pipeline CI que hace build + test + imagen, en verde.
- **Evidencia:** captura del workflow exitoso en GitHub Actions.
- **Reto extra (+20):** que el pipeline falle a propósito por un test roto y arreglarlo.
- **Pregunta docente:** ¿qué validaciones debe pasar el código antes de aceptarse?

## Misión 4 — 🛡️ Guardián Shift-Left (90 XP)
- **Objetivo:** escanear la imagen con Trivy e interpretar los hallazgos.
- **Evidencia:** reporte de Trivy + 3 recomendaciones de remediación.
- **Reto extra (+15):** detectar un secreto "quemado" en la imagen insegura.
- **Pregunta docente:** ¿qué detecta la herramienta y qué necesita criterio humano?

## Misión 5 — ☸️ Timonel del Clúster (140 XP)
- **Objetivo:** desplegar en Kubernetes (deployment + service) y acceder por port-forward.
- **Evidencia:** `kubectl get pods/services`, `/health` por port-forward.
- **Reto extra (+20):** provocar y diagnosticar un `ImagePullBackOff`.
- **Pregunta docente:** ¿en qué se diferencia exponer la app local vs dentro del clúster?

## Misión 6 — 🔐 Custodio de Secretos (70 XP)
- **Objetivo:** externalizar configuración con ConfigMap y Secret.
- **Evidencia:** deployment consumiendo variables desde ConfigMap/Secret.
- **Reto extra (+10):** mostrar que `base64` NO es cifrado.
- **Pregunta docente:** ¿qué va en configuración y qué va en secreto?

## Misión 7 — 📈 Operador en Vivo (110 XP)
- **Objetivo:** escalar réplicas, actualizar imagen (rolling update) y hacer rollback.
- **Evidencia:** `kubectl get pods` con 4 réplicas, historial de rollout, rollback.
- **Reto extra (+15):** desplegar una versión "mala" y revertirla sin downtime.
- **Pregunta docente:** ¿por qué una sola réplica NO es alta disponibilidad?

## Misión 8 — 🎁 Empaquetador Helm (100 XP)
- **Objetivo:** empaquetar el despliegue con un chart de Helm.
- **Evidencia:** `helm install` + `helm upgrade` exitosos.
- **Reto extra (+15):** cambiar el número de réplicas desde `values.yaml`.
- **Pregunta docente:** ¿cuándo conviene Helm sobre YAML manual?

## Misión 9 — 🔭 Observador (90 XP)
- **Objetivo:** consultar logs y métricas; entender un incidente simulado.
- **Evidencia:** logs del pod, dashboard básico o `/metrics`.
- **Reto extra (+15):** explicar un caso "el pipeline pasó pero producción falla".
- **Pregunta docente:** ¿cómo sé que mi app está viva, sana y por qué falló?

## Misión 10 — 🏛️ Arquitect@ DevOps (200 XP)
- **Objetivo:** integrar el flujo completo y presentarlo en 5 minutos.
- **Evidencia:** README final + recorrido de todo el ciclo.
- **Reto extra (+30):** adaptar el laboratorio a una materia específica que impartes.
- **Pregunta docente:** ¿cómo lo evaluarías con TUS alumnos?
