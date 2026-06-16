> 🌐 [English](terminal-linux-wsl.en.md) · **Español**

# 🐧 Terminal Linux real en Windows (WSL2) — los comandos Unix tal cual

**Misión:** tener un **Linux de verdad dentro de Windows** para que **TODOS** los comandos de las guías
(`curl`, `grep`, `head`, `bash`, `cat`…) funcionen **sin traducir nada**. · **Medalla:** 🐧 *Pingüino en Windows*

> 💡 **¿Por qué?** Las guías usan comandos estilo Linux/Mac. En PowerShell algunos cambian
> (ver la [chuleta de PowerShell](windows-powershell.md)). Con **WSL2** te ahorras eso: copias y pegas
> los comandos **idénticos** a como aparecen en la guía. Es la forma más cómoda y "como en clase".

## 🧭 Qué vas a lograr

- Instalar **WSL2** (Subsistema de Windows para Linux) con una distro Linux.
- Correr `curl`, `grep`, `head`, `bash` **nativos** — los mismos de las guías.
- Conectar **Docker Desktop** con tu Linux.
- Abrir el repo del curso desde Linux.

## 👣 Pasos

### Paso 1 — Instala WSL2 (una línea, en PowerShell **como Administrador**)

```powershell
wsl --install
```

Esto instala WSL2 + **Ubuntu** (la distro recomendada para empezar: Docker se integra solo).
Al terminar, **reinicia** la PC. La primera vez que abras Ubuntu te pedirá crear un **usuario y
contraseña de Linux** (tuyos, locales — apúntalos).

> ✅ **¿Ya tienes WSL?** Comprueba con `wsl --list --verbose`. Si ves una distro en estado `Running`, ya estás.

### Paso 2 (opcional) — ¿Quieres **Arch Linux**? También se puede

```powershell
wsl --install archlinux
```

Arch es "rolling release" (siempre lo más nuevo). Tras instalarlo, inicialízalo una vez:

```bash
# dentro de Arch, como root:
pacman-key --init && pacman-key --populate archlinux
pacman -Syu --noconfirm
pacman -S --needed --noconfirm curl grep coreutils git
```

> 🐧 **Ubuntu vs Arch:** para el curso, **Ubuntu** es lo más sencillo (Docker integrado por defecto, todo
> preinstalado). **Arch** es genial si quieres lo más nuevo, pero requiere el toggle de Docker del Paso 3
> y un par de `pacman -S`. Cualquiera de las dos te da los comandos Unix de las guías.

### Paso 3 — Conecta Docker Desktop con tu Linux

1. Abre **Docker Desktop** → **Settings** (⚙️) → **Resources** → **WSL Integration**.
2. Activa el switch **"Enable integration with my default WSL distro"**.
3. Activa también tu distro en la lista (p. ej. `Ubuntu` o `archlinux`).
4. **Apply & restart**.

Verifica dentro de tu Linux:

```bash
docker --version
docker ps
```

### Paso 4 — Abre el repo del curso desde Linux

Tu disco `C:` está montado en `/mnt/c`. Si clonaste el curso en Windows:

```bash
cd /mnt/c/Users/TU_USUARIO/ruta/al/devops-contenedores-kubernetes-curso
```

> ⚡ **Tip de rendimiento:** para que Docker y `npm` vuelen, clona el repo **dentro** de Linux
> (en tu `~`) en vez de `/mnt/c`:
> ```bash
> git clone https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso.git
> cd devops-contenedores-kubernetes-curso
> ```

### Paso 5 — Comprueba que TODO funciona (los comandos de las guías, tal cual)

```bash
curl --version | head -1
grep --version | head -1
cd 01-app/node && npm install && npm test
bash ../../scripts/build-image.sh 1.0.0
curl http://localhost:8080/health
```

Si esto corre, ya puedes hacer **cualquier lab del curso copiando y pegando los comandos de las guías sin cambiarles nada**. 🎉

## ✅ Checkpoint

- `wsl --list --verbose` muestra tu distro `Running`.
- Dentro de Linux: `curl --version` y `grep --version` responden.
- `docker ps` funciona dentro de Linux.
- Desbloqueas 🐧 **Pingüino en Windows**.

## 🧯 Si algo falla

| Síntoma | Causa | Solución |
| ------- | ----- | -------- |
| `wsl: comando no encontrado` | WSL no instalado | Corre `wsl --install` en PowerShell **como Administrador** y reinicia |
| *"no tiene distribuciones instaladas"* | WSL sin distro | `wsl --install Ubuntu` (o `wsl --install archlinux`) |
| `docker: command not found` dentro de Linux | Falta integración | Docker Desktop → Settings → Resources → WSL Integration → activa tu distro → Apply & restart |
| Todo va **lento** en `/mnt/c` | El repo está en el disco de Windows | Clónalo dentro de `~` (Paso 4, tip) |
| `pacman-key` falla en Arch | Keyring sin inicializar | `pacman-key --init && pacman-key --populate archlinux` |

## 🎓 Cómo enseñarlo a tus alumnos

- **Recomienda Ubuntu por defecto.** Es un `wsl --install` y a trabajar; Docker se integra solo. Deja Arch
  como reto para los curiosos.
- **VS Code + WSL:** instala la extensión **"WSL"** de Microsoft. Abren la carpeta del curso con
  `code .` desde Linux y editan en Windows mientras corre en Linux. Lo mejor de los dos mundos.
- **Plan B siempre disponible:** quien no quiera WSL puede seguir las guías con la
  [chuleta de PowerShell](windows-powershell.md). Nadie se queda atorado.

➡️ Vuelve a tus labs: **[Guías paso a paso](README.md)**.
