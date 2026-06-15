> 🌐 **English** · [Español](07-escalar-rollback.md)

# 🎯 Step-by-step guide — Lab 7: scale, update, and rollback

| | |
| --- | --- |
| **Mission** | 📈 Live Operator — scale replicas, update, and roll back with zero downtime |
| **XP** | +110 XP |
| **Badge** | 📈 Live Operator |
| **Time** | ~30 min |
| **Difficulty** | ★★☆ |

In this lab you become the **operator**: you'll scale the app to more replicas, ship a new
version with a **rolling update** (zero downtime) and, if something goes wrong, **roll back**
to the previous version with a single command.

## 🎒 Before you start

- ✅ Have the **Lab 5 cluster running** (kind `devops-course`).
- ✅ The **`academia` namespace** and the `academia-app` deployment deployed (Labs 5 and 6).
- ✅ The image `academia-devops-app:1.0.0` loaded into the cluster.

Confirm the starting point:

```bash
kubectl -n academia get deployment academia-app
```

**What you'll see:**

```
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
academia-app   2/2     2            2           8m
```

> We start from **2 replicas**. If you see something else, re-apply `05-kubernetes/deployment.yaml`.

## 🧭 What you'll achieve

- **Scale** the deployment from 2 to 4 replicas and watch it live.
- **Update** the image to `1.0.1` with a rolling update without interrupting the service.
- Read the **rollout history** (revisions 1 and 2).
- **Roll back** to the previous version and confirm it came back healthy.

## 👣 Steps

### Step 1 — Scale to 4 replicas

```bash
kubectl -n academia scale deployment academia-app --replicas=4
```

**What you'll see:**

```
deployment.apps/academia-app scaled
```

**What happened?** You asked the deployment for **4 identical copies** of the Pod. Kubernetes
automatically creates the 2 missing ones to reach the desired number (declarative state).

### Step 2 — See the 4 replicas running

```bash
kubectl -n academia get pods
```

**What you'll see:**

```
NAME                            READY   STATUS    RESTARTS   AGE
academia-app-7c9f8d6b54-abcde   1/1     Running   0          8m
academia-app-7c9f8d6b54-fghij   1/1     Running   0          8m
academia-app-7c9f8d6b54-klmno   1/1     Running   0          20s
academia-app-7c9f8d6b54-pqrst   1/1     Running   0          20s
```

**What happened?** There are now **4 `Running` pods**. The two new ones have a smaller `AGE`
(they were just born). More replicas = more capacity and fault tolerance.

### Step 3 — Build and load version 1.0.1

To update, the `1.0.1` image must exist in the cluster. Build and load it just like in Lab 5:

```bash
# Build the new image version
bash scripts/build-image.sh 1.0.1
# Load it into the kind cluster (the cluster does NOT see your local Docker)
kind load docker-image academia-devops-app:1.0.1 --name devops-course
```

**What you'll see:**

```
🐳 Building academia-devops-app:1.0.1 ...
✅ Image academia-devops-app:1.0.1 built.
academia-devops-app   1.0.1   ...
Image: "academia-devops-app:1.0.1" with ID "sha256:..." loaded onto node devops-course-control-plane
```

**What happened?** You built an image tagged `1.0.1` and **loaded it into the cluster**.
Without this `kind load`, the rolling update would fail with `ImagePullBackOff`.

### Step 4 — Update the image (rolling update, zero downtime)

```bash
kubectl -n academia set image deployment/academia-app academia-app=academia-devops-app:1.0.1
```

**What you'll see:**

```
deployment.apps/academia-app image updated
```

**What happened?** Kubernetes performs a **rolling update**: it spins up pods with the new
version and shuts down the old ones **gradually**, always keeping pods available. The user
**notices no outage**. That's the heart of a zero-downtime deployment.

### Step 5 — Watch the rollout progress

```bash
kubectl -n academia rollout status deployment/academia-app
```

**What you'll see:**

```
Waiting for deployment "academia-app" rollout to finish: 2 out of 4 new replicas have been updated...
Waiting for deployment "academia-app" rollout to finish: 3 out of 4 new replicas have been updated...
deployment "academia-app" successfully rolled out
```

**What happened?** You saw the gradual replacement: replica by replica until **all 4** run
version `1.0.1`. The final message confirms it finished cleanly.

### Step 6 — Inspect the rollout history

```bash
kubectl -n academia rollout history deployment/academia-app
```

**What you'll see:**

```
deployment.apps/academia-app
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

**What happened?** There are **2 revisions**: **1** is the initial deployment (`1.0.0`) and
**2** is the rolling update (`1.0.1`). Kubernetes keeps this history so you can **revert**.

### Step 7 — Roll back to the previous version

Imagine `1.0.1` has a bug. You return to the previous revision with one command:

```bash
kubectl -n academia rollout undo deployment/academia-app
```

**What you'll see:**

```
deployment.apps/academia-app rolled back
```

**What happened?** Kubernetes runs **another rolling update**, but back to `1.0.0`. Same
zero-downtime mechanism, now to **recover** from a bad version.

### Step 8 — Confirm the rollback is healthy

```bash
kubectl -n academia rollout status deployment/academia-app
```

**What you'll see:**

```
deployment "academia-app" successfully rolled out
```

**What happened?** The rollback finished correctly: the 4 replicas returned to the stable
version. Your service survived a bad deployment **without the user noticing**. 🎉

## ✅ Checkpoint

You've completed the lab if:

- [ ] `scale --replicas=4` showed **`scaled`** and `get pods` shows **4 Running pods**.
- [ ] `set image ...:1.0.1` showed **`image updated`** and the rollout finished OK.
- [ ] `rollout history` shows **REVISION 1 and 2**.
- [ ] `rollout undo` showed **`rolled back`** and the final status was **`successfully rolled out`**.

If you ticked all 4 boxes: 📈 **Live Operator badge unlocked! +110 XP**

## 🧯 If something fails

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `ImagePullBackOff` after `set image` | The `1.0.1` image isn't in the cluster | `kind load docker-image academia-devops-app:1.0.1 --name devops-course` |
| `error: unable to find ... 1.0.1` | You didn't build the image | `bash scripts/build-image.sh 1.0.1` and load it again |
| The rollout hangs waiting | New pods don't reach `Running` | `kubectl -n academia describe pod <pod>` and check Events |
| `rollout history` shows only REVISION 1 | `set image` changed nothing (same image) | Make sure you used `:1.0.1`, not `:1.0.0` |
| `no rollout history found` | The deployment was recreated from scratch | Run `set image` again to generate revision 2 |
| Old pods remain after rollback | The rollback isn't finished yet | Wait for `successfully rolled out` via `rollout status` |

## 🏆 Extra challenge (+15 XP)

Deploy a **deliberately bad** version and roll it back with no downtime:

```bash
# Image that does NOT exist -> simulates a broken deployment
kubectl -n academia set image deployment/academia-app academia-app=academia-devops-app:9.9.9
kubectl -n academia get pods          # you'll see ImagePullBackOff on the new pods
# Rescue the service:
kubectl -n academia rollout undo deployment/academia-app
```

Notice how Kubernetes **kept the old pods serving** while the new ones failed: a rolling
update doesn't kill the good ones until the new ones are ready. That's your safety net.

## 🎓 How to teach it to your students

- **The big idea:** in Kubernetes you don't "turn the app off and on". You declare the desired
  state (replicas, version) and the cluster converges toward it, gradually and reversibly.
- **The "aha" moment:** watching `rollout status` advance replica by replica. That's where
  they truly understand what "zero downtime" means.
- **Key discussion question:** *why is 1 replica NOT high availability?* Answer: if that single
  pod dies (or during an update), there are **seconds without service**. With several replicas
  at least one is always serving.
- **Live challenge:** the "bad" deployment in the extra challenge is teaching gold — students
  see the `ImagePullBackOff`, feel the scare, and then `rollout undo` saves them in one command.
- **Closer:** connect this to the real world — this is how teams ship multiple times a day
  without dropping production, and how they recover in seconds when something goes wrong.

## ⏭️ Next

➡️ **Lab 8 — 🎁 Helm Packager:** package this whole deployment (ConfigMap, Secret, Deployment,
Service) into a reusable **Helm chart**, so you can install and upgrade the app with a single
command instead of several `kubectl apply`.
