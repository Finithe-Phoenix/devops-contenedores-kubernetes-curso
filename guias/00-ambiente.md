> 🌐 [English](00-ambiente.en.md) · **Español**

# 🎯 Guía paso a paso — Lab 0: Validar tu ambiente

**Misión:** dejar tu máquina lista para el curso · **XP:** +30 · **Medalla:** 🧰 Kit Listo · **Tiempo:** ~10 min · **Dificultad:** ★☆☆

## 🎒 Antes de empezar

**Prerrequisitos**

- Tener clonado este repositorio y una terminal abierta en su raíz.
- **Docker Desktop instalado y abierto** (busca la ballenita 🐳 corriendo en tu barra de tareas).
- Git, Node.js (v20 o superior) y npm instalados. ¿No los tienes? → [`00-prework/instalacion.md`](../00-prework/instalacion.md).

**Dónde encaja en el ciclo DevOps**

Antes de *codear*, *construir*, *probar* o *desplegar* nada, todo el equipo necesita el **mismo ambiente reproducible**. Este Lab es el "Plan → Setup": eliminamos el clásico *"en mi máquina sí funciona"* dejando todas las herramientas validadas de una vez.

## 🧭 Qué vas a lograr

- Comprobar que git, Docker, Node y npm responden en tu máquina.
- Confirmar que el **daemon** de Docker está corriendo (no solo el cliente).
- Desbloquear tu primera medalla del curso: 🧰 **Kit Listo** (+30 XP).

## 👣 Pasos

### Paso 1 — Ubícate en la raíz del repo

```bash
cd devops-contenedores-kubernetes-curso
```

**Lo que verás:** (el prompt cambia a la carpeta del curso)

```
~/devops-contenedores-kubernetes-curso$
```

**¿Qué pasó?** Todos los comandos de este Lab se ejecutan desde la raíz del repositorio, porque el script `check-env.sh` vive bajo `scripts/`.

### Paso 2 — Ejecuta el validador de ambiente

```bash
bash scripts/check-env.sh
```

**Lo que verás:**

```
=================================================
  Lab 0 — Validación de ambiente (Misión 🧰)
=================================================

Imprescindibles:
  ✅ git                    git version 2.43.0
  ✅ docker                 Docker version 28.1.1, build 4eba377
  ✅ node                   v22.22.3
  ✅ npm                    10.9.0

Para los días de Kubernetes:
  ✅ kubectl                Client Version: v1.30.0
  ✅ helm                   v3.15.0+g...
  ✅ kind                   kind v0.23.0

Opcionales (ruta Java):
  ❌ java                   (no encontrado)
  ❌ maven                  (no encontrado)

-------------------------------------------------
  Listos: 7    Faltantes: 2
-------------------------------------------------
  🐳 Docker daemon: CORRIENDO
  🎉 Ambiente completo. +30 XP — medalla 🧰 Kit Listo desbloqueada.
```

**¿Qué pasó?** El script consultó cada herramienta y mostró su versión. Java y Maven son **opcionales** (solo para la ruta Java), así que sus ❌ no rompen la misión: lo que cuenta es la línea `🎉 Ambiente completo`.

### Paso 3 — Verifica Node y Docker a mano

```bash
node --version
docker --version
```

**Lo que verás:**

```
v22.22.3
Docker version 28.1.1, build 4eba377
```

**¿Qué pasó?** Confirmaste tú mismo las dos herramientas centrales del curso: Node corre la app y Docker la contenerizará en el Lab 1. Cualquier `v20.x` o superior de Node, y `28.x` de Docker, te sirve.

### Paso 4 — Confirma que el daemon de Docker responde

```bash
docker info
```

**Lo que verás:** (un bloque largo; lo importante es que NO aparezca un error de conexión)

```
Client: Docker Engine - Community
 ...
Server:
 Containers: 0
 Images: 0
 Server Version: 28.1.1
 ...
```

**¿Qué pasó?** `docker info` habla con el **servidor** (el daemon), no solo con el cliente. Si responde con la sección `Server:`, Docker Desktop está vivo y listo para construir imágenes.

## ✅ Checkpoint

Has completado el Lab 0 cuando:

- `bash scripts/check-env.sh` termina con `🐳 Docker daemon: CORRIENDO` y `🎉 Ambiente completo. +30 XP`.
- `node --version` muestra **v20 o superior** y `docker --version` muestra **28.x**.

**Evidencia para tu tarjeta de logros:** una captura de la salida final de `check-env.sh`.

## 🧯 Si algo falla

| Síntoma | Causa | Solución |
| ------- | ----- | -------- |
| `🐳 Docker daemon: ⚠️ NO responde` | Docker Desktop está apagado | Abre Docker Desktop y espera a que la ballena 🐳 deje de animarse |
| `❌ docker (no encontrado)` | Docker no está instalado o no está en el `PATH` | Instálalo siguiendo [`00-prework/instalacion.md`](../00-prework/instalacion.md) y reinicia la terminal |
| `❌ node` o versión menor a v20 | Node antiguo o ausente | Instala Node 20+ desde [nodejs.org](https://nodejs.org) |
| `scripts/check-env.sh: not found` | Estás en otra carpeta | `cd` a la raíz del repo (Paso 1) |
| `Permission denied` al correr el script | Falta permiso de ejecución | Anteponlo con `bash`: `bash scripts/check-env.sh` |

¿Sigue fallando? → [`00-prework/troubleshooting.md`](../00-prework/troubleshooting.md)

## 🏆 Reto extra (+10 XP)

Instala **`kind`** (Kubernetes IN Docker) y crea un clúster vacío para confirmar que todo encaja:

```bash
kind create cluster --name academia
kubectl get nodes
```

Cuando termines, bórralo para no gastar recursos: `kind delete cluster --name academia`.

## 🎓 Cómo enseñarlo a tus alumnos

- **Abre con la pregunta clásica:** *"¿a quién le ha pasado el 'en mi máquina sí funciona'?"* y conecta el caos de ambientes distintos con el porqué de este Lab.
- **Pide la captura del check como pase de entrada:** que nadie avance al Lab 1 sin su `🎉 Ambiente completo`. Detectas a los rezagados antes de que se traben.
- **Convierte un ❌ en demo:** apaga Docker Desktop a propósito y muestra la diferencia entre cliente y daemon. Es un "aha" memorable.
- **Reparte la medalla en voz alta:** nombrar 🧰 *Kit Listo* al cerrar el Lab refuerza el sistema de XP desde el minuto uno.

## ⏭️ Siguiente

➡️ [Lab 1: Tu primera imagen Docker](01-docker.md)
