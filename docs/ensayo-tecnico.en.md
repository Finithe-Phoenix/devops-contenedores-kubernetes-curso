> 🌐 **English** · [Español](ensayo-tecnico.md)

# 🧪 End-to-end technical rehearsal (M11)

> Run the WHOLE course from scratch, once, before you stand in front of the group.
> If this works on your laptop, the course will work. Measure the times and write them down.

## 0. Pre-download images (avoid waits in class)

```bash
docker pull node:22-alpine
docker pull postgres:16-alpine
docker pull aquasec/trivy:latest
kind version && kubectl version --client && helm version
```

## 1. App locally (Lab 1) — goal: < 3 min

```bash
cd 01-app/node
npm ci
npm test                 # should be 8/8 green
npm start &              # http://localhost:8080
curl -s localhost:8080/health | grep UP
kill %1
cd ../..
```

## 2. Docker (Lab 1) — goal: < 4 min (first time longer due to the download)

```bash
bash scripts/build-image.sh 1.0.0
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0
sleep 3 && curl -s localhost:8080/health | grep UP
docker rm -f academia
```

## 3. Compose (Lab 2) — goal: < 4 min

```bash
cd 03-compose
docker compose up -d --build
sleep 8
curl -s localhost:8080/health | grep postgres      # store should be postgres
curl -s -X POST localhost:8080/courses -H "Content-Type: application/json" \
  -d '{"code":"X-1","name":"Persistencia"}'
docker compose restart app && sleep 5
curl -s localhost:8080/courses | grep "X-1"          # the data persists
docker compose down -v
cd ..
```

## 4. CI/CD (Lab 3)

- Verify in GitHub → **Actions** tab that the workflow is green.
- Rehearse: break an assert, push, watch it go red, revert, watch it go green.

## 5. Trivy (Lab 4) — goal: < 3 min

```bash
trivy image --severity CRITICAL,HIGH academia-devops-app:1.0.0
```

## 6. Kubernetes (Labs 5-7) — goal: < 10 min

```bash
bash scripts/create-kind-cluster.sh devops-course
bash scripts/build-image.sh 1.0.0
bash scripts/deploy-k8s.sh devops-course
kubectl -n academia get pods           # 2/2 Running
kubectl -n academia port-forward svc/academia-app-service 8080:80 &
sleep 3 && curl -s localhost:8080/health | grep UP
kill %1
kubectl -n academia scale deployment academia-app --replicas=4
kubectl -n academia get pods           # 4 pods
kubectl -n academia rollout undo deployment/academia-app
```

## 7. Helm (Lab 8) — goal: < 5 min

```bash
helm lint ./06-helm/academia-app-chart
helm upgrade --install academia ./06-helm/academia-app-chart -n academia --create-namespace
helm upgrade academia ./06-helm/academia-app-chart -n academia --set replicaCount=3
helm history academia -n academia
```

## 8. Observability (Lab 9) — goal: < 10 min (heavy)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
kubectl -n monitoring get pods         # wait for Running (several minutes)
# Grafana: see 07-observability/prometheus-grafana.md
```

## 9. Full cleanup

```bash
helm uninstall monitoring -n monitoring 2>/dev/null || true
bash scripts/reset-lab.sh
bash scripts/delete-kind-cluster.sh devops-course
```

## Time log (fill it in during your rehearsal)

| Step | Actual time | Problems? |
| ---- | ----------- | ----------- |
| Local app | | |
| Docker | | |
| Compose | | |
| Trivy | | |
| Kubernetes | | |
| Helm | | |
| Observability | | |

> If a step takes too long or fails repeatedly → prepare it as a **projected demo** (Plan B)
> instead of a live lab.
