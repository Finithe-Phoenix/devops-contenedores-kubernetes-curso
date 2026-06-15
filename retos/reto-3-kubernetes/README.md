> 🌐 [English](README.en.md) · **Español**

# 🕵️ Reto 3 — Kubernetes: el Service no responde

**Capa:** ☸️ Kubernetes · **Dificultad:** ★★★ · **Archivo roto:** [`k8s.yaml`](k8s.yaml)

## 🔬 Síntoma
Los pods están **`Running`**, pero el `port-forward` no responde y el Service **no tiene endpoints**:

```bash
kubectl -n academia get pods
# academia-app-...   1/1   Running

kubectl -n academia get endpoints academia-app-service
# NAME                    ENDPOINTS   AGE
# academia-app-service    <none>      30s      <- vacío: no enruta a ningún Pod
```

## 🎯 Tu misión
Hay **un solo bug**. Arréglalo y verifica que el Service ya tenga endpoints (IPs de los Pods).

## 🧭 Pistas
<details><summary>Pista 1</summary>
Un Service encuentra a sus Pods por <strong>labels</strong> (su <code>selector</code>). Compara el <code>selector</code> del Service con las <code>labels</code> del Pod.
</details>
<details><summary>Pista 2</summary>
El Service busca <code>app: academia</code>, pero el Pod tiene la label <code>app: academia-app</code>. ¿Son idénticas?
</details>

## ✅ Cómo verificar
```bash
kubectl create namespace academia 2>/dev/null
kubectl -n academia apply -f k8s.yaml
kubectl -n academia get endpoints academia-app-service   # -> ya con IPs
kubectl -n academia port-forward svc/academia-app-service 8080:80
# en otra terminal:  curl http://localhost:8080/health
```

## 💡 Solución
<details><summary>👀 Ver la solución</summary>

El `selector` del Service (`app: academia`) no coincide con las labels del Pod (`app: academia-app`).
En el Service, cámbialo por:

```yaml
selector:
  app: academia-app
```
</details>

## 🎓 Para tus alumnos
El Service es un **"router por etiquetas"**: si el `selector` no coincide con las labels de los Pods,
los endpoints quedan **vacíos** y no llega tráfico. Pregunta de clase:
*¿cómo sabe un Service a qué Pods enviar el tráfico?*
