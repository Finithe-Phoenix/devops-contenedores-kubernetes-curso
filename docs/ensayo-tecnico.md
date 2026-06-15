# 🧪 Ensayo técnico de punta a punta (M11)

> Corre TODO el curso desde cero, una vez, antes de pararte frente al grupo.
> Si esto funciona en tu laptop, el curso funcionará. Mide los tiempos y anótalos.

## 0. Pre-descargar imágenes (evita esperas en clase)

```bash
docker pull node:22-alpine
docker pull postgres:16-alpine
docker pull aquasec/trivy:latest
kind version && kubectl version --client && helm version
```

## 1. App en local (Lab 1) — meta: < 3 min

```bash
cd 01-app/node
npm ci
npm test                 # debe dar 8/8 verdes
npm start &              # http://localhost:8080
curl -s localhost:8080/health | grep UP
kill %1
cd ../..
```

## 2. Docker (Lab 1) — meta: < 4 min (primera vez más por la descarga)

```bash
bash scripts/build-image.sh 1.0.0
docker run -d -p 8080:8080 --name academia academia-devops-app:1.0.0
sleep 3 && curl -s localhost:8080/health | grep UP
docker rm -f academia
```

## 3. Compose (Lab 2) — meta: < 4 min

```bash
cd 03-compose
docker compose up -d --build
sleep 8
curl -s localhost:8080/health | grep postgres      # store debe ser postgres
curl -s -X POST localhost:8080/courses -H "Content-Type: application/json" \
  -d '{"code":"X-1","name":"Persistencia"}'
docker compose restart app && sleep 5
curl -s localhost:8080/courses | grep "X-1"          # el dato persiste
docker compose down -v
cd ..
```

## 4. CI/CD (Lab 3)

- Verifica en GitHub → pestaña **Actions** que el workflow está en verde.
- Ensaya: rompe un assert, push, observa rojo, revierte, observa verde.

## 5. Trivy (Lab 4) — meta: < 3 min

```bash
trivy image --severity CRITICAL,HIGH academia-devops-app:1.0.0
```

## 6. Kubernetes (Labs 5-7) — meta: < 10 min

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

## 7. Helm (Lab 8) — meta: < 5 min

```bash
helm lint ./06-helm/academia-app-chart
helm upgrade --install academia ./06-helm/academia-app-chart -n academia --create-namespace
helm upgrade academia ./06-helm/academia-app-chart -n academia --set replicaCount=3
helm history academia -n academia
```

## 8. Observabilidad (Lab 9) — meta: < 10 min (pesado)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
kubectl -n monitoring get pods         # espera Running (varios minutos)
# Grafana: ver 07-observability/prometheus-grafana.md
```

## 9. Limpieza total

```bash
helm uninstall monitoring -n monitoring 2>/dev/null || true
bash scripts/reset-lab.sh
bash scripts/delete-kind-cluster.sh devops-course
```

## Bitácora de tiempos (llénala en tu ensayo)

| Paso | Tiempo real | ¿Problemas? |
| ---- | ----------- | ----------- |
| App local | | |
| Docker | | |
| Compose | | |
| Trivy | | |
| Kubernetes | | |
| Helm | | |
| Observabilidad | | |

> Si un paso tarda demasiado o falla seguido → prepáralo como **demo proyectada** (Plan B)
> en lugar de lab en vivo.
