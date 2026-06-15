# 🎞️ Slides del curso

4 presentaciones (una por día), tema oscuro tipo terminal/neón.

| Archivo | Día |
| ------- | --- |
| `01_Dia_1_DevOps_Docker.pptx` | Fundamentos, Git, Docker, Dockerfile |
| `02_Dia_2_Compose_CICD_DevSecOps.pptx` | Compose, CI/CD, DevSecOps básico |
| `03_Dia_3_Kubernetes_Helm.pptx` | Kubernetes, Config/Secrets, Escalar, Helm |
| `04_Dia_4_Observabilidad_DevSecOps_Proyecto.pptx` | Observabilidad, DevSecOps, Proyecto final |

## Son una base sólida para expandir

Cubren los conceptos clave, diagramas, comandos y preguntas detonadoras de cada día.
Pensadas para que les **agregues tus capturas** (de tu laptop ejecutando los labs) y las
adaptes a tu estilo.

## Regenerar / editar

Las slides se generan por código (consistencia garantizada). Para modificarlas, edita
`generate.js` y vuelve a correr:

```bash
cd slides
npm install      # solo la primera vez
node generate.js # regenera los 4 .pptx
```

> El diseño (colores, tipografías, layouts) vive en las primeras ~110 líneas de `generate.js`.
