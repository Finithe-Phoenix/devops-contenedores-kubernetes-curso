> 🌐 **English** · [Español](recomendaciones.md)

# 🧭 DevSecOps — insecure vs improved (side by side)

Material for the day-4 "spot the problems" activity.

## Dockerfile: insecure → improved

| Insecure ([`02-docker/Dockerfile.insecure`](../02-docker/Dockerfile.insecure)) | Improved ([`02-docker/Dockerfile.secure`](../02-docker/Dockerfile.secure)) |
| --- | --- |
| `FROM node:22` (≈1 GB) | `FROM node:22-alpine` (lightweight) |
| `COPY . .` (everything, even secrets) | `.dockerignore` + selective copy |
| `RUN npm install` (with devDeps) | `RUN npm ci --omit=dev` (reproducible) |
| `ENV DB_PASSWORD=...` (hardcoded secret) | secret via environment/Secret |
| runs as **root** | `USER node` (non-root) |
| no healthcheck | `HEALTHCHECK` defined |

## Kubernetes manifest: insecure → improved

```yaml
# ❌ INSECURE (minimal, no controls)
spec:
  containers:
    - name: app
      image: academia-devops-app:latest      # movable tag
      # no resources, no probes, no securityContext, runs as root
```

```yaml
# ✅ IMPROVED  (see 05-kubernetes/deployment-with-probes.yaml)
spec:
  containers:
    - name: app
      image: academia-devops-app:1.0.0        # pinned version
      readinessProbe:   { httpGet: { path: /health, port: 8080 } }
      livenessProbe:    { httpGet: { path: /health, port: 8080 } }
      resources:
        requests: { memory: "64Mi", cpu: "100m" }
        limits:   { memory: "128Mi", cpu: "250m" }
      securityContext:
        runAsNonRoot: true
        allowPrivilegeEscalation: false
        capabilities: { drop: ["ALL"] }
```

## Table of controls by layer

| Layer | Minimum control | Tool |
| ---- | -------------- | ----------- |
| Code | No secrets, pinned deps | `trivy fs`, `npm audit` |
| Image | Lightweight base, non-root, scanned | `trivy image` |
| Pipeline | Test + scan on every change | GitHub Actions / Jenkins |
| Kubernetes | securityContext, limits, probes | `trivy config` |
| Secrets | Out of git, in Secret/Vault | `trivy --scanners secret` |
| Observability | Logs without sensitive data | review + alerts |

## DevOps maturity roadmap (where to evolve toward)

1. Manual → 2. Scripts → 3. Docker → 4. CI/CD → 5. Kubernetes →
6. Helm → 7. Observability → 8. DevSecOps → 9. GitOps → 10. Internal platform

> **GitOps (concept, day 4):** the desired state lives in git; a tool
> (**Argo CD** / **Flux**) syncs the cluster with the repo automatically.
> **IaC:** **Terraform** *provisions* infrastructure; **Ansible** *configures* servers.
