> 🌐 [English](EJECUTAR-LOCAL.en.md) · **Español**

# 🚀 Levantar el sitio en tu compu (local)

¿Quieres correr el **Centro de Mando** del curso en tu máquina y entrar desde tu navegador?
Aquí están las **3 formas**, de la más fácil a la más manual. Todas te dejan el sitio en:

> ### 👉 http://localhost:8080/

---

## 🅰️ La más fácil — Docker Compose (recomendada)

Necesitas **Docker Desktop** abierto (espera la ballena 🐳). Desde la **raíz del repo**:

```bash
docker compose up -d --build
```

Eso construye la app + levanta PostgreSQL. Cuando termine, abre **http://localhost:8080/**.

```bash
docker compose ps          # ver estado
docker compose logs -f app # ver registros
docker compose down        # apagar (conserva los datos)
docker compose down -v     # apagar y borrar la base de datos
```

> 🪟 **Windows:** corre estos comandos en **PowerShell** (no en `bash`). `docker` es nativo de Windows.

---

## 🅱️ Un solo comando — el launcher de clase

Hace todo lo anterior + espera a que la app responda + te abre el navegador:

```bash
# Windows (PowerShell)
pwsh scripts/clase.ps1

# Linux / Mac / WSL
bash scripts/clase.sh
```

---

## 🅲 Sin Docker — solo Node.js

Si no tienes Docker pero sí **Node.js 20+**. Usa almacén en memoria (sin base de datos):

```bash
cd 01-app/node
npm install
npm start            # -> http://localhost:8080/
```

> 🪟 **Windows:** para probar `curl` usa `curl.exe http://localhost:8080/health`, o abre la URL en el
> navegador. (En PowerShell `curl` es otro comando — ver la [chuleta](guias/windows-powershell.md).)

---

## 🗺️ ¿Qué páginas quedan disponibles en local?

Con el sitio levantado en `http://localhost:8080/` tienes, **todo servido desde tu máquina**:

| Página / recurso | URL local |
| ---------------- | --------- |
| 🎛️ **Centro de Mando** (portada) | http://localhost:8080/ |
| 🖼️ Galería de **infografías** (ES/EN) | dentro de la portada · imágenes en `/infografias/es/NN.png` |
| 📦 **Descargas** (ZIP + PPTX) | http://localhost:8080/downloads/infografias-todas.zip |
| ❤️ Salud de la app | http://localhost:8080/health |
| 🏷️ Versión | http://localhost:8080/version |
| 📊 Métricas (Prometheus) | http://localhost:8080/metrics |
| 📚 Cursos (API) | http://localhost:8080/courses |

> ℹ️ Los enlaces a las **guías paso a paso** y a los **retos** abren en **GitHub** (se ven mejor ahí, con
> formato). Necesitan internet; el resto del sitio funciona 100% local.

---

## 🧯 Si algo falla

| Síntoma | Causa | Solución |
| ------- | ----- | -------- |
| `Cannot connect to the Docker daemon` | Docker Desktop apagado | Ábrelo y espera la ballena 🐳, reintenta |
| `port is already allocated` / `address already in use` | El puerto 8080 ya está ocupado | Apaga lo que lo use, o cambia el puerto: `PORT=8081` (npm) o edita el `ports` del compose |
| La portada carga pero dice *"modo web"* (banner ámbar) | La app no responde en `/health` | Asegúrate de que el contenedor esté `Up`: `docker compose ps`; revisa `docker compose logs app` |
| 🪟 `bash: ...` o *"WSL no tiene distribuciones"* | Usaste `bash` en Windows | Usa **PowerShell** + `pwsh scripts/clase.ps1`, o `docker compose up` directo |
| 🪟 `curl` muestra algo raro | En PowerShell `curl` = `Invoke-WebRequest` | Usa `curl.exe`, o abre la URL en el navegador |

¿Quieres una terminal donde **todos** los comandos Linux funcionen tal cual?
→ [Terminal Linux real con WSL2](guias/terminal-linux-wsl.md).
