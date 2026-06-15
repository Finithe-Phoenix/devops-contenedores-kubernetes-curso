> 🌐 **English** · [Español](prometheus-grafana.md)

# 🔭 Lab 9 — Observability with Prometheus and Grafana

> **Mission:** observe the app and the cluster. **Reward:** +90 XP and the 🔭 *Observer* badge.

## The 3 pillars of observability

| Pillar | Answers... | In this course |
| ----- | ------------- | ------------- |
| **Logs** | What exactly happened? | `kubectl logs` ([logs.en.md](logs.en.md)) |
| **Metrics** | How does it behave over time? | `/metrics` + Prometheus |
| **Traces** | Which path did a request take? | concept (advanced) |

> Our app already exposes metrics at `/metrics` (Prometheus "scrapes" them from there).

## Install the stack (Helm) — simplified path

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

kubectl -n monitoring get pods       # wait until ALL are Running (takes a few minutes)
```

## Get into Grafana

```bash
# Default user: admin
kubectl -n monitoring get secret monitoring-grafana \
  -o jsonpath='{.data.admin-password}' | base64 -d ; echo

kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80
# Open http://localhost:3000  (admin / <the password from above>)
```

Inside Grafana you already get ready-made dashboards: **CPU, memory, Pod status, network**.

## What to monitor (and why)

| Metric | Why it matters |
| ------- | --------------- |
| CPU / memory | Saturation → slowness or restarts (OOMKilled) |
| Pod status | Restarts? CrashLoop? |
| Latency | User experience |
| Errors (5xx) | Did something break? |
| Availability | Is it up? |

## ❗ Troubleshooting

| Symptom | Fix |
| ------- | -------- |
| Monitoring Pods stuck in `Pending` for a long time | The kind cluster is out of RAM; close apps or give Docker more resources |
| `port 3000 in use` | Use another: `port-forward svc/monitoring-grafana 3001:80` |
| The dashboard won't load | Wait: kube-prometheus-stack takes a while to bring everything up |

> ⚠️ **Plan B (modest machines):** if the stack won't come up, just use the app's `/metrics`
> + `kubectl top pods` and explain the dashboards with screenshots. The learning still happens.

## Cleanup

```bash
helm uninstall monitoring -n monitoring
```
