# 🎁 Lab 8 — Helm: YAML manual vs Helm

> **Misión:** empaquetar el despliegue con Helm. **Recompensa:** +100 XP y la medalla 🎁 *Empaquetador Helm*.

## El problema que resuelve Helm

Con YAML manual, para tener 3 ambientes (dev/qa/prod) terminas **copiando y pegando**
los mismos manifiestos y cambiando valores a mano. Helm los convierte en una **plantilla
parametrizable**: un solo chart, muchos despliegues, con `values.yaml`.

| | YAML manual | Helm |
| --- | ----------- | ---- |
| Cambiar réplicas en 3 ambientes | Editar 3 archivos | `--set replicaCount=N` |
| Instalar todo | `kubectl apply -f` (uno por uno) | `helm install` (todo junto) |
| Actualizar | aplicar y rezar | `helm upgrade` (versionado) |
| Volver atrás | manual | `helm rollback` (1 comando) |
| Reutilizar | copiar/pegar | un chart, muchos `values` |

## Usar NUESTRO chart

```bash
# Desde la raíz del repo (requiere clúster kind + imagen cargada, ver Lab 5)
helm install academia ./06-helm/academia-app-chart -n academia --create-namespace

helm list -n academia
kubectl -n academia get all
```

Probar:

```bash
kubectl -n academia port-forward svc/academia-app-service 8080:80
curl http://localhost:8080/health
```

## La demostración estrella: cambiar valores sin tocar plantillas

```bash
# Escalar a 4 réplicas SIN editar ningún YAML
helm upgrade academia ./06-helm/academia-app-chart -n academia --set replicaCount=4
kubectl -n academia get pods           # 👈 ahora hay 4

# Ver el historial de versiones del release
helm history academia -n academia

# Rollback a la primera versión
helm rollback academia 1 -n academia
```

## Estructura del chart

```text
academia-app-chart/
├── Chart.yaml           # metadatos (nombre, versión del chart y de la app)
├── values.yaml          # los parámetros (réplicas, imagen, recursos...)
└── templates/
    ├── _helpers.tpl     # funciones reutilizables (nombres, labels)
    ├── configmap.yaml   # plantilla del ConfigMap
    ├── deployment.yaml  # plantilla del Deployment
    ├── service.yaml     # plantilla del Service
    └── NOTES.txt        # mensaje que Helm muestra tras instalar
```

## Validar el chart sin desplegar

```bash
helm lint ./06-helm/academia-app-chart
helm template academia ./06-helm/academia-app-chart      # renderiza el YAML final
```

## Limpiar

```bash
helm uninstall academia -n academia
```

**Pregunta docente:** ¿cuándo conviene Helm sobre YAML manual? (Pista: número de ambientes y frecuencia de cambios.)
