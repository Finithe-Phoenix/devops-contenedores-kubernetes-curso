> 🌐 **English** · [Español](README.md)

# 🕵️ Challenge 3 — Kubernetes: the Service returns nothing

**Layer:** ☸️ Kubernetes · **Difficulty:** ★★★ · **Broken file:** [`k8s.yaml`](k8s.yaml)

## 🔬 Symptom
The pods are **`Running`**, but `port-forward` returns nothing and the Service **has no endpoints**:

```bash
kubectl -n academia get pods
# academia-app-...   1/1   Running

kubectl -n academia get endpoints academia-app-service
# NAME                    ENDPOINTS   AGE
# academia-app-service    <none>      30s      <- empty: routes to no Pod
```

## 🎯 Your mission
There is **exactly one bug**. Fix it and verify the Service now has endpoints (the Pods' IPs).

## 🧭 Hints
<details><summary>Hint 1</summary>
A Service finds its Pods by <strong>labels</strong> (its <code>selector</code>). Compare the Service's <code>selector</code> with the Pod's <code>labels</code>.
</details>
<details><summary>Hint 2</summary>
The Service looks for <code>app: academia</code>, but the Pod has the label <code>app: academia-app</code>. Are they identical?
</details>

## ✅ How to verify
```bash
kubectl create namespace academia 2>/dev/null
kubectl -n academia apply -f k8s.yaml
kubectl -n academia get endpoints academia-app-service   # -> now has IPs
kubectl -n academia port-forward svc/academia-app-service 8080:80
# in another terminal:  curl http://localhost:8080/health
```

## 💡 Solution
<details><summary>👀 Show the solution</summary>

The Service's `selector` (`app: academia`) doesn't match the Pod's labels (`app: academia-app`).
In the Service, change it to:

```yaml
selector:
  app: academia-app
```
</details>

## 🎓 For your students
A Service is a **"label router"**: if the `selector` doesn't match the Pods' labels, its endpoints
stay **empty** and no traffic arrives. Class question:
*how does a Service know which Pods to send traffic to?*
