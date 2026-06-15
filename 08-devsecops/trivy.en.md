> 🌐 **English** · [Español](trivy.md)

# 🛡️ Lab 4 — DevSecOps with Trivy

> **Mission:** scan the image and interpret the findings. **Reward:** +90 XP and the 🛡️ *Shift-Left Guardian* badge.

## What is "shift-left"?

Moving security **to the left** = checking it **early** (in the code and the pipeline),
not at the end when it's already in production. It costs less and breaks less.

```
  CODE ──► BUILD ──► IMAGE ──► DEPLOY ──► PRODUCTION
    ▲          ▲          ▲
    └──────────┴──────────┘  ← this is where we want to catch problems (shift-left)
```

## Installing Trivy

```bash
# macOS
brew install trivy
# Windows (winget) / Linux: see https://trivy.dev
```

## Scanning the image

```bash
# Readable report
trivy image academia-devops-app:1.0.0

# Only the serious stuff (what really matters first)
trivy image --severity CRITICAL,HIGH academia-devops-app:1.0.0

# Only vulnerabilities with a fix available (actionable)
trivy image --ignore-unfixed --severity CRITICAL,HIGH academia-devops-app:1.0.0
```

## How to read the report

| Column | What it tells you |
| ------- | ----------- |
| **Library** | The vulnerable package |
| **Vulnerability** | The identifier (CVE-YYYY-NNNN) |
| **Severity** | CRITICAL / HIGH / MEDIUM / LOW |
| **Installed** | The version you have |
| **Fixed in** | The version that fixes it (if one exists) |

> 🎯 **Rule of thumb:** prioritize **CRITICAL/HIGH** issues with a **"Fixed in"** available. Those get fixed by updating.

## Other Trivy scans (bonus)

```bash
trivy fs 01-app/node              # scans the code's dependencies (not the image)
trivy config 05-kubernetes/       # checks for misconfigurations in the k8s YAML
trivy image --scanners secret academia-devops-app:1.0.0   # looks for leaked secrets
```

## The mission challenge

1. Scan `academia-devops-app:1.0.0` (the good image).
2. Build and scan the **insecure** one: `docker build -f 02-docker/Dockerfile.insecure -t academia-app:inseguro 01-app/node` and compare.
3. Detect the **hardcoded secret** (`DB_PASSWORD`) with `--scanners secret`.

## What Trivy DOES and DOESN'T do

- ✅ Detects known CVEs, plaintext secrets, and misconfigurations.
- ❌ Does NOT understand your business **logic** or whether a vuln is exploitable in YOUR case.
  → That requires **human judgment**. The tool speeds things up; it doesn't replace the engineer.
