> 🌐 **English** · [Español](incident-simulation.md)

# 🚨 Incident simulation (classroom activity)

Four scenarios for teachers to **diagnose** as if it were real.
Each one: symptom → how to investigate it → cause → lesson.

---

## Incident 1 — "A pod restarts on its own"

- **Symptom:** `kubectl get pods` shows `RESTARTS` climbing.
- **Investigate:** `kubectl describe pod <pod>` (Events) + `kubectl logs <pod> --previous`.
- **Typical cause:** the liveness probe fails, or the container exceeds its `memory limit` (OOMKilled).
- **Lesson:** probes and limits change behavior; misconfigured, they cause restarts.

## Incident 2 — "The app responds slowly"

- **Symptom:** high latency in Grafana, CPU maxed out.
- **Investigate:** CPU/memory dashboard, `kubectl top pods`.
- **Typical cause:** too few replicas for the load, or a `cpu limit` that's too low.
- **Lesson:** scale (`kubectl scale`) and size resources. One replica is **not** high availability.

## Incident 3 — "The database isn't responding"

- **Symptom:** `/health` returns `"db":"down"`.
- **Investigate:** app logs + the DB pod's status + `kubectl get events`.
- **Typical cause:** wrong credentials, the DB isn't ready yet, or the Service doesn't resolve.
- **Lesson:** `depends_on: service_healthy` (Compose) and readiness probes (k8s) prevent premature startup.

## Incident 4 — "The pipeline passed, but production fails"

- **Symptom:** CI is green, but the app won't come up in the cluster.
- **Investigate:** the right image? variables/Secrets present? `ImagePullBackOff`?
- **Typical cause:** configuration difference between CI and the cluster (the image wasn't loaded into kind, a Secret is missing).
- **Lesson:** "it passed in CI" ≠ "it works in prod". That's why environments and observability exist.

---

## How to use this activity

1. The instructor **triggers** an incident (e.g. lowers the `memory limit`, breaks the password).
2. Teams diagnose with `logs`, `describe`, `events`, dashboards.
3. The first team to find the root cause wins (+10 surprise XP).
4. Wrap-up: *"How do I know my application is alive? Healthy? Why did it fail?"*
