# Guías

## Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Gakuus/Amigitos.git
cd Amigitos

# 2. Instalar dependencias
npm install

# 3. Iniciar servicios (PostgreSQL, Redis, MinIO)
npm run docker:up

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con valores locales

# 5. Ejecutar migraciones
npm run db:migrate

# 6. Iniciar en modo desarrollo
npm run dev
```

## Comandos Disponibles

| Comando              | Descripción                                    |
|----------------------|------------------------------------------------|
| `npm run dev`        | Inicia backend y frontend en modo desarrollo    |
| `npm run build`      | Compila todos los paquetes                      |
| `npm run test`       | Ejecuta tests de todos los paquetes             |
| `npm run lint`       | Verifica linting                                |
| `npm run typecheck`  | Verifica tipos                                  |
| `npm run db:migrate` | Ejecuta migraciones de Prisma                   |
| `npm run db:studio`  | Abre Prisma Studio                              |
| `npm run docker:up`  | Inicia servicios Docker                         |

## Importar Modelos 3D

### Requisitos
- Formato: GLTF binario (.glb) o GLTF separado (.gltf + .bin + texturas)
- Compresión: Draco (recomendado)
- Tamaño máximo: 50MB
- Animaciones: idle, walk, eat, play, sleep, bath (opcional)

### Proceso
1. Prepara tu modelo en Blender o tu herramienta 3D favorita
2. Exporta como GLTF con las siguientes opciones:
   - Formato: GLB (binario) para producción
   - Incluir texturas (incrustadas o separadas)
   - Compresión Draco activada
   - Animaciones incluidas
3. Sube el modelo desde la interfaz web o vía API
4. El sistema validará el formato y generará miniaturas

### Convención de Nombres
```
models/
├── cat/
│   ├── model.glb
│   └── thumbnail.png
├── dog/
│   ├── model.glb
│   └── thumbnail.png
└── custom/
    └── {userId}-{timestamp}.glb
```

## Testing

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests e2e
npm run test:e2e

# En modo watch
npm run test:watch
```

### Estrategia

- **Unitarios**: Domain y Application layer (Vitest)
- **Integración**: Infrastructure + API (Vitest + Supertest)
- **E2E**: Flujos completos (Playwright)
- **Componentes**: Frontend (Testing Library + Vitest)
