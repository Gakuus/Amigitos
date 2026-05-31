# Base de Datos

## Esquema (Prisma)

```prisma
enum PetSpecies {
  CAT
  DOG
  RABBIT
  DRAGON
  CUSTOM
}

enum PetMood {
  HAPPY
  NEUTRAL
  SAD
  SLEEPING
  SICK
}

enum CoupleStatus {
  PENDING
  ACTIVE
  DISSOLVED
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  couple   Couple?  @relation("CoupleMembers")
  pet      Pet?     @relation("PetOwner")
  sessions Session[]
  interactions Interaction[]
}

model Couple {
  id         String        @id @default(uuid())
  status     CoupleStatus  @default(PENDING)
  invitedBy  String
  invitedAt  DateTime      @default(now())
  acceptedAt DateTime?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  user1Id String
  user2Id String
  user1   User   @relation("CoupleMembers", fields: [user1Id], references: [id])
  user2   User   @relation("CoupleMembers", fields: [user2Id], references: [id])

  pets Pet[]
}

model Pet {
  id         String    @id @default(uuid())
  name       String
  species    PetSpecies
  level      Int       @default(1)
  experience Int       @default(0)
  hunger     Int       @default(100)
  happiness  Int       @default(100)
  energy     Int       @default(100)
  hygiene    Int       @default(100)
  mood       PetMood   @default(HAPPY)
  isSleeping Boolean   @default(false)
  modelUrl   String?
  thumbnail  String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  coupleId String
  couple   Couple  @relation(fields: [coupleId], references: [id])

  interactions Interaction[]

  @@index([coupleId])
}

model Interaction {
  id        String   @id @default(uuid())
  type      String   // FEED, PLAY, BATH, SLEEP
  createdAt DateTime @default(now())

  petId  String
  userId String
  pet    Pet    @relation(fields: [petId], references: [id])
  user   User   @relation(fields: [userId], references: [id])

  @@index([petId, createdAt])
}

model Session {
  id        String   @id @default(uuid())
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  userId String
  user   User   @relation(fields: [userId], references: [id])

  @@index([token])
}

enum EventType {
  PET_FED
  PET_PLAYED
  PET_BATHED
  PET_SLEPT
  PET_EVOLVED
  PET_SAD
  PET_HAPPY
}

model PetEvent {
  id        String    @id @default(uuid())
  type      EventType
  metadata  Json?
  createdAt DateTime  @default(now())

  petId String
  pet   Pet    @relation(fields: [petId], references: [id])

  @@index([petId, createdAt])
}
```

## Relaciones Clave

```
User (1) ── (1) Couple (1) ── (1) User
                    │
                    │ (1)
                    │
                    ▼
                   Pet (N) ── (N) Interaction
                    │
                    │ (1)
                    │
                    ▼
                PetEvent (N)
```

## Índices Recomendados

- `Interaction(petId, createdAt)` — consultas de historial por mascota
- `PetEvent(petId, createdAt)` — timeline de eventos
- `Session(token)` — búsqueda rápida de sesión
- `Couple(user1Id, user2Id)` — búsqueda de pareja

## Estrategia de Datos

- **Soft delete**: No eliminamos registros, usamos `status` o `deletedAt`.
- **Auditoría**: `PetEvent` guarda todo el historial de la mascota.
- **Time decay**: Los atributos decaen con el tiempo; calculado en runtime vs stored.
