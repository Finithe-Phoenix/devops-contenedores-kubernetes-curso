# syntax=docker/dockerfile:1
# ------------------------------------------------------------
#  Academia DevOps App — Dockerfile multi-stage (buenas practicas)
#  Este es el Dockerfile "bueno". Comparalo con 02-docker/Dockerfile.insecure
# ------------------------------------------------------------

# Etapa 1: instalar SOLO dependencias de produccion (build reproducible con npm ci)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Etapa 2: imagen final, ligera y sin herramientas de build
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Traer solo lo necesario desde la etapa anterior y el codigo fuente
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

EXPOSE 8080

# Buenas practicas de seguridad: correr como usuario sin privilegios.
# La imagen node:alpine ya incluye el usuario 'node'.
USER node

# Healthcheck nativo de Docker: usa el endpoint /health de la app.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:8080/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
