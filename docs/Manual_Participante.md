# 📘 Manual del Participante
## Curso-Taller: DevOps y Contenedores con Docker & Kubernetes

> Tu guía de bolsillo para los 4 días. Todo lo que necesitas, en orden.

---

## 1. Bienvenida

Durante 4 días tomaremos **una sola aplicación** y la acompañaremos por todo su ciclo de
vida moderno. Al final tendrás un laboratorio completo que podrás **reutilizar como práctica
con tus alumnos**. Y lo haremos jugando: cada laboratorio es una **misión** con XP y medallas
(ver [`gamificacion/`](../gamificacion/README.md)).

## 2. Requisitos

- Laptop con permisos de instalación (o WSL2 en Windows).
- Cuenta de GitHub.
- Ganas de romper cosas y arreglarlas. 🛠️

## 3. Instalación (prework)

Sigue [`00-prework/instalacion.md`](../00-prework/instalacion.md) y valida con:

```bash
bash scripts/check-env.sh
```

Si algo falla → [`00-prework/troubleshooting.md`](../00-prework/troubleshooting.md).

## 4. La aplicación del curso: "Academia DevOps App"

Una API REST mínima en Node.js. Lo importante no es la app, sino **todo lo que le hacemos**.

| Endpoint | Para qué |
| -------- | -------- |
| `/health` | ¿está viva y sana? |
| `/version` | versión (para rollbacks) |
| `/metrics` | métricas Prometheus |
| `/courses` | CRUD de cursos |

Detalle: [`01-app/node/README.md`](../01-app/node/README.md).

## 5. Mapa de los 4 días

| Día | Tema | Misiones |
| --- | ---- | -------- |
| 1 | Fundamentos, Git, Docker, Dockerfile | Lab 0, Lab 1 |
| 2 | Compose, CI/CD, DevSecOps básico | Lab 2, Lab 3, Lab 4 |
| 3 | Kubernetes, Config/Secrets, Escalar, Helm | Lab 5, Lab 6, Lab 7, Lab 8 |
| 4 | Observabilidad, DevSecOps, Proyecto final | Lab 9, Lab 10 |

## 6. Laboratorios (paso a paso)

| Lab | Guía |
| --- | ---- |
| 0 · Ambiente | [`00-prework/checklist-ambiente.md`](../00-prework/checklist-ambiente.md) |
| 1 · Docker | [`02-docker/comandos-docker.md`](../02-docker/comandos-docker.md) |
| 2 · Compose | [`03-compose/comandos-compose.md`](../03-compose/comandos-compose.md) |
| 3 · CI/CD | [`04-cicd/pipeline-explicado.md`](../04-cicd/pipeline-explicado.md) |
| 4 · DevSecOps | [`08-devsecops/trivy.md`](../08-devsecops/trivy.md) |
| 5-7 · Kubernetes | [`05-kubernetes/comandos-kubectl.md`](../05-kubernetes/comandos-kubectl.md) |
| 8 · Helm | [`06-helm/comparativa-yaml-vs-helm.md`](../06-helm/comparativa-yaml-vs-helm.md) |
| 9 · Observabilidad | [`07-observability/prometheus-grafana.md`](../07-observability/prometheus-grafana.md) |
| 10 · Proyecto final | [`09-proyecto-final/instrucciones.md`](../09-proyecto-final/instrucciones.md) |

## 7. Chuleta de comandos (cheat sheet)

```bash
# Git
git status / git add . / git commit -m "..." / git push

# Docker
docker build -t app:1.0.0 .
docker run -d -p 8080:8080 --name app app:1.0.0
docker ps / docker logs -f app / docker stop app / docker rm app

# Compose
docker compose up -d --build / docker compose ps / docker compose down -v

# Kubernetes
kubectl apply -f archivo.yaml
kubectl -n academia get pods,svc
kubectl -n academia logs -f deployment/academia-app
kubectl -n academia scale deployment academia-app --replicas=4
kubectl -n academia rollout undo deployment/academia-app

# Helm
helm install academia ./06-helm/academia-app-chart -n academia --create-namespace
helm upgrade academia ./06-helm/academia-app-chart -n academia --set replicaCount=4
helm rollback academia 1 -n academia

# Seguridad
trivy image academia-devops-app:1.0.0
```

## 8. Espacio para notas

```
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
```

## 9. Reto final y rúbrica

- Reto: [`09-proyecto-final/instrucciones.md`](../09-proyecto-final/instrucciones.md)
- Rúbrica: [`09-proyecto-final/rubrica.md`](../09-proyecto-final/rubrica.md)
- Plantilla de entrega: [`09-proyecto-final/plantilla-entrega.md`](../09-proyecto-final/plantilla-entrega.md)

## 10. Glosario

[`docs/Glosario.md`](Glosario.md) — todos los términos en lenguaje de clase.

---

> *"Un programa no termina cuando compila: debe poder probarse, empaquetarse, desplegarse,
> monitorearse y protegerse."*
