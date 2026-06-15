> 🌐 **English** · [Español](Glosario.md)

# 📖 Course glossary

Short definitions, in classroom language.

## DevOps and delivery
- **DevOps:** culture + practices that unite development and operations to deliver software fast and reliably.
- **CI (Continuous Integration):** building and testing every change automatically.
- **CD (Continuous Delivery/Deployment):** automatically taking the tested version to an environment.
- **Pipeline:** the automated sequence of steps (build, test, scan, deploy).
- **Stage / Job / Step:** stage / work on one machine / individual step of a pipeline.
- **Runner:** the (ephemeral) machine that runs the pipeline.
- **Build:** compiling/packaging the code into an executable artifact.
- **Artifact:** the result of the build (a .jar, an image, a package).
- **SRE:** Site Reliability Engineering; operating with engineering practices (SLOs, automation).

## Containers
- **Container:** isolated process that runs an image; a running instance.
- **Image:** immutable template with app + dependencies; built with `docker build`.
- **Dockerfile:** recipe to build an image.
- **Registry:** image repository (Docker Hub, GHCR).
- **Volume:** persistent storage for the container's data.
- **Network:** how containers communicate with each other.
- **Docker Compose:** defines and brings up multi-container apps with a YAML file.

## Kubernetes
- **Kubernetes (K8s):** container orchestrator (deploys, scales and heals them).
- **Cluster:** set of machines (nodes) managed by Kubernetes.
- **Node:** a machine in the cluster.
- **Control plane:** the "brain" that decides and maintains the desired state.
- **Pod:** the smallest deployable unit; wraps one or more containers.
- **Deployment:** manages Pod replicas and updates (rolling updates).
- **ReplicaSet:** guarantees N copies of a Pod (created by the Deployment).
- **Service:** stable access point to a group of Pods (ClusterIP/NodePort/LoadBalancer).
- **Namespace:** logical division of the cluster to isolate resources.
- **ConfigMap:** NON-sensitive configuration injected into Pods.
- **Secret:** sensitive data (base64 is not encryption!).
- **Ingress:** inbound HTTP routing into the cluster (advanced concept).
- **Probe (liveness/readiness):** health checks Kubernetes uses to restart/route.

## Helm and packaging
- **Helm:** Kubernetes' "package manager".
- **Chart:** a package of Kubernetes templates.
- **Template:** a parameterized manifest.
- **Values:** the chart's parameters (`values.yaml`).
- **Release:** a concrete installation of a chart in the cluster.

## Observability
- **Observability:** the ability to understand the state of the system from the outside.
- **Logs:** record of events (what happened).
- **Metrics:** numeric measurements over time (CPU, latency...).
- **Traces:** the journey of a request between services.
- **Prometheus:** collects and stores metrics (scraping).
- **Grafana:** visualizes metrics in dashboards.

## DevSecOps and IaC
- **DevSecOps:** integrating security across the whole cycle, not at the end.
- **Shift-left:** moving security to early stages.
- **Vulnerability scan:** searching for known vulnerabilities (CVEs).
- **Secret scanning:** detecting leaked secrets in code/images.
- **GitOps:** the desired state lives in git; a tool syncs the cluster (Argo CD, Flux).
- **IaC (Infrastructure as Code):** defining infrastructure in versioned files.
- **Terraform:** *provisions* infrastructure (creates resources).
- **Ansible:** *configures* and automates servers.
