# Arquitectura del Sistema

## Principios

1. **Arquitectura Hexagonal** — Dominio aislado de infraestructura.
2. **Domain-Driven Design** — Modelado rico del negocio.
3. **CQRS ligero** — Separación de lecturas y escrituras donde tenga sentido.
4. **Event-Driven** — Eventos de dominio para desacoplar componentes.
5. **API First** — Especificación abierta antes de implementar.

## Diagrama de Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│                        Cliente Web                          │
│              Next.js + React Three Fiber                    │
└──────────────────────────┬─────────────────────────────────┘
                           │ HTTP / WebSocket
                           ▼
┌────────────────────────────────────────────────────────────┐
│                   Capa de Presentación (API)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ REST Controllers │  │ WS Gateways  │  │ GraphQL (futuro) │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘ │
└─────────┼───────────────────┼──────────────────────────────┘
          │                   │
          ▼                   ▼
┌────────────────────────────────────────────────────────────┐
│                  Capa de Aplicación                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Casos de Uso (Use Cases)                            │  │
│  │  - Adoptar mascota                                   │  │
│  │  - Alimentar mascota                                 │  │
│  │  - Jugar con mascota                                 │  │
│  │  - Bañar mascota                                     │  │
│  │  - Invitar pareja                                    │  │
│  │  - Subir de nivel                                    │  │
│  └──────────────┬───────────────────────────────────────┘  │
└─────────────────┼──────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────────┐
│                    Capa de Dominio                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │   Pet    │ │  User    │ │  Couple  │ │ Interaction   │  │
│  │  Aggregate│ │  Entity  │ │ Aggregate│ │ Value Object  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Domain Events, Domain Services, Value Objects       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────┬──────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────────┐
│              Puertos de Salida (Interfaces)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ PetRepo  │ │ UserRepo │ │  WS      │ │  FileStorage │  │
│  │  Port    │ │  Port    │ │  Port    │ │    Port      │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
└─────────────────┬──────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────────┐
│                  Infraestructura (Adapters)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Prisma   │ │ Redis    │ │Socket.io │ │  S3/MinIO    │  │
│  │ PetRepo  │ │ Session  │ │Gateway   │ │  Storage     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL, Redis, MinIO (Docker)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## Capas

### Domain (`packages/backend/src/domain/`)
- Entidades: `Pet`, `User`, `Couple`
- Value Objects: `Hunger`, `Happiness`, `Energy`, `Hygiene`, `PetLevel`
- Domain Events: `PetFedEvent`, `PetPlayedEvent`, `PetEvolvedEvent`
- Domain Services: `PetCareService`, `EvolutionService`
- Reglas de negocio puras, sin dependencias externas.

### Application (`packages/backend/src/application/`)
- **Puertos de entrada** (interfaces que los controladores implementan):
  - `IPetService`, `ICoupleService`, `IUserService`
- **Puertos de salida** (interfaces que la infraestructura implementa):
  - `IPetRepository`, `IUserRepository`, `ICoupleRepository`
  - `IWebSocketNotifier`, `IFileStorage`
- **Casos de uso**: orquestan el flujo entre dominio y puertos.

### Infrastructure (`packages/backend/src/infrastructure/`)
- **Persistence**: Prisma implementation de repositorios.
- **WebSockets**: Socket.io gateway con eventos de dominio.
- **Auth**: JWT strategy, guards.
- **Storage**: Subida/descarga de modelos 3D (local/S3).
- **AI**: (Futuro) Generación de comportamientos o texto.

### API (`packages/backend/src/api/`)
- **Controllers REST**: `/pets`, `/users`, `/couples`, `/auth`
- **WebSocket Gateways**: `pet-events`, `couple-events`
- **DTOs**: Validación con `class-validator`
- **Guards**: Autenticación JWT, pertenencia a pareja

## Decisiones Técnicas

| Decisión                | Alternativas             | Elegido         | Razón                                       |
|-------------------------|--------------------------|-----------------|---------------------------------------------|
| Framework backend       | Express, Fastify         | NestJS          | Hexagonal nativo, decorators, modular        |
| ORM                     | TypeORM, Drizzle         | Prisma          | Type-safe, migrations, DX                   |
| Tiempo real             | SSE, WebRTC              | Socket.io       | Fallback HTTP, salas, madurez               |
| Render 3D              | Babylon.js, PixiJS       | Three.js (R3F)  | Ecosistema React, GLTF, comunidad           |
| Monorepo                | Nx, Lerna                | Turborepo       | Simple, rápido, parallelismo                |
| Base de datos           | MySQL, SQLite            | PostgreSQL      | JSONB, robustez, extensiones                |
| Cache/Session           | -                        | Redis           | Sesiones WS, rate limiting, colas           |
| Modelos 3D              | OBJ, FBX                 | GLTF/GLB        | Estándar web, Draco compresión              |
