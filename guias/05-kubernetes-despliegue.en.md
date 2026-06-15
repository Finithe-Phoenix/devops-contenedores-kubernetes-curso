> 🌐 **English** · [Español](05-kubernetes-despliegue.md)

# 🎯 Step-by-step guide — Lab 5: Deploying to Kubernetes

> **Mission:** create a local cluster, load your image, and deploy the app with Namespace, ConfigMap, Secret, Deployment, and Service until you see it respond.
> **XP:** +140 · **Badge:** ☸️ *Cluster Helmsman* · **Time:** ~40 min · **Difficulty:** ★★★

## 🎒 Before you start

You need:

- **Docker** running.
- **kind** installed (Kubernetes IN Docker): https://kind.sigs.k8s.io/docs/user/quick-start/#installation
- **kubectl** installed: https://kubernetes.io/docs/tasks/tools/
- The course image built (`bash scripts/build-image.sh 1.0.0`).
- A terminal at the **repo root** (`devops-contenedores-kubernetes-curso/`).

> 📦 **Not using kind?** If you prefer **minikube**, the steps are the same: just swap the cluster
> creation and the **image load** (flagged in a callout box in Step 3).

## 🧭 What you'll achieve

By the end of this lab you'll:

1. Create a single-node local Kubernetes cluster and see it `Ready`.
2. **Live through the classic error** `ImagePullBackOff` and learn why it happens.
3. Load your local image into the cluster and deploy 5 manifests.
4. See **2/2 pods Running**, confirm the rollout, and test `/health` with a `port-forward`.

## 👣 Steps

### Step 1 — Create the local cluster

We spin up a Kubernetes cluster inside Docker using the repo's script.

```bash
# From the repo root
bash scripts/create-kind-cluster.sh devops-course
```

**What you'll see:**

```
🚢 Creando clúster kind 'devops-course'...
Creating cluster "devops-course" ...
 ✓ Ensuring node image (kindest/node:v1.31.0) 🖼
 ✓ Preparing nodes 📦
 ✓ Writing configuration 📜
 ✓ Starting control-plane 🕹️
 ✓ Installing CNI 🔌
 ✓ Installing StorageClass 💾
Set kubectl context to "kind-devops-course"
🔎 Información del clúster:
Kubernetes control plane is running at https://127.0.0.1:NNNNN
✅ Clúster 'devops-course' listo.
```

**What happened?** kind created a **single-node** cluster inside a Docker container and pointed `kubectl` at it (context `kind-devops-course`).

### Step 2 — Confirm the node is ready

```bash
kubectl get nodes
```

**What you'll see:**

```
NAME                          STATUS   ROLES           AGE   VERSION
devops-course-control-plane   Ready    control-plane   45s   v1.31.0
```

**What happened?** The node shows up as `Ready`: the cluster is alive and ready to take workloads. If it says `NotReady`, give it a few seconds and check again.

### Step 3 — The classic error: deploying WITHOUT loading the image

Let's make the mistake almost everyone makes the first time, **on purpose**: applying the manifests before loading the image. That way you'll recognize it when it happens for real.

```bash
kubectl apply -f 05-kubernetes/namespace.yaml
kubectl apply -f 05-kubernetes/configmap.yaml
kubectl apply -f 05-kubernetes/secret-example.yaml
kubectl apply -f 05-kubernetes/deployment.yaml
kubectl apply -f 05-kubernetes/service.yaml
kubectl -n academia get pods
```

**What you'll see:**

```
NAME                            READY   STATUS             RESTARTS   AGE
academia-app-7c8f6d9b4-abcde    0/1     ImagePullBackOff   0          30s
academia-app-7c8f6d9b4-fghij    0/1     ImagePullBackOff   0          30s
```

If you look closer with `kubectl -n academia describe pod -l app=academia-app`, under *Events* you'll read something like:

```
Failed to pull image "academia-devops-app:1.0.0": ... pull access denied,
repository does not exist or may require authorization
```

**What happened?** The cluster **doesn't see your local Docker**. kind runs in its own containers and, not finding `academia-devops-app:1.0.0` in any remote registry, it tries to "pull" it from the internet and fails → `ImagePullBackOff`. **This is the most common error in the whole unit.** The fix is to load the local image into the cluster.

> 🧹 No need to delete anything: as soon as we load the image (Step 4), Kubernetes retries on its own and the pods start.

### Step 4 — Load the local image into the cluster

```bash
kind load docker-image academia-devops-app:1.0.0 --name devops-course
```

**What you'll see:**

```
Image: "academia-devops-app:1.0.0" with ID "sha256:7f3a9c2b..." not yet present on node "devops-course-control-plane", loading...
```

**What happened?** kind copied your local image **into** the cluster's node. Now `imagePullPolicy: IfNotPresent` (set in `deployment.yaml`) will find the image locally and **won't** try to pull it from the internet.

> 📦 **If you use minikube** (instead of kind), load the image like this:
> ```bash
> docker save academia-devops-app:1.0.0 -o img.tar
> minikube image load img.tar
> ```
> ⚠️ The direct command `minikube image load academia-devops-app:1.0.0` **sometimes fails to load**
> the image properly. That's why we use the `.tar`: it's the reliable method.

### Step 5 — Watch the pods start (2/2 Running)

After loading the image, Kubernetes retries the pull on its own. Wait a few seconds and check.

```bash
kubectl -n academia get pods
```

**What you'll see:**

```
NAME                            READY   STATUS    RESTARTS   AGE
academia-app-7c8f6d9b4-abcde    1/1     Running   0          2m
academia-app-7c8f6d9b4-fghij    1/1     Running   0          2m
```

**What happened?** The **2 pods** (we set `replicas: 2` in the Deployment) are now `Running` and `1/1` ready. The `ImagePullBackOff` vanished the moment the image was available. Counted together, that's **2/2 Running**.

> 💡 **Shortcut:** the script `bash scripts/deploy-k8s.sh devops-course` does all of steps 3–5 in one shot
> (loads the image, applies the 5 manifests, waits for the rollout). We did it by hand here to *see* the error.

### Step 6 — Confirm the rollout

```bash
kubectl -n academia rollout status deployment/academia-app
```

**What you'll see:**

```
deployment "academia-app" successfully rolled out
```

**What happened?** Kubernetes confirms that **all** desired replicas are available and healthy. This is the command you'd use in a pipeline to "wait" for a deployment to finish before continuing.

### Step 7 — Test the app with port-forward

The Service is `ClusterIP` (reachable only **inside** the cluster). To reach it from your machine, we open a tunnel with `port-forward`.

```bash
kubectl -n academia port-forward service/academia-app-service 8080:80
```

**What you'll see:**

```
Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080
```

Leave **that terminal open** and, in **another terminal**, hit the health endpoint:

```bash
curl http://localhost:8080/health
```

**What you'll see:**

```json
{"status":"UP","store":"memory","db":"ok","uptime_s":42}
```

**What happened?** Traffic traveled `localhost:8080` → Service (port 80) → container (port 8080) → app. The app replies `status: UP`. Notice `store: memory` and `db: ok`: this basic Deployment runs **without an external database**, using an in-memory store, which is why it reports healthy without Postgres.

## ✅ Checkpoint

You did it if:

- [ ] `kubectl get nodes` shows the node as **`Ready`**.
- [ ] You triggered and recognized an **`ImagePullBackOff`** before loading the image.
- [ ] `kubectl -n academia get pods` shows **2/2 Running**.
- [ ] `rollout status` said **`successfully rolled out`**.
- [ ] `curl http://localhost:8080/health` returned **`{"status":"UP",...}`**.

## 🧯 If something breaks

| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| `ImagePullBackOff` | Local image not loaded into the cluster | `kind load docker-image academia-devops-app:1.0.0 --name devops-course` |
| `ErrImagePull` / `pull access denied` | Same issue: the cluster looks on the internet | Load the local image (kind load / minikube image load) |
| `CrashLoopBackOff` | The container starts and dies | `kubectl -n academia logs <pod>` to see the error |
| `Pending` | No resources or schedulable node | `kubectl -n academia describe pod <pod>` and check *Events* |
| `0/2 Ready` for a long time | The app fails readiness | Verify `/health` returns 200 |
| `curl` won't connect | The `port-forward` isn't running | Keep the `port-forward` terminal open |
| Service doesn't respond | Selector doesn't match the labels | The Pod labels must equal the Service `selector` |
| `connection refused` when creating the cluster | Docker isn't running | Start Docker Desktop and retry |

## 🏆 Extra challenge

1. Scale to 4 replicas and watch the new pods:
   ```bash
   kubectl -n academia scale deployment academia-app --replicas=4
   kubectl -n academia get pods
   ```
2. Inspect the injected config and prove that **base64 is NOT encryption**:
   ```bash
   kubectl -n academia get configmap academia-config -o yaml
   kubectl -n academia get secret academia-secret -o jsonpath='{.data.DB_PASSWORD}' | base64 -d
   ```
3. Clean up when you're done:
   ```bash
   bash scripts/reset-lab.sh
   bash scripts/delete-kind-cluster.sh devops-course
   ```

## 🎓 How to teach it to your students

- **Trigger the error on purpose.** `ImagePullBackOff` is the most valuable teaching moment of the lab: let the group see it, ask "why can't it find the image?", and guide them to the "aha": *the cluster lives in another world, it doesn't see your local Docker*.
- **Draw the traffic path.** `localhost:8080 → Service:80 → container:8080`. If they get the Service's port hop, they get why `port-forward` maps `8080:80`.
- **Explain labels as glue.** The Deployment manages Pods by their `label app: academia-app`, and the Service routes to that same label. If they don't match, "everything is running" but nothing responds. It's a subtle, very teachable bug.
- **Use `store: memory`.** It's the perfect excuse to talk about *stateless* vs. *stateful* apps: this basic Deployment runs without a DB, which is why it scales to 4 replicas with no drama.
- **Close with the Secret.** The `base64 -d` revealing `academia` is a reality check: base64 is **encoding**, not **encryption**. This hooks the Sealed Secrets / Vault conversation in the next lab.

## ⏭️ Next

Your app now lives in Kubernetes. In **Lab 6 — Configuration and Secrets** you'll go deeper into ConfigMaps and
Secrets (and why base64 protects nothing), and in **Lab 7 — Scaling, updates, and rollback** you'll do
*rolling updates* and roll back when something goes wrong. See `05-kubernetes/comandos-kubectl.md`.
