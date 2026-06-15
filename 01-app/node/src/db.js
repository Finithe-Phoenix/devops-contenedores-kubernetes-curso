// db.js — Capa de datos de la Academia DevOps App.
//
// IDEA DIDACTICA (12-factor / config por entorno):
//   - Si la variable DB_HOST esta definida  -> usa PostgreSQL  (Lab Compose / Kubernetes)
//   - Si NO esta definida                    -> usa un almacen en memoria (Lab Docker simple)
//
// Asi la MISMA imagen funciona sola (Lab 1) o con base de datos (Lab 2) cambiando
// solo variables de entorno. Ese es un mensaje central del curso.

import pg from 'pg';

const cursosSemilla = [
  { id: 1, code: 'DEVOPS-101', name: 'Fundamentos de DevOps', professor: 'Daniel Gonzalez' },
  { id: 2, code: 'DOCKER-201', name: 'Contenedores con Docker', professor: 'Daniel Gonzalez' },
  { id: 3, code: 'K8S-301', name: 'Orquestacion con Kubernetes', professor: 'Daniel Gonzalez' },
];

// --- Almacen en memoria (sin dependencias externas) ---
class InMemoryRepo {
  constructor() {
    this.courses = cursosSemilla.map((c) => ({ ...c }));
    this.nextId = this.courses.length + 1;
    this.kind = 'memory';
  }

  async init() {}

  async list() {
    return this.courses;
  }

  async get(id) {
    return this.courses.find((c) => c.id === Number(id)) ?? null;
  }

  async create({ code, name, professor }) {
    const course = { id: this.nextId++, code, name, professor: professor ?? null };
    this.courses.push(course);
    return course;
  }

  async remove(id) {
    const i = this.courses.findIndex((c) => c.id === Number(id));
    if (i === -1) return false;
    this.courses.splice(i, 1);
    return true;
  }

  async ping() {
    return true;
  }
}

// --- Almacen en PostgreSQL ---
class PostgresRepo {
  constructor(config) {
    this.pool = new pg.Pool(config);
    this.kind = 'postgres';
  }

  async init() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id        SERIAL PRIMARY KEY,
        code      TEXT NOT NULL,
        name      TEXT NOT NULL,
        professor TEXT
      )`);
    const { rows } = await this.pool.query('SELECT COUNT(*)::int AS n FROM courses');
    if (rows[0].n === 0) {
      for (const c of cursosSemilla) {
        await this.pool.query(
          'INSERT INTO courses (code, name, professor) VALUES ($1, $2, $3)',
          [c.code, c.name, c.professor],
        );
      }
    }
  }

  async list() {
    const { rows } = await this.pool.query(
      'SELECT id, code, name, professor FROM courses ORDER BY id',
    );
    return rows;
  }

  async get(id) {
    const { rows } = await this.pool.query(
      'SELECT id, code, name, professor FROM courses WHERE id = $1',
      [Number(id)],
    );
    return rows[0] ?? null;
  }

  async create({ code, name, professor }) {
    const { rows } = await this.pool.query(
      'INSERT INTO courses (code, name, professor) VALUES ($1, $2, $3) RETURNING id, code, name, professor',
      [code, name, professor ?? null],
    );
    return rows[0];
  }

  async remove(id) {
    const { rowCount } = await this.pool.query('DELETE FROM courses WHERE id = $1', [Number(id)]);
    return rowCount > 0;
  }

  async ping() {
    await this.pool.query('SELECT 1');
    return true;
  }
}

export function createRepo(env = process.env) {
  if (env.DB_HOST) {
    return new PostgresRepo({
      host: env.DB_HOST,
      port: Number(env.DB_PORT ?? 5432),
      database: env.DB_NAME ?? 'academia',
      user: env.DB_USER ?? 'academia',
      password: env.DB_PASSWORD ?? 'academia',
      max: 5,
    });
  }
  return new InMemoryRepo();
}
