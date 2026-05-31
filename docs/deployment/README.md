# Despliegue

## Arquitectura de Despliegue

```
                    ┌──────────────┐
                    │  Cloudflare  │
                    │  (DNS, CDN)  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Load Balancer │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │  Next.js │ │  NestJS │ │  NestJS  │
        │  (FE)    │ │  (API)  │ │  (WS)    │
        └──────────┘ └──────────┘ └──────────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼───────┐
                    │   Redis      │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  PostgreSQL  │
                    └──────────────┘
```

## Docker Compose

```yaml
# docker/docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: amigitos
      POSTGRES_USER: amigitos
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASSWORD}
    command: server /data --console-address ":9001"
    volumes:
      - miniodata:/data
    ports:
      - "9000:9000"
      - "9001:9001"

volumes:
  pgdata:
  miniodata:
```

## Variables de Entorno

```env
# Backend
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://amigitos:password@localhost:5432/amigitos
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=amigitos-models
CORS_ORIGIN=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

## CI/CD Pipeline

Ver [GitHub Workflows](../../.github/workflows/).

El pipeline incluye:
1. **Lint & Typecheck** — Verificación estática
2. **Test** — Unitarios y de integración
3. **Build** — Compilación de todos los paquetes
4. **Docker** — Construcción de imágenes
5. **Deploy** — Despliegue a producción (manual o automático)
