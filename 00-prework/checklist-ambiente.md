> 🌐 [English](checklist-ambiente.en.md) · **Español**

# ✅ Checklist de ambiente (Lab 0)

Marca cada punto. Cuando todos estén ✅, desbloqueas la medalla 🧰 *Kit Listo* (+30 XP).

## Herramientas instaladas

- [ ] `git --version` responde
- [ ] `docker --version` responde
- [ ] `docker info` responde (el **daemon** está corriendo, no solo el cliente)
- [ ] `node --version` muestra v20 o superior
- [ ] `npm --version` responde

## Para Kubernetes (días 3-4)

- [ ] `kubectl version --client` responde
- [ ] `helm version` responde
- [ ] `kind --version` responde

## Prueba de fuego (la app corre en tu máquina)

- [ ] `cd 01-app/node && npm install` termina sin errores
- [ ] `npm test` muestra **8/8** pruebas en verde
- [ ] `npm start` y luego `curl http://localhost:8080/health` responde `"status":"UP"`

## Prueba de fuego Docker

- [ ] `docker build -t academia-devops-app:1.0.0 .` construye la imagen
- [ ] `docker run -d -p 8080:8080 academia-devops-app:1.0.0` levanta el contenedor
- [ ] `curl http://localhost:8080/health` responde

> ¿Algo falla? → [`troubleshooting.md`](troubleshooting.md)
