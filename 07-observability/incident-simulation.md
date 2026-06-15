> 🌐 [English](incident-simulation.en.md) · **Español**

# 🚨 Simulación de incidentes (dinámica de clase)

Cuatro escenarios para que los profesores **diagnostiquen** como si fuera real.
Cada uno: síntoma → cómo investigarlo → causa → lección.

---

## Incidente 1 — "Un pod se reinicia solo"

- **Síntoma:** `kubectl get pods` muestra `RESTARTS` subiendo.
- **Investiga:** `kubectl describe pod <pod>` (Events) + `kubectl logs <pod> --previous`.
- **Causa típica:** la liveness probe falla, o el contenedor excede su `memory limit` (OOMKilled).
- **Lección:** las probes y los límites cambian el comportamiento; mal configurados, causan reinicios.

## Incidente 2 — "La app responde lento"

- **Síntoma:** latencia alta en Grafana, CPU al tope.
- **Investiga:** dashboard de CPU/memoria, `kubectl top pods`.
- **Causa típica:** pocas réplicas para la carga, o `cpu limit` muy bajo.
- **Lección:** escalar (`kubectl scale`) y dimensionar recursos. Una réplica **no** es alta disponibilidad.

## Incidente 3 — "La base de datos no responde"

- **Síntoma:** `/health` devuelve `"db":"down"`.
- **Investiga:** logs de la app + estado del pod de la DB + `kubectl get events`.
- **Causa típica:** credenciales mal, la DB aún no está lista, o el Service no resuelve.
- **Lección:** `depends_on: service_healthy` (Compose) y readiness probes (k8s) evitan el arranque prematuro.

## Incidente 4 — "El pipeline pasó, pero producción falla"

- **Síntoma:** CI en verde, pero la app no levanta en el clúster.
- **Investiga:** ¿la imagen correcta? ¿variables/Secrets presentes? ¿`ImagePullBackOff`?
- **Causa típica:** diferencia de configuración entre CI y el clúster (la imagen no se cargó en kind, falta un Secret).
- **Lección:** "pasó en CI" ≠ "funciona en prod". Por eso existen los ambientes y la observabilidad.

---

## Cómo usar esta dinámica

1. El instructor **provoca** un incidente (ej. baja el `memory limit`, rompe el password).
2. Los equipos diagnostican con `logs`, `describe`, `events`, dashboards.
3. Gana el equipo que encuentre la causa raíz primero (+10 XP sorpresa).
4. Cierre: *"¿Cómo sé que mi aplicación está viva? ¿Sana? ¿Por qué falló?"*
