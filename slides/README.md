> 🌐 [English](README.en.md) · **Español**

# 🎞️ Presentaciones e infografías

Tema oscuro tipo terminal/neón. Todo se genera **por código** (consistencia garantizada),
en **español e inglés**.

## 🧑‍🏫 Decks del instructor (uno por día)

| Español | English | Día |
| ------- | ------- | --- |
| `01_Dia_1_DevOps_Docker.pptx` | `01_Day_1_DevOps_Docker.pptx` | Fundamentos, Git, Docker |
| `02_Dia_2_Compose_CICD_DevSecOps.pptx` | `02_Day_2_Compose_CICD_DevSecOps.pptx` | Compose, CI/CD, DevSecOps |
| `03_Dia_3_Kubernetes_Helm.pptx` | `03_Day_3_Kubernetes_Helm.pptx` | Kubernetes, Helm |
| `04_Dia_4_Observabilidad_DevSecOps_Proyecto.pptx` | `04_Day_4_Observability_DevSecOps_Project.pptx` | Observabilidad, Proyecto |

## 🎓 Infografías para alumnos (listas para compartir)

| Español | English |
| ------- | ------- |
| `Infografias_Alumnos_ES.pptx` | `Student_Infographics_EN.pptx` |

**14 infografías** de una página cada una, ideales para compartir por chat o imprimir:
ciclo DevOps · imagen vs contenedor vs VM · cheat sheet de Docker · anatomía del Dockerfile ·
Docker Compose · pipeline CI/CD · arquitectura de Kubernetes · cheat sheet de kubectl ·
ConfigMap/Secret · Helm · DevSecOps · observabilidad · mapa de misiones · glosario.

## Regenerar / editar

```bash
cd slides
npm install            # solo la primera vez
node generate.js       # 8 decks del instructor (4 ES + 4 EN)
node infographics.js   # 2 decks de infografías (ES + EN)
```

> El diseño (colores, tipografías, layouts) vive en `lib.js`. El contenido bilingüe usa
> `tr("es", "en")` en `generate.js` e `infographics.js`, así ambos idiomas salen de una sola fuente.

## 📸 Sugerencia

Son una base sólida. La mejor mejora: agrégales **tus capturas reales** ejecutando los labs.
