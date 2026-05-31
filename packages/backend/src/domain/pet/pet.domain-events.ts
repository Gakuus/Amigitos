export class PetFedEvent {
  constructor(
    public readonly petId: string,
    public readonly userId: string,
    public readonly hunger: number,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class PetPlayedEvent {
  constructor(
    public readonly petId: string,
    public readonly userId: string,
    public readonly happiness: number,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class PetBathedEvent {
  constructor(
    public readonly petId: string,
    public readonly userId: string,
    public readonly hygiene: number,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class PetSleptEvent {
  constructor(
    public readonly petId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class PetEvolvedEvent {
  constructor(
    public readonly petId: string,
    public readonly newLevel: number,
    public readonly oldLevel: number,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class PetMoodChangedEvent {
  constructor(
    public readonly petId: string,
    public readonly oldMood: string,
    public readonly newMood: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
