export enum CoupleStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DISSOLVED = 'DISSOLVED',
}

export class CoupleId {
  private constructor(private readonly _value: string) {
    if (!_value) throw new Error('CoupleId cannot be empty');
  }

  get value(): string { return this._value; }
  static create(value?: string): CoupleId {
    return new CoupleId(value ?? require('uuid').v4());
  }
  equals(other: CoupleId): boolean { return this._value === other._value; }
}

export class Couple {
  private readonly _id: CoupleId;
  private readonly _user1Id: string;
  private readonly _user2Id: string;
  private _status: CoupleStatus;
  private readonly _invitedBy: string;
  private readonly _invitedAt: Date;
  private _acceptedAt: Date | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id?: CoupleId;
    user1Id: string;
    user2Id: string;
    status?: CoupleStatus;
    invitedBy: string;
    invitedAt?: Date;
    acceptedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    if (props.user1Id === props.user2Id) {
      throw new Error('Cannot create couple with the same user');
    }
    this._id = props.id ?? CoupleId.create();
    this._user1Id = props.user1Id;
    this._user2Id = props.user2Id;
    this._status = props.status ?? CoupleStatus.PENDING;
    this._invitedBy = props.invitedBy;
    this._invitedAt = props.invitedAt ?? new Date();
    this._acceptedAt = props.acceptedAt ?? null;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): CoupleId { return this._id; }
  get user1Id(): string { return this._user1Id; }
  get user2Id(): string { return this._user2Id; }
  get status(): CoupleStatus { return this._status; }
  get invitedBy(): string { return this._invitedBy; }
  get invitedAt(): Date { return this._invitedAt; }
  get acceptedAt(): Date | null { return this._acceptedAt; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  getPartner(userId: string): string {
    if (userId === this._user1Id) return this._user2Id;
    if (userId === this._user2Id) return this._user1Id;
    throw new Error('User is not part of this couple');
  }

  isActive(): boolean { return this._status === CoupleStatus.ACTIVE; }

  accept(userId: string): void {
    if (this._status !== CoupleStatus.PENDING) {
      throw new Error('Couple is not in pending status');
    }
    if (userId === this._invitedBy) {
      throw new Error('Inviter cannot accept their own invitation');
    }
    if (userId !== this._user2Id && userId !== this._user1Id) {
      throw new Error('User is not part of this couple');
    }
    this._status = CoupleStatus.ACTIVE;
    this._acceptedAt = new Date();
    this._updatedAt = new Date();
  }

  dissolve(): void {
    if (this._status !== CoupleStatus.ACTIVE) {
      throw new Error('Only active couples can be dissolved');
    }
    this._status = CoupleStatus.DISSOLVED;
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id.value,
      user1Id: this._user1Id,
      user2Id: this._user2Id,
      status: this._status,
      invitedBy: this._invitedBy,
      invitedAt: this._invitedAt,
      acceptedAt: this._acceptedAt,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
