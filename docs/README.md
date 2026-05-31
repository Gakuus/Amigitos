# Amigitos 🐾

**Amigitos** es una aplicación web para el cuidado de mascotas virtuales en pareja. Inspirada en Widgetable Pets, permite a dos personas adoptar, alimentar, bañar y jugar con una mascota virtual compartida directamente desde el navegador.

## ✨ Concepto

- **Cuidado compartido**: Dos personas (pareja o amigos) cuidan de una misma mascota.
- **Mascotas 3D**: Modelos originales importables (GLTF/GLB) renderizados con Three.js.
- **Interacciones en tiempo real**: Alimentar, bañar, jugar — todo sincronizado vía WebSockets.
- **Evolución**: Las mascotas crecen y evolucionan según el cuidado recibido.
- **Estado emocional**: La mascota reacciona al nivel de atención que recibe.

## 🏗️ Stack Tecnológico Recomendado

| Capa          | Tecnología                                    |
| ------------- | --------------------------------------------- |
| Frontend      | Next.js 14+ (App Router), React Three Fiber   |
| Estilos       | TailwindCSS                                   |
| Backend       | NestJS (TypeScript)                           |
| ORM           | Prisma + PostgreSQL                           |
| Tiempo real   | Socket.io (WebSockets)                        |
| Autenticación | JWT + Refresh Tokens                          |
| 3D            | Three.js / React Three Fiber / @react-three/drei |
| Testing       | Vitest (unit), Playwright (e2e)               |
| Monorepo      | Turborepo                                     |
| CI/CD         | GitHub Actions                                |
| Contenedores  | Docker + Docker Compose                       |
| Modelos 3D    | GLTF/GLB con Draco compresión                 |

## 📁 Estructura del Proyecto

```
amigitos/
├── packages/
│   ├── backend/          # API NestJS (arquitectura hexagonal)
│   │   └── src/
│   │       ├── domain/       # Entidades, value objects, eventos
│   │       ├── application/  # Puertos (interfaces) y casos de uso
│   │       ├── infrastructure/ # Adaptadores (DB, WS, auth, storage)
│   │       └── api/          # Controladores REST, DTOs, guards
│   ├── frontend/         # Next.js + Three.js
│   └── shared/           # Tipos, validaciones, utilidades compartidas
├── docs/                 # Documentación completa
├── .github/workflows/    # CI/CD pipelines
├── docker/               # Docker Compose y Dockerfiles
└── scripts/              # Scripts de utilidad
```

## 🚀 Inicio Rápido

```bash
# Requisitos: Node.js >= 18, Docker

# Instalar dependencias
npm install

# Iniciar base de datos (PostgreSQL + Redis)
npm run docker:up

# Iniciar en modo desarrollo (backend + frontend)
npm run dev
```

## 🧱 Arquitectura Hexagonal

Este proyecto sigue una **arquitectura hexagonal** (puertos y adaptadores) para mantener el dominio limpio de dependencias externas.

```
┌─────────────────────────────────────────────────┐
│                   API (REST/WS)                  │
│           Adaptadores de Entrada                 │
├─────────────────────────────────────────────────┤
│              ┌───────────────────┐               │
│              │   Application     │               │
│              │   (Casos de Uso)  │               │
│              └────────┬──────────┘               │
│              ┌────────┴──────────┐               │
│              │     Domain        │               │
│              │  (Entidades Core) │               │
│              └────────┬──────────┘               │
├───────────────────────┼─────────────────────────┤
│         Puertos de Salida (Interfaces)           │
├───────────────────────┼─────────────────────────┤
│              ┌────────┴──────────┐               │
│              │  Infrastructure   │               │
│              │  (Adaptadores)    │               │
│              └───────────────────┘               │
└─────────────────────────────────────────────────┘
```

## 📚 Documentación

- [Requisitos y Análisis](docs/architecture/requirements.md)
- [Arquitectura](docs/architecture/README.md)
- [Modelo de Dominio](docs/domain/README.md)
- [API](docs/api/README.md)
- [Base de Datos](docs/architecture/database.md)
- [Despliegue](docs/deployment/README.md)
- [Guías](docs/guides/README.md)

## 📄 Licencia

MIT
