> 🌐 **English** · [Español](README.md)

# 🕵️ Challenge 1 — Docker: the container dies on startup

**Layer:** 🐳 Docker · **Difficulty:** ★☆☆ · **Broken file:** [`Dockerfile`](Dockerfile)

## 🔬 Symptom
The image **builds fine**, but the container dies as soon as it starts:

```bash
docker logs <container>
# Error: Cannot find module '/app/src/server.js'
```

## 🎯 Your mission
There is **exactly one bug** in the `Dockerfile`. Find it, fix it, rebuild, and verify `/health` responds.

## 🧭 Hints
<details><summary>Hint 1</summary>
The error says it can't find <code>/app/src/server.js</code>. Which folder did you copy the source code into with <code>COPY</code>?
</details>
<details><summary>Hint 2</summary>
The <code>CMD</code> starts <code>src/server.js</code>, but the <code>COPY</code> placed the code at a different path inside the image.
</details>

## ✅ How to verify
Copy your fixed `Dockerfile` into `01-app/node/` (back up the original) and:

```bash
cd 01-app/node
docker build -t challenge1 .
docker run -d -p 8080:8080 --name challenge1 challenge1
curl http://localhost:8080/health    # -> {"status":"UP", ...}
docker rm -f challenge1
```

## 💡 Solution
<details><summary>👀 Show the solution</summary>

The line `COPY src ./app` copies the code to `/app/app`, but the `CMD` looks for it at `/app/src`.
Change it to:

```dockerfile
COPY src ./src
```
</details>

## 🎓 For your students
90% of "it won't start" in Docker is about **paths**: where you copied vs. where the command looks.
Class question: *how is the image's filesystem different from your laptop's?*
