# Reto 1 — este Dockerfile tiene UN bug. Constrúyelo, córrelo y arréglalo.
# (El código real de la app está en ../../01-app/node)
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./app
EXPOSE 8080
CMD ["node", "src/server.js"]
