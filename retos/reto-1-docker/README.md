> 🌐 [English](README.en.md) · **Español**

# 🕵️ Reto 1 — Docker: el contenedor muere al arrancar

**Capa:** 🐳 Docker · **Dificultad:** ★☆☆ · **Archivo roto:** [`Dockerfile`](Dockerfile)

## 🔬 Síntoma
La imagen **construye sin problemas**, pero el contenedor se muere apenas arranca:

```bash
docker logs <contenedor>
# Error: Cannot find module '/app/src/server.js'
```

## 🎯 Tu misión
Hay **un solo bug** en el `Dockerfile`. Encuéntralo, arréglalo, reconstruye y verifica que `/health` responde.

## 🧭 Pistas
<details><summary>Pista 1</summary>
El error dice que no encuentra <code>/app/src/server.js</code>. ¿A qué carpeta copiaste el código fuente con <code>COPY</code>?
</details>
<details><summary>Pista 2</summary>
El <code>CMD</code> arranca <code>src/server.js</code>, pero el <code>COPY</code> dejó el código en otra ruta dentro de la imagen.
</details>

## ✅ Cómo verificar
Copia tu `Dockerfile` corregido a `01-app/node/` (respalda el original) y:

```bash
cd 01-app/node
docker build -t reto1 .
docker run -d -p 8080:8080 --name reto1 reto1
curl http://localhost:8080/health    # -> {"status":"UP", ...}
docker rm -f reto1
```

## 💡 Solución
<details><summary>👀 Ver la solución</summary>

La línea `COPY src ./app` copia el código a `/app/app`, pero el `CMD` lo busca en `/app/src`.
Cámbiala por:

```dockerfile
COPY src ./src
```
</details>

## 🎓 Para tus alumnos
El 90% de los "no arranca" en Docker son **rutas**: dónde copiaste vs. dónde lo busca el comando.
Pregunta para clase: *¿en qué se diferencia el sistema de archivos de la imagen del de tu laptop?*
