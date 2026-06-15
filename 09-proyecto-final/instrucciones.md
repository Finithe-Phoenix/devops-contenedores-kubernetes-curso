# 🏛️ Lab 10 — Proyecto integrador final

> **Misión final:** demostrar el ciclo DevOps completo. **Recompensa:** +200 XP y la medalla 🏛️ *Arquitect@ DevOps*.

## El reto

En **equipos** (o individual), demuestra en ~5 minutos el flujo completo que construiste
durante el curso, usando la **Academia DevOps App** (o tu propia variante).

## Checklist de demostración

1. [ ] **Repositorio** versionado con git.
2. [ ] **Aplicación** corriendo en local.
3. [ ] **Dockerfile** que construye la imagen.
4. [ ] **Docker Compose** levantando app + base de datos.
5. [ ] **Pipeline** CI/CD en verde.
6. [ ] **Imagen** Docker construida.
7. [ ] **Manifiestos** Kubernetes aplicados.
8. [ ] **Deployment** corriendo en el clúster.
9. [ ] **Service** exponiendo la app (port-forward).
10. [ ] **Escalamiento** a varias réplicas.
11. [ ] **Logs** consultados.
12. [ ] **Escaneo** de imagen (Trivy).
13. [ ] **Monitoreo** básico (o explicación de monitoreo).
14. [ ] **Propuesta docente:** cómo adaptarlo a TU materia.

## La capa que hace diferente a este curso (Capa 4: aplicación docente)

No basta con que funcione. En tu entrega responde:

- ¿Cómo lo **explicarías** a tus alumnos?
- ¿Qué parte sirve como **práctica calificable**?
- ¿Qué **errores** comunes aparecerán y cómo los rescatas?
- ¿Qué **aprendizaje** se busca medir?
- ¿Qué **modificarías** para una materia específica (Programación, BD, Redes, Seguridad...)?

## Entrega

Usa la [plantilla de entrega](plantilla-entrega.md) y revisa la [rúbrica](rubrica.md) antes de presentar.

## Rutas de adaptación sugeridas por materia

| Materia | Enfoque del laboratorio |
| ------- | ----------------------- |
| Programación | Dockerizar el proyecto del semestre; "en mi máquina sí funciona" resuelto |
| Bases de Datos | Compose con la DB + persistencia + migraciones |
| Redes | Services, puertos, redes internas, DNS de servicios |
| Ingeniería de Software | Pipeline CI/CD como parte del proceso de entrega |
| Seguridad | DevSecOps: Trivy, secretos, securityContext |
| Sistemas Distribuidos | Réplicas, escalamiento, alta disponibilidad |
