> 🌐 **English** · [Español](README.md)

# 🕵️ Challenges: break it & fix it

Three files, each with **one real bug** — one per layer. Your mission: **diagnose and fix**.
Each challenge has a **symptom**, **hints** (hidden) and a **solution** (hidden). No peeking… yet. 😄

| Challenge | Layer | The bug, in one line |
| --------- | ----- | -------------------- |
| [Challenge 1 — Docker](reto-1-docker/) | 🐳 Docker | The container builds but dies on startup |
| [Challenge 2 — Compose](reto-2-compose/) | 🧩 Compose | The app starts but can't reach the database |
| [Challenge 3 — Kubernetes](reto-3-kubernetes/) | ☸️ Kubernetes | Pods run but the Service returns nothing |

## 🎮 How to play

1. Read the challenge **symptom**.
2. Open the **broken file** and find the bug (there's only one per challenge!).
3. Fix it and **verify** with the commands provided.
4. Stuck? Open the **hints**. Gave up? Open the **solution**.

> ⚡ **Quick version (spot-the-bug)** in the [Command Center](../01-app/node/README.en.md) →
> **🕵️ Bug Detective** section: identify the bug in one click and get the explanation instantly.

## 🎓 For your students

These three bugs are **90% of a beginner's real container problems**: wrong paths (Docker),
service names (Compose) and mismatched labels (Kubernetes). Trigger them on purpose in class:
the error is the best lesson.
