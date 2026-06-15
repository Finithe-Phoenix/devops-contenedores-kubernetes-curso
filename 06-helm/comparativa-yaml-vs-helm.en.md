> 🌐 **English** · [Español](comparativa-yaml-vs-helm.md)

# 🎁 Lab 8 — Helm: manual YAML vs Helm

> **Mission:** package the deployment with Helm. **Reward:** +100 XP and the 🎁 *Helm Packager* badge.

## The problem Helm solves

With manual YAML, to have 3 environments (dev/qa/prod) you end up **copying and pasting**
the same manifests and changing values by hand. Helm turns them into a **parameterizable
template**: a single chart, many deployments, with `values.yaml`.

| | Manual YAML | Helm |
| --- | ----------- | ---- |
| Change replicas across 3 environments | Edit 3 files | `--set replicaCount=N` |
| Install everything | `kubectl apply -f` (one by one) | `helm install` (all at once) |
| Update | apply and pray | `helm upgrade` (versioned) |
| Roll back | manual | `helm rollback` (1 command) |
| Reuse | copy/paste | one chart, many `values` |

## Use OUR chart

```bash
# From the repo root (requires a kind cluster + loaded image, see Lab 5)
helm install academia ./06-helm/academia-app-chart -n academia --create-namespace

helm list -n academia
kubectl -n academia get all
```

Test:

```bash
kubectl -n academia port-forward svc/academia-app-service 8080:80
curl http://localhost:8080/health
```

## The star demo: change values without touching templates

```bash
# Scale to 4 replicas WITHOUT editing any YAML
helm upgrade academia ./06-helm/academia-app-chart -n academia --set replicaCount=4
kubectl -n academia get pods           # 👈 now there are 4

# View the release's version history
helm history academia -n academia

# Roll back to the first version
helm rollback academia 1 -n academia
```

## Chart structure

```text
academia-app-chart/
├── Chart.yaml           # metadata (name, chart version and app version)
├── values.yaml          # the parameters (replicas, image, resources...)
└── templates/
    ├── _helpers.tpl     # reusable functions (names, labels)
    ├── configmap.yaml   # ConfigMap template
    ├── deployment.yaml  # Deployment template
    ├── service.yaml     # Service template
    └── NOTES.txt        # message Helm shows after installing
```

## Validate the chart without deploying

```bash
helm lint ./06-helm/academia-app-chart
helm template academia ./06-helm/academia-app-chart      # renders the final YAML
```

## Cleanup

```bash
helm uninstall academia -n academia
```

**Teaching question:** when is Helm preferable over manual YAML? (Hint: number of environments and frequency of changes.)
