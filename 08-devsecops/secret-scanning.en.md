> 🌐 **English** · [Español](secret-scanning.md)

# 🔎 Secret scanning — don't leave keys in the code

The most common and most expensive mistake: pushing a password or token to a repository.
Once it's in the git history, **it stays there forever** (even if you delete the file afterward).

## Bad practice (what NOT to do)

```js
// ❌ NEVER
const dbPassword = "supersecreta123";
const apiKey = "sk-live-abcd1234...";
```

```dockerfile
# ❌ NEVER: it stays visible in the image's layer history
ENV DB_PASSWORD=supersecreta123
```

## Good practice

```js
// ✅ Comes in via an environment variable; never in the code
const dbPassword = process.env.DB_PASSWORD;
```

- **Local:** an `.env` file (and `.env` in `.gitignore`!).
- **Docker Compose:** the `environment:` section or `env_file:`.
- **Kubernetes:** a `Secret` object.
- **CI/CD:** project secrets (GitHub Secrets / Jenkins credentials).

## Detecting leaked secrets

```bash
# In the image
trivy image --scanners secret academia-devops-app:1.0.0

# In the filesystem / repo
trivy fs --scanners secret .

# GitHub provides "secret scanning" and "push protection" for free on public repos.
```

## If you've already leaked a secret

1. **Rotate it immediately** (change it in the service). Assume it's already public.
2. Remove it from the code and use an environment variable.
3. (Optional) Clean the history with `git filter-repo` or BFG.

> **Teaching question:** what real risk does a student face if they push their `.env` to a public repo?
