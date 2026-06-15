// routes/courses.js — Endpoints CRUD del recurso "courses".
// Recibe el repositorio por inyeccion para poder probarlo sin base de datos real.

import { Router } from 'express';

export function coursesRouter(repo) {
  const router = Router();

  // GET /courses — lista todos los cursos
  router.get('/', async (req, res, next) => {
    try {
      res.json(await repo.list());
    } catch (e) {
      next(e);
    }
  });

  // GET /courses/:id — obtiene un curso
  router.get('/:id', async (req, res, next) => {
    try {
      const course = await repo.get(req.params.id);
      if (!course) return res.status(404).json({ error: 'curso no encontrado' });
      res.json(course);
    } catch (e) {
      next(e);
    }
  });

  // POST /courses — crea un curso
  router.post('/', async (req, res, next) => {
    try {
      const { code, name, professor } = req.body ?? {};
      if (!code || !name) {
        return res.status(400).json({ error: 'los campos code y name son obligatorios' });
      }
      const course = await repo.create({ code, name, professor });
      res.status(201).json(course);
    } catch (e) {
      next(e);
    }
  });

  // DELETE /courses/:id — elimina un curso
  router.delete('/:id', async (req, res, next) => {
    try {
      const ok = await repo.remove(req.params.id);
      if (!ok) return res.status(404).json({ error: 'curso no encontrado' });
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  });

  return router;
}
