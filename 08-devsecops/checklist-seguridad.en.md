> 🌐 **English** · [Español](checklist-seguridad.md)

# ✅ DevSecOps Checklist (for you and your students)

Minimum controls organized by layer. Useful as a security rubric in class.

## 🧱 Code and dependencies
- [ ] No passwords, tokens, or keys in the code.
- [ ] `.gitignore` excludes `.env` and secret files.
- [ ] Dependencies scanned (`trivy fs` / `npm audit`).
- [ ] Dependency versions pinned (lockfile versioned).

## 🐳 Docker image
- [ ] Lightweight base image with a pinned version (not `:latest`).
- [ ] `.dockerignore` avoids copying secrets and junk.
- [ ] No secrets in `ENV` or in layers (`trivy --scanners secret`).
- [ ] Runs as a **non-root** user (`USER`).
- [ ] Image scanned (`trivy image`).
- [ ] `HEALTHCHECK` defined.

## 🔧 Pipeline (CI/CD)
- [ ] The pipeline runs tests on every change.
- [ ] The pipeline scans the image.
- [ ] Secrets live in the CI's secret manager, not in the YAML.
- [ ] (Prod) the scan **blocks** if there's a CRITICAL/HIGH.

## ☸️ Kubernetes
- [ ] `securityContext`: `runAsNonRoot`, `allowPrivilegeEscalation: false`, `drop: ["ALL"]`.
- [ ] `resources.requests` and `limits` defined.
- [ ] Liveness and readiness probes.
- [ ] Secrets in a `Secret` (not in the `Deployment` or a ConfigMap).
- [ ] (Concept) NetworkPolicies to limit traffic between Pods.
- [ ] (Concept) RBAC with least privilege.

## 🔐 Secrets
- [ ] Never in git.
- [ ] base64 is **not** to be confused with encryption.
- [ ] (Advanced) Sealed Secrets / External Secrets / Vault.

## 📊 Security observability
- [ ] Logs do **not** contain sensitive data (passwords, tokens, PII).
- [ ] There's a way to know who did what (auditing).

> **Phrase for class:** *"Security isn't a stage at the end; it's a property of every stage."*
