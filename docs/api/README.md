# API — Documentación

## Base URL

```
Development: http://localhost:3001/api/v1
Production:  https://api.amigitos.app/v1
```

## Autenticación

```
POST /auth/register   — Registro
POST /auth/login      — Inicio de sesión
POST /auth/refresh    — Refrescar token
POST /auth/logout     — Cerrar sesión
GET  /auth/me         — Perfil actual
```

Headers: `Authorization: Bearer <token>`

## Endpoints REST

### Mascotas (`/pets`)

| Método | Ruta                 | Descripción                         |
|--------|----------------------|-------------------------------------|
| POST   | `/pets/adopt`        | Adoptar nueva mascota               |
| GET    | `/pets/{id}`         | Obtener estado de la mascota        |
| PATCH  | `/pets/{id}`         | Actualizar mascota (nombre, etc.)   |
| DELETE | `/pets/{id}`         | Liberar mascota                     |
| POST   | `/pets/{id}/feed`    | Alimentar mascota                   |
| POST   | `/pets/{id}/play`    | Jugar con mascota                   |
| POST   | `/pets/{id}/bathe`   | Bañar mascota                       |
| POST   | `/pets/{id}/sleep`   | Poner a dormir                      |
| POST   | `/pets/{id}/wake`    | Despertar                           |
| GET    | `/pets/{id}/events`  | Historial de eventos de la mascota  |
| POST   | `/pets/{id}/model`   | Subir modelo 3D personalizado       |

### Parejas (`/couples`)

| Método | Ruta                      | Descripción                         |
|--------|---------------------------|-------------------------------------|
| POST   | `/couples/invite`         | Invitar a usuario como pareja       |
| GET    | `/couples/{id}`           | Obtener información de la pareja    |
| POST   | `/couples/{id}/accept`    | Aceptar invitación                  |
| POST   | `/couples/{id}/dissolve`  | Disolver pareja                     |
| GET    | `/couples/{id}/pets`      | Mascotas de la pareja               |
| GET    | `/couples/{id}/activity`  | Actividad reciente de la pareja     |

### Usuarios (`/users`)

| Método | Ruta                    | Descripción                         |
|--------|-------------------------|-------------------------------------|
| GET    | `/users/{id}`           | Perfil de usuario                   |
| PATCH  | `/users/{id}`           | Actualizar perfil                   |
| POST   | `/users/{id}/avatar`    | Subir avatar                        |

## WebSockets

### Conexión

```
ws://localhost:3001/ws
?token=<jwt_token>
```

### Eventos — Cliente → Servidor

| Evento               | Payload                          | Descripción                     |
|----------------------|----------------------------------|---------------------------------|
| `pet:feed`           | `{ petId: string }`             | Alimentar mascota               |
| `pet:play`           | `{ petId: string }`             | Jugar con mascota               |
| `pet:bathe`          | `{ petId: string }`             | Bañar mascota                   |
| `pet:sleep`          | `{ petId: string }`             | Dormir mascota                  |
| `pet:join-room`      | `{ petId: string }`             | Unirse a sala de la mascota     |
| `couple:activity`    | `{ coupleId: string }`          | Solicitar actividad de pareja   |

### Eventos — Servidor → Cliente

| Evento               | Payload                                          | Descripción                     |
|----------------------|--------------------------------------------------|---------------------------------|
| `pet:state`         | `{ petId, hunger, happiness, energy, hygiene, mood }` | Estado actualizado        |
| `pet:fed`           | `{ petId, userId, hunger, timestamp }`           | Alguien alimentó                |
| `pet:played`        | `{ petId, userId, happiness, timestamp }`        | Alguien jugó                    |
| `pet:bathed`        | `{ petId, userId, hygiene, timestamp }`          | Alguien bañó                    |
| `pet:slept`         | `{ petId, timestamp }`                           | Mascota durmiendo               |
| `pet:evolved`       | `{ petId, newLevel, timestamp }`                 | Mascota evolucionó              |
| `pet:mood-change`   | `{ petId, oldMood, newMood, timestamp }`         | Cambio de ánimo                 |
| `pet:cooldown`      | `{ petId, type, remainingSeconds }`              | Cooldown activo                 |
| `couple:partner-action` | `{ userId, type, petId, timestamp }`         | Tu pareja hizo algo             |
| `error`             | `{ code, message }`                              | Error                           |

## Códigos de Error

| Código                  | HTTP  | Descripción                           |
|-------------------------|-------|---------------------------------------|
| `PET_NOT_FOUND`         | 404   | Mascota no encontrada                 |
| `PET_IS_SLEEPING`       | 409   | La mascota está durmiendo             |
| `PET_COOLDOWN`          | 429   | Cooldown activo para esa interacción  |
| `USER_NOT_FOUND`        | 404   | Usuario no encontrado                 |
| `COUPLE_NOT_FOUND`      | 404   | Pareja no encontrada                  |
| `COUPLE_ALREADY_EXISTS` | 409   | Ya tienes una pareja activa           |
| `INVITATION_PENDING`    | 409   | Ya hay una invitación pendiente       |
| `UNAUTHORIZED`          | 401   | No autorizado                         |
| `FORBIDDEN`             | 403   | No tienes permiso                     |
| `INVALID_MODEL`         | 400   | Modelo 3D inválido                    |
| `RATE_LIMITED`          | 429   | Demasiadas solicitudes                |
