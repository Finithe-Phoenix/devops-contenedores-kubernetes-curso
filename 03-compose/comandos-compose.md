> 🌐 [English](comandos-compose.en.md) · **Español**

# 🧩 Lab 2 — Docker Compose: app + base de datos

> **Misión:** levantar la app CON su base de datos en un solo comando.
> **Recompensa:** +120 XP y la medalla 🧩 *Maestro Multicontenedor*.

## Levantar todo

```bash
# Desde 03-compose/
docker compose up -d --build

docker compose ps                 # estado de los servicios
docker compose logs -f app        # logs de la app
docker compose logs db            # logs de la base de datos
```

## Probar que la app habla con PostgreSQL

```bash
curl http://localhost:8080/health
# Debe responder:  "store":"postgres" , "db":"ok"

curl http://localhost:8080/courses

# Crea un curso... y verifica que PERSISTE tras reiniciar
curl -X POST http://localhost:8080/courses \
  -H "Content-Type: application/json" \
  -d '{"code":"REDES-101","name":"Redes de Computadoras","professor":"Vint Cerf"}'
```

## La demostración estrella: persistencia

```bash
docker compose restart app        # reinicia SOLO la app
curl http://localhost:8080/courses # 👈 el curso nuevo SIGUE ahí (vive en el volumen de la DB)
```

## Apagar

```bash
docker compose down               # detiene y borra contenedores (CONSERVA el volumen)
docker compose down -v            # 👈 además BORRA el volumen (datos en cero)
```

## Conceptos clave que se "ven" en este lab

- **Red interna:** la app encuentra a la base de datos por su nombre de servicio (`db`), no por IP.
- **`depends_on: condition: service_healthy`:** la app espera a que Postgres esté **sano**.
- **Volumen `db_data`:** los datos sobreviven a `down`/`up`; solo `down -v` los borra.
- **Mismas imágenes, distinta config:** la app no cambió; solo le dimos `DB_HOST`.

## ❗ Troubleshooting

| Síntoma | Causa | Solución |
| ------- | ----- | -------- |
| `/health` dice `"db":"down"` | La app arrancó antes que la DB | Ya lo evitamos con `condition: service_healthy`; revisa credenciales |
| `port 5432 already allocated` | Tienes un PostgreSQL local corriendo | Apágalo o quita el `ports:` del servicio `db` |
| Datos "viejos" que no esperabas | El volumen persistió | `docker compose down -v` para empezar limpio |
| `app` no resuelve `db` | Error de tipeo en `DB_HOST` | Debe ser exactamente el nombre del servicio (`db`) |
