// server.js — Punto de entrada: crea el repositorio, lo inicializa y escucha el puerto.

import { createApp, VERSION } from './app.js';
import { createRepo } from './db.js';

const PORT = Number(process.env.PORT ?? 8080);

async function main() {
  const repo = createRepo();
  try {
    await repo.init();
    console.log(`[academia] repositorio listo: ${repo.kind}`);
  } catch (err) {
    // En modo memoria nunca falla. En Postgres seguimos vivos para que /health
    // reporte "db: down" en lugar de tumbar el contenedor en el arranque.
    console.error(`[academia] no se pudo inicializar el repositorio (${repo.kind}): ${err.message}`);
  }

  const app = createApp(repo);
  app.listen(PORT, () => {
    console.log(`[academia] Academia DevOps App v${VERSION} escuchando en http://0.0.0.0:${PORT}`);
  });
}

main();
