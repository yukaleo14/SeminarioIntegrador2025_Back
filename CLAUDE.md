# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start local MySQL (Docker required) — also auto-runs prisma db push + seed
docker compose up -d

# Run migrations & regenerate Prisma client
npx prisma migrate dev --name <migration-name>
npx prisma generate

# Development server (hot reload)
npm run start:dev

# Lint & format
npm run lint
npm run format

# Tests
npm run test             # unit tests
npm run test:watch       # watch mode
npm run test:cov         # coverage
npm run test:e2e         # end-to-end

# Run a single test file
npx jest src/auth/auth.service.spec.ts
```

Swagger UI available at `http://localhost:3000/openapi`.

No real unit or e2e tests exist yet — don't require or run the test suite before marking work done.

## Code Style

Prettier config (`.prettierrc`): `singleQuote: true`, `trailingComma: "all"`, `endOfLine: "auto"`.

ESLint uses flat config (`eslint.config.mjs`). Key rule deviations from defaults: `@typescript-eslint/no-explicit-any` is **OFF** (using `any` is allowed), `@typescript-eslint/no-floating-promises` is **WARN**.

Run `npm run format` to apply Prettier and `npm run lint` to apply ESLint fixes.

## Commits

Write commit messages in **Spanish**, imperative mood, subject-only (no body). Examples: `"Implementar endpoint de pedidos"`, `"Corregir validación de DTO"`.

## Environment Variables

```
DATABASE_URL=mysql://root:rootpass@localhost:3307/nestdb   # host port is 3307 (Docker maps 3307→3306)
SHADOW_DATABASE_URL=mysql://root:rootpass@localhost:3307/shadowdb
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=3600s
```

When running inside Docker, replace `localhost` with the `mysql` service name and use port `3306`.

Seed data lives in `prisma/seed.ts` (Estados, FormasPago, Categorias, sample users). When using Docker Compose, `prisma db push` and `prisma db seed` run automatically on container start. For local dev, apply the seed manually with `npx prisma db seed` after migrations.

## Architecture

NestJS 11 / TypeScript food-delivery backend using MySQL 8 and Prisma ORM. Each domain follows NestJS module conventions: `<feature>.module.ts`, `<feature>.controller.ts`, `<feature>.service.ts`, and `dto/` subfolder.

### Domain Model

The system models a multi-role food-delivery marketplace:

| Entity | Role |
|---|---|
| `Usuario` | Base user — credentials + role discriminator |
| `Empresa` | Vendor/restaurant; owns `Sucursal` (branches) |
| `Comprador` | Customer; has a `Ubicacion` |
| `Repartidor` | Delivery driver |
| `Producto` | Items belonging to a `Sucursal` with a `Categoria` |
| `Pedido` | Order linking `Comprador`, `Repartidor`, `Empresa`, and `Ruta` |
| `DetallePedido` | Line items on an order |
| `Estado` | State-machine entries scoped by `Ambito` (PEDIDO, PRODUCTO, PAGO, SUCURSAL) |
| `Ruta` | Delivery route: origin + destination `Ubicacion` + ETA fields |
| `Ubicacion` | Physical address linked to a `Posicion` (GPS coords) |

Role specialisation uses one-to-one relations: `Usuario` → `Empresa` / `Comprador` / `Repartidor`.

### Estado / State Machine

`Estado` is a shared state table scoped by the `Ambito` enum: `PEDIDO`, `PRODUCTO`, `PAGO`, `SUCURSAL`. Valid `nombre` values per ambito:

- **PEDIDO:** CREADO, ENPREPARACION, ASIGNADO, ENRUTA, ENTREGADO, CANCELADO, DEMORADO, PENDIENTE
  - Flujo: CREADO (cliente crea) → ENPREPARACION (empresa acepta) → ASIGNADO (empresa termina de preparar; el sistema asigna repartidor automáticamente) → ENRUTA (repartidor retiró) → ENTREGADO. `Pedido.repartidorId` es opcional hasta el paso ASIGNADO.
- **PRODUCTO:** CREADO, PUBLICADO, CANCELADO, PENDIENTE
- **PAGO:** CREADO, PENDIENTE, CANCELADO
- **SUCURSAL:** ABIERTO, CERRADO

Never hardcode `estadoId` values — they depend on seed insertion order. Always resolve the ID at runtime: `prisma.estado.findFirst({ where: { ambito: 'PEDIDO', nombre: 'CREADO' } })`.

### Request Lifecycle

```
HTTP Request
  → JwtAuthGuard (global; skip with @Public())
  → Controller (class-validator DTOs via ValidationPipe)
  → Service (business logic)
  → PrismaService (DB queries)
  → Response
```

### Authentication

`JwtAuthGuard` is registered globally in `main.ts`. Routes that must be public use the `@Public()` decorator (e.g., login, register, `GET /file/*`). Passwords are hashed with `bcrypt`.

**Registration uses a Strategy pattern** (`src/strategy/`): `AuthService.registerUser()` delegates to `StrategyFactory.getStrategy(rol)`, which returns `CompradorStrategy` | `EmpresaStrategy` | `RepartidorStrategy`. Each strategy runs inside a `prisma.$transaction` that creates the `Usuario` plus the role-specific entity and its `Ubicacion`/`Posicion`.

### Prisma

`PrismaService` (`src/prisma/`) extends `PrismaClient` and is a global NestJS injectable. Never instantiate `PrismaClient` directly. After any schema change run `npx prisma migrate dev` then `npx prisma generate`.

**Transaction pattern:** Services that participate in multi-entity atomic writes accept an optional `tx?: Prisma.TransactionClient` second parameter. Pass it down the call chain from the strategy's `prisma.$transaction` callback; callers omit it for standalone use.

### File Uploads

`POST /file/upload` (multipart, field name `imagen`) stores files locally at `./images/`. Returns `{ filename }`. Allowed types: JPEG, PNG, GIF; 5 MB max. `GET /file/<filename>` is `@Public()` and streams the file with the correct MIME type.

### CORS

Allowed origin in `main.ts`: `http://localhost:4200` (Angular dev server). Credentials (`Authorization` header) are enabled.

## Gotchas

**Docker startup uses `--accept-data-loss`:** The container entrypoint runs `npx prisma db push --accept-data-loss`. This is intentional for dev (schema changes are applied destructively). Never use this flag against a production database.

**Uploaded images are not persisted in Docker:** Files written to `./images/` live inside the container filesystem. They are lost on container restart because no Docker volume covers that path.
