export class CoupleCreatedEvent {
  constructor(
    public readonly coupleId: string,
    public readonly user1Id: string,
    public readonly user2Id: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class CoupleAcceptedEvent {
  constructor(
    public readonly coupleId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class CoupleDissolvedEvent {
  constructor(
    public readonly coupleId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
