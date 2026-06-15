// app.js — Construye la aplicacion Express (sin arrancar el servidor).
// Separar "crear app" de "escuchar puerto" permite probarla con supertest.

import express from 'express';
import client from 'prom-client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { coursesRouter } from './routes/courses.js';

export const VERSION = process.env.APP_VERSION ?? '1.0.0';
const ARRANQUE = Date.now();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

export function createApp(repo) {
  const app = express();
  app.use(express.json());

  // --- Frontend estatico (la UI visual del curso, en public/) ---
  app.use(express.static(PUBLIC_DIR));

  // --- Metricas Prometheus (se usaran en el dia de Observabilidad) ---
  const registry = new client.Registry();
  client.collectDefaultMetrics({ register: registry });
  const httpRequests = new client.Counter({
    name: 'http_requests_total',
    help: 'Total de peticiones HTTP atendidas',
    labelNames: ['method', 'route', 'status'],
    registers: [registry],
  });
  app.use((req, res, next) => {
    res.on('finish', () => {
      httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode });
    });
    next();
  });

  // --- Endpoints de plataforma ---

  // GET /health — ¿la app esta viva y puede hablar con su almacen?
  app.get('/health', async (req, res) => {
    let db = 'n/a';
    try {
      await repo.ping();
      db = 'ok';
    } catch {
      db = 'down';
    }
    const healthy = db !== 'down';
    res.status(healthy ? 200 : 503).json({
      status: healthy ? 'UP' : 'DOWN',
      store: repo.kind,
      db,
      uptime_s: Math.round((Date.now() - ARRANQUE) / 1000),
    });
  });

  // GET /version — para demostrar rolling updates y rollback en Kubernetes
  app.get('/version', (req, res) => {
    res.json({ name: 'academia-devops-app', version: VERSION, node: process.version });
  });

  // GET /metrics — formato de exposicion de Prometheus
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', registry.contentType);
    res.end(await registry.metrics());
  });

  // --- Recurso de negocio ---
  app.use('/courses', coursesRouter(repo));

  // GET /api — portada JSON (la UI vive en / via public/index.html)
  app.get('/api', (req, res) => {
    res.json({
      app: 'Academia DevOps App',
      mensaje: 'Bienvenido al laboratorio del curso DevOps y Contenedores con Docker & Kubernetes',
      version: VERSION,
      ui: '/',
      endpoints: ['/health', '/version', '/metrics', '/courses'],
    });
  });

  return app;
}
