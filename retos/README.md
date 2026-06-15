> 🌐 [English](README.en.md) · **Español**

# 🕵️ Retos: rómpelo y arréglalo

Tres archivos con **un bug real** cada uno — uno por capa. Tu misión: **diagnosticar y arreglar**.
Cada reto trae **síntoma**, **pistas** (ocultas) y **solución** (oculta). No hagas trampa… todavía. 😄

| Reto | Capa | El bug, en una línea |
| ---- | ---- | -------------------- |
| [Reto 1 — Docker](reto-1-docker/) | 🐳 Docker | El contenedor construye pero muere al arrancar |
| [Reto 2 — Compose](reto-2-compose/) | 🧩 Compose | La app levanta pero no se conecta a la base de datos |
| [Reto 3 — Kubernetes](reto-3-kubernetes/) | ☸️ Kubernetes | Los pods corren pero el Service no responde |

## 🎮 Cómo jugar

1. Lee el **síntoma** del reto.
2. Abre el **archivo roto** y busca el bug (¡solo hay uno por reto!).
3. Arréglalo, **verifica** con los comandos que trae cada uno.
4. ¿Atorado? Abre las **pistas**. ¿Rendido? Abre la **solución**.

> ⚡ **Versión rápida (spot-the-bug)** en el [Centro de Mando](../01-app/node/README.md) → sección
> **🕵️ Detective de bugs**: identifica el bug en 1 clic y recibe la explicación al instante.

## 🎓 Para tus alumnos

Estos tres bugs son **el 90% de los problemas reales** de un principiante en contenedores:
rutas equivocadas (Docker), nombres de servicio (Compose) y labels que no coinciden (Kubernetes).
Provócalos a propósito en clase: el error es la mejor lección.
