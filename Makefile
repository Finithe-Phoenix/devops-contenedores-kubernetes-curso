# Makefile — atajos del curso DevOps y Contenedores.
# Linux/macOS/WSL:  make <objetivo>.   En Windows, copia el comando equivalente.
# Ejecuta `make` o `make help` para ver todos los objetivos.

IMAGE ?= academia-devops-app:1.0.0
CLUSTER ?= devops-course

.DEFAULT_GOAL := help

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

clase: ## Enciende TODO para la clase (app + Centro de Mando)
	bash scripts/clase.sh

check: ## Lab 0 — valida el ambiente
	bash scripts/check-env.sh

install: ## Instala dependencias de la app (npm)
	cd 01-app/node && npm install

test: ## Corre las pruebas de la app
	cd 01-app/node && npm test

docker: ## Lab 1 — construye la imagen
	bash scripts/build-image.sh 1.0.0

run: docker ## Lab 1 — corre el contenedor (UI en http://localhost:8080)
	docker run -d -p 8080:8080 --name academia $(IMAGE)
	@echo "Abre http://localhost:8080/"

compose: ## Lab 2 — app + PostgreSQL con Docker Compose
	docker compose -f 03-compose/docker-compose.yml up -d --build

compose-down: ## Apaga Compose y borra el volumen
	docker compose -f 03-compose/docker-compose.yml down -v

kind: ## Lab 5 — crea el clúster local (kind)
	bash scripts/create-kind-cluster.sh $(CLUSTER)

deploy: ## Lab 5 — despliega en Kubernetes
	bash scripts/deploy-k8s.sh $(CLUSTER)

helm: ## Lab 8 — instala con Helm
	helm install academia ./06-helm/academia-app-chart -n academia --create-namespace

scan: ## Lab 4 — escanea la imagen con Trivy
	trivy image $(IMAGE)

clean: ## Reinicia el laboratorio (borra namespace y contenedor)
	bash scripts/reset-lab.sh

clean-all: clean ## Limpieza total: también borra el clúster kind
	bash scripts/delete-kind-cluster.sh $(CLUSTER)

.PHONY: help clase check install test docker run compose compose-down kind deploy helm scan clean clean-all
