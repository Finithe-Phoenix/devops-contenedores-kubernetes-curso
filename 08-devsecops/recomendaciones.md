# 🧭 DevSecOps — inseguro vs mejorado (lado a lado)

Material para la dinámica "encuentra los problemas" del día 4.

## Dockerfile: inseguro → mejorado

| Inseguro ([`02-docker/Dockerfile.insecure`](../02-docker/Dockerfile.insecure)) | Mejorado ([`02-docker/Dockerfile.secure`](../02-docker/Dockerfile.secure)) |
| --- | --- |
| `FROM node:22` (≈1 GB) | `FROM node:22-alpine` (ligera) |
| `COPY . .` (todo, incluso secretos) | `.dockerignore` + copia selectiva |
| `RUN npm install` (con devDeps) | `RUN npm ci --omit=dev` (reproducible) |
| `ENV DB_PASSWORD=...` (secreto quemado) | secreto por entorno/Secret |
| corre como **root** | `USER node` (no root) |
| sin healthcheck | `HEALTHCHECK` definido |

## Manifiesto Kubernetes: inseguro → mejorado

```yaml
# ❌ INSEGURO (mínimo, sin controles)
spec:
  containers:
    - name: app
      image: academia-devops-app:latest      # tag movible
      # sin resources, sin probes, sin securityContext, corre como root
```

```yaml
# ✅ MEJORADO  (ver 05-kubernetes/deployment-with-probes.yaml)
spec:
  containers:
    - name: app
      image: academia-devops-app:1.0.0        # versión fija
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

## Tabla de controles por capa

| Capa | Control mínimo | Herramienta |
| ---- | -------------- | ----------- |
| Código | No secretos, deps fijadas | `trivy fs`, `npm audit` |
| Imagen | Base ligera, no root, escaneada | `trivy image` |
| Pipeline | Test + scan en cada cambio | GitHub Actions / Jenkins |
| Kubernetes | securityContext, limits, probes | `trivy config` |
| Secretos | Fuera de git, en Secret/Vault | `trivy --scanners secret` |
| Observabilidad | Logs sin datos sensibles | revisión + alertas |

## Roadmap de madurez DevOps (hacia dónde evolucionar)

1. Manual → 2. Scripts → 3. Docker → 4. CI/CD → 5. Kubernetes →
6. Helm → 7. Observabilidad → 8. DevSecOps → 9. GitOps → 10. Plataforma interna

> **GitOps (concepto, día 4):** el estado deseado vive en git; una herramienta
> (**Argo CD** / **Flux**) sincroniza el clúster con el repo automáticamente.
> **IaC:** **Terraform** *provisiona* infraestructura; **Ansible** *configura* servidores.
