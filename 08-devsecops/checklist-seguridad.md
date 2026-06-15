# ✅ Checklist DevSecOps (para ti y para tus alumnos)

Controles mínimos organizados por capa. Útil como rúbrica de seguridad en clase.

## 🧱 Código y dependencias
- [ ] No hay contraseñas, tokens ni llaves en el código.
- [ ] `.gitignore` excluye `.env` y archivos de secretos.
- [ ] Dependencias escaneadas (`trivy fs` / `npm audit`).
- [ ] Versiones de dependencias fijadas (lockfile versionado).

## 🐳 Imagen Docker
- [ ] Imagen base ligera y con versión fija (no `:latest`).
- [ ] `.dockerignore` evita copiar secretos y basura.
- [ ] Sin secretos en `ENV` ni en capas (`trivy --scanners secret`).
- [ ] Corre como usuario **no root** (`USER`).
- [ ] Imagen escaneada (`trivy image`).
- [ ] `HEALTHCHECK` definido.

## 🔧 Pipeline (CI/CD)
- [ ] El pipeline corre pruebas en cada cambio.
- [ ] El pipeline escanea la imagen.
- [ ] Los secretos viven en el gestor de secretos del CI, no en el YAML.
- [ ] (Prod) el escaneo **bloquea** si hay CRITICAL/HIGH.

## ☸️ Kubernetes
- [ ] `securityContext`: `runAsNonRoot`, `allowPrivilegeEscalation: false`, `drop: ["ALL"]`.
- [ ] `resources.requests` y `limits` definidos.
- [ ] Liveness y readiness probes.
- [ ] Secretos en `Secret` (no en el `Deployment` ni en ConfigMap).
- [ ] (Concepto) NetworkPolicies para limitar tráfico entre Pods.
- [ ] (Concepto) RBAC con privilegios mínimos.

## 🔐 Secretos
- [ ] Nunca en git.
- [ ] base64 **no** se confunde con cifrado.
- [ ] (Avanzado) Sealed Secrets / External Secrets / Vault.

## 📊 Observabilidad de seguridad
- [ ] Los logs **no** contienen datos sensibles (passwords, tokens, PII).
- [ ] Hay forma de saber quién hizo qué (auditoría).

> **Frase para clase:** *"Seguridad no es una etapa al final; es una propiedad de cada etapa."*
