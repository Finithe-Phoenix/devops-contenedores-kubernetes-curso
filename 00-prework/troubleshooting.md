> 🌐 [English](troubleshooting.en.md) · **Español**

# 🛟 Troubleshooting del ambiente

Los problemas más comunes y su solución rápida. (El curso completo trae un
troubleshooting por laboratorio; esto es solo el de arranque.)

## Docker

| Síntoma | Solución |
| ------- | -------- |
| `Cannot connect to the Docker daemon` / `pipe/dockerDesktopLinuxEngine` | Abre **Docker Desktop** y espera a que el ícono de la ballena 🐳 deje de animarse. |
| Docker Desktop no abre en Windows | Verifica que **WSL2** y la **virtualización (VT-x)** estén activos en el BIOS. |
| `port is already allocated` (8080 o 5432) | Algo ya usa ese puerto: `docker rm -f <contenedor>` o cambia el mapeo `-p 8081:8080`. |
| Build muy lento la primera vez | Normal: descarga la imagen base. Las siguientes usan caché. |

## Node / npm

| Síntoma | Solución |
| ------- | -------- |
| `node: command not found` tras instalar | Reinicia la terminal (el `PATH` se actualiza al reabrir). |
| `npm ci` falla por falta de lockfile | Corre `npm install` una vez para generar `package-lock.json`. |
| Versión de Node muy vieja | Instala Node 22 LTS; usa `nvm` para cambiar entre versiones. |

## Git

| Síntoma | Solución |
| ------- | -------- |
| Scripts `.sh` fallan en Linux con `end of file unexpected` | Son CRLF. Este repo lo previene con `.gitattributes`. Si ya pasó: `git add --renormalize .` |
| `git clone` pide credenciales | Usa un token personal o configura SSH; o clona por HTTPS público. |

## Kubernetes (días 3-4)

| Síntoma | Solución |
| ------- | -------- |
| `kubectl` no conecta | Aún no hay clúster. Créalo: `kind create cluster --name devops-course`. |
| La imagen local no aparece en kind | kind no ve tu Docker local; hay que cargarla: `kind load docker-image academia-devops-app:1.0.0`. |

## Plan B universal

Si tu equipo está bloqueado por la institución:
1. Trabaja **en pareja** con alguien que sí tenga el ambiente.
2. Sigue la **demo proyectada** del instructor y anota los comandos.
3. Usa **GitHub Codespaces** si está disponible (Docker en la nube).
4. Deja la instalación como tarea y entrega la evidencia después.
