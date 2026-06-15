# 🔎 Secret scanning — no dejes llaves en el código

El error más común y más caro: subir una contraseña o token a un repositorio.
Una vez en el historial de git, **queda ahí para siempre** (aunque borres el archivo después).

## Mala práctica (lo que NO se hace)

```js
// ❌ NUNCA
const dbPassword = "supersecreta123";
const apiKey = "sk-live-abcd1234...";
```

```dockerfile
# ❌ NUNCA: queda visible en el historial de capas de la imagen
ENV DB_PASSWORD=supersecreta123
```

## Buena práctica

```js
// ✅ Llega por variable de entorno; nunca está en el código
const dbPassword = process.env.DB_PASSWORD;
```

- **Local:** archivo `.env` (¡y `.env` en `.gitignore`!).
- **Docker Compose:** sección `environment:` o `env_file:`.
- **Kubernetes:** objeto `Secret`.
- **CI/CD:** secretos del proyecto (GitHub Secrets / credenciales de Jenkins).

## Detectar secretos filtrados

```bash
# En la imagen
trivy image --scanners secret academia-devops-app:1.0.0

# En el sistema de archivos / repo
trivy fs --scanners secret .

# GitHub trae "secret scanning" y "push protection" gratis en repos públicos.
```

## Si ya filtraste un secreto

1. **Rótalo de inmediato** (cámbialo en el servicio). Asume que ya es público.
2. Quítalo del código y usa variable de entorno.
3. (Opcional) Limpia el historial con `git filter-repo` o BFG.

> **Pregunta docente:** ¿qué riesgo real tiene un alumno que sube su `.env` a un repo público?
