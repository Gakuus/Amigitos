# Modelo de Dominio

## Entidades Core

### Pet (Agregado Raíz)

```
Pet {
  id: PetId
  name: PetName
  species: PetSpecies
  level: PetLevel
  experience: Experience
  hunger: Hunger          [0-100]
  happiness: Happiness    [0-100]
  energy: Energy          [0-100]
  hygiene: Hygiene        [0-100]
  mood: PetMood
  isSleeping: boolean
  modelUrl: URL | null
  coupleId: CoupleId

  // Comportamiento
  feed(): void
  play(): void
  bathe(): void
  sleep(): void
  wakeUp(): void
  decay(timeDelta: Duration): void
  addExperience(amount: number): void
  evolve(): void
  calculateMood(): PetMood
  canInteract(type: InteractionType): boolean
}

Reglas de negocio:
- feed(): hunger = min(100, hunger + 20), happiness += 5, energy += 10
- play(): happiness = min(100, happiness + 25), energy -= 15
- bathe(): hygiene = min(100, hygiene + 30), happiness += 5
- sleep(): energy regen 20/hora
- decay(): all stats -5% por hora sin interacción
- evolve(): al alcanzar niveles 5, 10, 20, 35, 50
```

### User

```
User {
  id: UserId
  email: Email
  name: UserName
  avatarUrl: URL | null
  coupleId: CoupleId | null

  // Comportamiento
  invitePartner(email: Email): void
  acceptInvitation(coupleId: CoupleId): void
  interactWithPet(petId: PetId, type: InteractionType): Interaction
}
```

### Couple (Agregado Raíz)

```
Couple {
  id: CoupleId
  user1Id: UserId
  user2Id: UserId
  status: CoupleStatus
  invitedBy: UserId
  invitedAt: DateTime
  acceptedAt: DateTime | null

  // Comportamiento
  accept(): void
  dissolve(): void
  isActive(): boolean
  getPartner(userId: UserId): UserId
}
```

### Value Objects

| VO         | Tipo    | Rango   | Descripción                    |
|------------|---------|---------|--------------------------------|
| Hunger     | number  | [0-100] | Nivel de hambre                |
| Happiness  | number  | [0-100] | Nivel de felicidad             |
| Energy     | number  | [0-100] | Nivel de energía               |
| Hygiene    | number  | [0-100] | Nivel de higiene               |
| PetLevel   | number  | [1-50]  | Nivel actual de la mascota     |
| Experience | number  | [0-∞)   | Experiencia acumulada          |
| PetName    | string  | 2-20    | Nombre validado                |

### Domain Events

- `PetFedEvent` — { petId, userId, hunger, timestamp }
- `PetPlayedEvent` — { petId, userId, happiness, timestamp }
- `PetBathedEvent` — { petId, userId, hygiene, timestamp }
- `PetSleptEvent` — { petId, timestamp }
- `PetEvolvedEvent` — { petId, newLevel, oldLevel, timestamp }
- `PetMoodChangedEvent` — { petId, oldMood, newMood, timestamp }
- `CoupleCreatedEvent` — { coupleId, user1Id, user2Id, timestamp }
- `CoupleAcceptedEvent` — { coupleId, timestamp }

### Diagrama de Estados (Pet)

```
                  ┌──────────┐
                  │  HAPPY   │
                  └────┬─────┘
                       │ decay / neglect
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     ┌────────┐  ┌──────────┐  ┌────────┐
     │  SAD   │  │ SLEEPING │  │ HUNGRY │
     └───┬────┘  └────┬─────┘  └───┬────┘
          │            │            │
          └────────────┼────────────┘
                       │ care / interaction
                  ┌────▼─────┐
                  │  HAPPY   │
                  └──────────┘
```

### Bounded Contexts

```
┌────────────────────────────────────────────────┐
│                   Amigitos                      │
├──────────────────┬────────────────┬────────────┤
│  Pet Care        │  Couple        │  Auth      │
│  (Core)          │  (Supporting)  │  (Generic) │
├──────────────────┼────────────────┼────────────┤
│ - Alimentar      │ - Invitar      │ - Login    │
│ - Jugar          │ - Aceptar      │ - Register │
│ - Bañar          │ - Disolver     │ - Sesión   │
│ - Evolución      │ - Roles        │ - OAuth    │
│ - Estado/Ánimo   │                │            │
└──────────────────┴────────────────┴────────────┘
```
