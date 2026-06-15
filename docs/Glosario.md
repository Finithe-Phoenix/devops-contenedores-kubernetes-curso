# 📖 Glosario del curso

Definiciones cortas, en lenguaje de clase.

## DevOps y entrega
- **DevOps:** cultura + prácticas que unen desarrollo y operación para entregar software rápido y confiable.
- **CI (Integración Continua):** construir y probar cada cambio automáticamente.
- **CD (Entrega/Despliegue Continuo):** llevar la versión probada a un ambiente de forma automática.
- **Pipeline:** la secuencia automatizada de pasos (build, test, scan, deploy).
- **Stage / Job / Step:** etapa / trabajo en una máquina / paso individual de un pipeline.
- **Runner:** la máquina (efímera) que ejecuta el pipeline.
- **Build:** compilar/empacar el código en un artefacto ejecutable.
- **Artifact:** el resultado del build (un .jar, una imagen, un paquete).
- **SRE:** Site Reliability Engineering; operar con prácticas de ingeniería (SLOs, automatización).

## Contenedores
- **Container (contenedor):** proceso aislado que corre una imagen; instancia en ejecución.
- **Image (imagen):** plantilla inmutable con app + dependencias; se construye con `docker build`.
- **Dockerfile:** receta para construir una imagen.
- **Registry:** repositorio de imágenes (Docker Hub, GHCR).
- **Volume (volumen):** almacenamiento persistente para datos del contenedor.
- **Network (red):** cómo se comunican los contenedores entre sí.
- **Docker Compose:** define y levanta apps multicontenedor con un archivo YAML.

## Kubernetes
- **Kubernetes (K8s):** orquestador de contenedores (los despliega, escala y sana).
- **Cluster (clúster):** conjunto de máquinas (nodos) gestionadas por Kubernetes.
- **Node (nodo):** una máquina del clúster.
- **Control plane:** el "cerebro" que decide y mantiene el estado deseado.
- **Pod:** la unidad mínima desplegable; envuelve uno o más contenedores.
- **Deployment:** gestiona réplicas de Pods y actualizaciones (rolling updates).
- **ReplicaSet:** garantiza N copias de un Pod (lo crea el Deployment).
- **Service:** punto de acceso estable a un grupo de Pods (ClusterIP/NodePort/LoadBalancer).
- **Namespace:** división lógica del clúster para aislar recursos.
- **ConfigMap:** configuración NO sensible inyectada a los Pods.
- **Secret:** datos sensibles (¡base64 no es cifrado!).
- **Ingress:** enrutamiento HTTP de entrada al clúster (concepto avanzado).
- **Probe (liveness/readiness):** chequeos de salud que Kubernetes usa para reiniciar/enrutar.

## Helm y empaquetado
- **Helm:** "gestor de paquetes" de Kubernetes.
- **Chart:** paquete de plantillas de Kubernetes.
- **Template:** manifiesto parametrizado.
- **Values:** los parámetros del chart (`values.yaml`).
- **Release:** una instalación concreta de un chart en el clúster.

## Observabilidad
- **Observability:** capacidad de entender el estado del sistema desde fuera.
- **Logs:** registro de eventos (qué pasó).
- **Metrics (métricas):** medidas numéricas en el tiempo (CPU, latencia...).
- **Traces (trazas):** el recorrido de una petición entre servicios.
- **Prometheus:** recolecta y almacena métricas (scraping).
- **Grafana:** visualiza métricas en dashboards.

## DevSecOps e IaC
- **DevSecOps:** integrar seguridad en todo el ciclo, no al final.
- **Shift-left:** mover la seguridad a etapas tempranas.
- **Vulnerability scan:** búsqueda de vulnerabilidades conocidas (CVEs).
- **Secret scanning:** detección de secretos filtrados en código/imágenes.
- **GitOps:** el estado deseado vive en git; una herramienta sincroniza el clúster (Argo CD, Flux).
- **IaC (Infraestructura como Código):** definir infraestructura en archivos versionados.
- **Terraform:** *provisiona* infraestructura (crea recursos).
- **Ansible:** *configura* y automatiza servidores.
