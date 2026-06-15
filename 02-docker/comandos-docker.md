# 🐳 Lab 1 — Docker: comandos esenciales

> **Misión:** contenerizar la Academia DevOps App. **Recompensa:** +100 XP y la medalla 🐳 *Capitán de Contenedores*.

## Antes de empezar

```bash
docker version          # cliente + servidor (daemon)
docker info             # info del motor; falla si Docker Desktop está apagado
```

## Construir la imagen

```bash
# Desde 01-app/node/
docker build -t academia-devops-app:1.0.0 .

docker images           # ¿aparece tu imagen?
```

## Correr el contenedor

```bash
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0

docker ps               # ¿está corriendo?
curl http://localhost:8080/health
docker logs academia
docker logs -f academia # seguir los logs en vivo (Ctrl+C para salir)
```

## Inspeccionar y entrar

```bash
docker inspect academia
docker exec -it academia sh        # abrir una shell dentro del contenedor
docker stats academia              # CPU / memoria en vivo
```

## Detener y limpiar

```bash
docker stop academia
docker rm academia
docker rmi academia-devops-app:1.0.0
docker system df                   # cuánto espacio usa Docker
docker system prune                # ⚠️ borra contenedores/imágenes sin usar
```

## Imagen vs Contenedor (la pregunta de oro)

| Imagen | Contenedor |
| ------ | ---------- |
| Plantilla inmutable (receta) | Instancia en ejecución (el platillo) |
| Se construye con `docker build` | Se crea con `docker run` |
| Una imagen → muchos contenedores | Cada uno tiene su propio estado |

## Reto extra (+20 XP): comparar imágenes

```bash
# Construye la versión insegura y mide la diferencia de tamaño
docker build -f ../02-docker/Dockerfile.insecure -t academia-app:inseguro ../01-app/node
docker images | grep academia
```
Pregunta para clase: **¿por qué pesa tanto más la imagen insegura?**

## ❗ Errores comunes (y cómo rescatarte)

| Error | Causa probable | Solución |
| ----- | -------------- | -------- |
| `Cannot connect to the Docker daemon` | Docker Desktop apagado | Abre Docker Desktop y espera la ballena 🐳 |
| `port is already allocated` | El puerto 8080 ya está ocupado | `docker rm -f academia` o usa `-p 8081:8080` |
| `npm ci` falla en el build | Falta `package-lock.json` | Corre `npm install` una vez para generarlo |
| El contenedor arranca y muere | Error en el código / variable faltante | `docker logs academia` |
