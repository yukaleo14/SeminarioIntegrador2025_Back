# SeminarioIntegrador2025 — Backend

Backend de una aplicación de pedidos de comida a domicilio, desarrollado con **NestJS**, **MySQL 8** y **Prisma ORM**. Todo el entorno de desarrollo corre en Docker; no se requiere Node.js instalado localmente.

## Requisitos previos

- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)

---

## Levantar el entorno

### Primera vez (o luego de borrar los volúmenes)

```bash
docker compose up -d --build
```

Esto:
1. Levanta MySQL y crea la base de datos `nestdb`
2. Construye la imagen de la aplicación
3. Ejecuta las migraciones de Prisma (`prisma migrate deploy`)
4. Carga los datos iniciales (`prisma db seed`)
5. Inicia el servidor en modo desarrollo con hot reload

La API queda disponible en `http://localhost:3000/openapi` (Swagger UI).

### Usos frecuentes

```bash
# Iniciar contenedores (sin reconstruir)
docker compose up -d

# Si se hicieron cambios en el código y queremos reconstruir
docker compose up --build  

# Ver logs en tiempo real
docker compose logs -f app

# Detener contenedores
docker compose down

# Detener y borrar volúmenes (reset completo de la BD)
docker compose down -v
```

---

## Variables de entorno

La aplicación espera las siguientes variables, ya configuradas en `docker-compose.yml` para desarrollo:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión principal usada por NestJS/Prisma |
| `SHADOW_DATABASE_URL` | Base de datos sombra usada por `prisma migrate dev` |
| `JWT_SECRET` | Clave para firmar tokens JWT |
| `JWT_EXPIRES_IN` | Duración del token (ej. `3600s`) |

Para entornos fuera de Docker, crear un archivo `.env` en la raíz con esos valores apuntando a `localhost`.

---

## Comandos útiles (dentro del contenedor)


```bash
#para visualizar los datos cargados en la BD
npx prisma studio

# Agrega datos a la base de datos
docker exec -it nest_app npx prisma db seed

# Crear una nueva migración tras modificar prisma/schema.prisma
docker compose exec app npx prisma migrate dev --name <nombre>

# Regenerar el cliente de Prisma
docker compose exec app npx prisma generate

# Correr tests
docker compose exec app npm run test

# Ver la BD con Prisma Studio
docker compose exec app npx prisma studio

# Cargar datos desde un archivo SQL
docker cp .\db\consulta.sql mysql_nest:/consulta.sql
docker exec -i mysql_nest mysql -u root -prootpass nestdb -e "source /consulta.sql"
```

---

## Arquitectura

El proyecto modela un marketplace de delivery con tres roles de usuario:

- **Empresa** — restaurante/vendedor con sucursales y productos
- **Comprador** — cliente que realiza pedidos
- **Repartidor** — encargado de la entrega

Cada dominio (`pedido`, `producto`, `empresa`, etc.) tiene su propio módulo NestJS con controlador, servicio y DTOs. La autenticación es por JWT con un guard global; las rutas públicas se marcan con `@Public()`.

Los estados de pedidos, productos, pagos y sucursales se manejan a través de una entidad `Estado` con un campo `ambito` que actúa como discriminador (máquina de estados).

Los datos iniciales (estados, formas de pago y categorías) se cargan automáticamente desde `prisma/seed.ts` al iniciar el contenedor.
