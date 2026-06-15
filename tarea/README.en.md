> 🌐 **English** · [Español](README.md)

# 📝 Homework — From code to container (at your own pace)

> **Don't worry if something failed in class.** This assignment is designed so **everyone** can finish it:
> there's a path that needs **no installation** and a hands-on path with its Plan B.
> The goal isn't for everything to be perfect — it's for you to **live and understand the cycle**.

- **Format:** individual or teams (max. 3).
- **Estimated time:** 60–90 min.
- **Due:** _____ / _____ / _______ · **How to submit:** a PDF or document with your screenshots and answers.
- **Reward:** 🐳 *Container Captain* badge + 🛡️ *Shift-Left Guardian* (≈ **190 XP**).

---

## 🌐 Part 1 — Explore (no install needed · required for everyone)

Open the course **Command Center** in your browser (phone or laptop):
👉 **https://finithe-phoenix.github.io/devops-contenedores-kubernetes-curso/**

1. Take the **Guided tour** (▶ button at the top).
2. Complete the **3 challenges in 🕵️ Bug Detective** (Docker, Compose, Kubernetes).
3. In **Your progress**, check at least 3 missions you already understand.

**📸 Deliverable 1:** a screenshot of **Bug Detective at 3/3** and one of **Your progress**.

---

## 🐳 Part 2 — Practice (choose ONE option)

### Option A — With Docker (if it worked for you)
Follow the [Lab 1 guide](../guias/01-docker.en.md) and build + run the app:

```bash
git clone https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso.git
cd devops-contenedores-kubernetes-curso/01-app/node
docker build -t academia-devops-app:1.0.0 .
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0
curl http://localhost:8080/health
```

**📸 Deliverable 2A:** screenshots of `docker images`, `docker ps` and the `/health` response
(`{"status":"UP",...}`).

### Option B — Without Docker (Plan B, if it didn't install)
Open the broken challenge [`retos/reto-1-docker/Dockerfile`](../retos/reto-1-docker/) and, by **reading it**, answer:

1. What is the **bug** in the Dockerfile? (there's only one)
2. Why would the container die on startup? (hint: `Cannot find module`)
3. Write the **corrected line**.

**✍️ Deliverable 2B:** your answers to the 3 questions (3–5 lines).

---

## 🎓 Part 3 — Teaching application (required · the most important)

You're a teacher. In **half a page** answer:

1. In **which of your courses** could this lab fit? (Programming, DB, Networks, Security…)
2. What evidence would you ask **your students** for?
3. What **common error** do you anticipate and how would you rescue them?

**✍️ Deliverable 3:** your proposal for taking it to your class.

---

## ✅ Rubric (10 points)

| Criterion | Excellent | Sufficient | Missing |
| --------- | --------- | ---------- | ------- |
| **Part 1 — Explore** (3) | Detective 3/3 + progress, with screenshots | Did it partially | No evidence |
| **Part 2 — Practice** (4) | Option A working, or B well reasoned | Made progress with help | Didn't try |
| **Part 3 — Teaching** (3) | Clear proposal grounded in their subject | General idea | Doesn't connect to class |

> 💡 **The only essentials** are Part 1 and Part 3 — those need **no Docker**.
> Part 2 is where you show the technical side, and we accept route B if your team didn't install.

---

### 🆘 Stuck?
- One-command install (Windows): see [`00-prework/instalacion.en.md`](../00-prework/instalacion.en.md).
- Step-by-step guides per lab: [`guias/`](../guias/README.en.md).
- Full course material: [the repository](https://github.com/Finithe-Phoenix/devops-contenedores-kubernetes-curso).

*Do it at your own pace. Errors are part of learning — that's what DevOps is about.* 🚀
