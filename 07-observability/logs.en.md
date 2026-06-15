> 🌐 **English** · [Español](logs.md)

# 📋 Basic logging in Kubernetes

> Part of the 🔭 *Observer* mission. Logs are your first diagnostic tool.

## Essential commands

```bash
# Logs of a deployment (all its pods)
kubectl -n academia logs deployment/academia-app

# Follow live (Ctrl+C to exit)
kubectl -n academia logs -f deployment/academia-app

# Logs of a specific pod
kubectl -n academia logs <pod-name>

# PREVIOUS logs (if the pod restarted)
kubectl -n academia logs <pod-name> --previous

# Namespace events (pure gold for diagnosing)
kubectl -n academia get events --sort-by=.lastTimestamp

# Describe a pod (state, events, why it's failing)
kubectl -n academia describe pod <pod-name>
```

## Good logs vs useless logs

| ✅ Useful log | ❌ Useless log |
| ---------- | ------------ |
| `2026-06-14T10:03Z ERROR db connect failed host=db` | `error` |
| Has timestamp, level and context | Doesn't say what, where or when |
| A `correlation-id` to follow a request | Loose messages with no relation |

## DANGEROUS logs (never do this)

```js
// ❌ NEVER log sensitive data
console.log("login", { user, password });   // ⚠️ password in the logs
```

Logs are stored, forwarded and indexed. A secret in a log **is a leaked secret**.

## Best practices

- Timestamp + level (`INFO`/`WARN`/`ERROR`) on each line.
- `correlation-id` to trace a request across services.
- No passwords, tokens or personal data.
- In production: **centralized** logs (Loki, or ELK: Elasticsearch + Fluentd + Kibana).

## Exercise: diagnose from logs

1. Break the DB connection (in Compose, change `DB_PASSWORD`).
2. Check `/health` → `"db":"down"`.
3. Read the logs and find the cause.
4. **Teaching question:** how do you know your app is *alive*, *healthy* and *why it failed*?
