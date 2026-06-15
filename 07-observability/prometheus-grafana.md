> 🌐 [English](prometheus-grafana.en.md) · **Español**

# 🔭 Lab 9 — Observabilidad con Prometheus y Grafana

> **Misión:** observar la app y el clúster. **Recompensa:** +90 XP y la medalla 🔭 *Observador*.

## Los 3 pilares de la observabilidad

| Pilar | Responde a... | En este curso |
| ----- | ------------- | ------------- |
| **Logs** | ¿Qué pasó exactamente? | `kubectl logs` ([logs.md](logs.md)) |
| **Métricas** | ¿Cómo se comporta en el tiempo? | `/metrics` + Prometheus |
| **Trazas** | ¿Por dónde pasó una petición? | concepto (avanzado) |

> Nuestra app ya expone métricas en `/metrics` (Prometheus las "raspa" de ahí).

## Instalar el stack (Helm) — ruta simplificada

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

kubectl -n monitoring get pods       # espera a que TODOS estén Running (tarda unos minutos)
```

## Entrar a Grafana

```bash
# Usuario por defecto: admin
kubectl -n monitoring get secret monitoring-grafana \
  -o jsonpath='{.data.admin-password}' | base64 -d ; echo

kubectl -n monitoring port-forward svc/monitoring-grafana 3000:80
# Abre http://localhost:3000  (admin / <la contraseña de arriba>)
```

Dentro de Grafana ya vienen dashboards listos: **CPU, memoria, estado de Pods, red**.

## Qué monitorear (y por qué)

| Métrica | Por qué importa |
| ------- | --------------- |
| CPU / memoria | Saturación → lentitud o reinicios (OOMKilled) |
| Estado de Pods | ¿Reinicios? ¿CrashLoop? |
| Latencia | Experiencia del usuario |
| Errores (5xx) | ¿Algo se rompió? |
| Disponibilidad | ¿Está arriba? |

## ❗ Troubleshooting

| Síntoma | Solución |
| ------- | -------- |
| Pods de monitoring en `Pending` mucho rato | Falta RAM en el clúster kind; cierra apps o dale más recursos a Docker |
| `port 3000 ocupado` | Usa otro: `port-forward svc/monitoring-grafana 3001:80` |
| No carga el dashboard | Espera: kube-prometheus-stack tarda en levantar todo |

> ⚠️ **Plan B (equipos modestos):** si el stack no levanta, usa solo `/metrics` de la app
> + `kubectl top pods` y explica los dashboards con capturas. El aprendizaje se logra igual.

## Limpiar

```bash
helm uninstall monitoring -n monitoring
```
