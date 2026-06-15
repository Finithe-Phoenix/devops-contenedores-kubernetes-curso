// Pruebas de la Academia DevOps App usando el runner nativo de Node (node --test).
// Se ejecutan contra el almacen en memoria, sin necesidad de base de datos.

import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createRepo } from '../src/db.js';

describe('Academia DevOps App (almacen en memoria)', () => {
  let app;

  before(async () => {
    const repo = createRepo({}); // sin DB_HOST -> InMemoryRepo
    await repo.init();
    app = createApp(repo);
  });

  test('GET /health responde UP', async () => {
    const res = await request(app).get('/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'UP');
    assert.equal(res.body.store, 'memory');
  });

  test('GET /version expone nombre y version', async () => {
    const res = await request(app).get('/version');
    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'academia-devops-app');
    assert.ok(res.body.version);
  });

  test('GET /courses devuelve la lista semilla', async () => {
    const res = await request(app).get('/courses');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 3);
  });

  test('POST /courses crea un curso', async () => {
    const res = await request(app)
      .post('/courses')
      .send({ code: 'TEST-999', name: 'Curso de prueba', professor: 'QA' });
    assert.equal(res.status, 201);
    assert.equal(res.body.code, 'TEST-999');
    assert.ok(res.body.id);
  });

  test('POST /courses sin campos obligatorios responde 400', async () => {
    const res = await request(app).post('/courses').send({ name: 'sin codigo' });
    assert.equal(res.status, 400);
  });

  test('GET /courses/:id inexistente responde 404', async () => {
    const res = await request(app).get('/courses/99999');
    assert.equal(res.status, 404);
  });

  test('DELETE /courses/:id elimina un curso', async () => {
    const creado = await request(app)
      .post('/courses')
      .send({ code: 'DEL-1', name: 'Para borrar' });
    const id = creado.body.id;

    const del = await request(app).delete(`/courses/${id}`);
    assert.equal(del.status, 204);

    const despues = await request(app).get(`/courses/${id}`);
    assert.equal(despues.status, 404);
  });

  test('GET /metrics expone metricas en formato Prometheus', async () => {
    const res = await request(app).get('/metrics');
    assert.equal(res.status, 200);
    assert.match(res.text, /http_requests_total/);
  });
});
