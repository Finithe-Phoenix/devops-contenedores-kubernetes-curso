# 📋 Logging básico en Kubernetes

> Parte de la misión 🔭 *Observador*. Los logs son tu primera herramienta de diagnóstico.

## Comandos esenciales

```bash
# Logs de un deployment (todos sus pods)
kubectl -n academia logs deployment/academia-app

# Seguir en vivo (Ctrl+C para salir)
kubectl -n academia logs -f deployment/academia-app

# Logs de un pod específico
kubectl -n academia logs <nombre-del-pod>

# Logs ANTERIORES (si el pod se reinició)
kubectl -n academia logs <nombre-del-pod> --previous

# Eventos del namespace (oro puro para diagnosticar)
kubectl -n academia get events --sort-by=.lastTimestamp

# Describir un pod (estado, eventos, por qué falla)
kubectl -n academia describe pod <nombre-del-pod>
```

## Logs buenos vs logs inútiles

| ✅ Log útil | ❌ Log inútil |
| ---------- | ------------ |
| `2026-06-14T10:03Z ERROR db connect failed host=db` | `error` |
| Tiene timestamp, nivel y contexto | No dice qué, dónde ni cuándo |
| Un `correlation-id` para seguir una petición | Mensajes sueltos sin relación |

## Logs PELIGROSOS (nunca hagas esto)

```js
// ❌ NUNCA loguees datos sensibles
console.log("login", { user, password });   // ⚠️ password en los logs
```

Los logs se guardan, se reenvían y se indexan. Un secreto en un log **es un secreto filtrado**.

## Buenas prácticas

- Timestamp + nivel (`INFO`/`WARN`/`ERROR`) en cada línea.
- `correlation-id` para rastrear una petición entre servicios.
- Nada de passwords, tokens ni datos personales.
- En producción: logs **centralizados** (Loki, o ELK: Elasticsearch + Fluentd + Kibana).

## Ejercicio: diagnostica por logs

1. Rompe la conexión a DB (en Compose, cambia `DB_PASSWORD`).
2. Mira `/health` → `"db":"down"`.
3. Lee los logs y encuentra la causa.
4. **Pregunta docente:** ¿cómo sabes que tu app está *viva*, *sana* y *por qué falló*?
