import { v4 as uuidv4 } from 'uuid';

export class UserId {
  private constructor(private readonly _value: string) {
    if (!_value) throw new Error('UserId cannot be empty');
  }

  get value(): string { return this._value; }
  static create(value?: string): UserId {
    return new UserId(value ?? uuidv4());
  }
  equals(other: UserId): boolean { return this._value === other._value; }
}

export class Email {
  private constructor(private readonly _value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(_value)) {
      throw new Error('Invalid email format');
    }
  }

  get value(): string { return this._value; }
  static create(value: string): Email { return new Email(value.toLowerCase().trim()); }
}

export class User {
  private readonly _id: UserId;
  private _email: Email;
  private _name: string;
  private _avatarUrl: string | null;
  private _coupleId: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id?: UserId;
    email: Email;
    name: string;
    avatarUrl?: string | null;
    coupleId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    if (!props.name || props.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    this._id = props.id ?? UserId.create();
    this._email = props.email;
    this._name = props.name.trim();
    this._avatarUrl = props.avatarUrl ?? null;
    this._coupleId = props.coupleId ?? null;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): UserId { return this._id; }
  get email(): Email { return this._email; }
  get name(): string { return this._name; }
  get avatarUrl(): string | null { return this._avatarUrl; }
  get coupleId(): string | null { return this._coupleId; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  isInCouple(): boolean { return this._coupleId !== null; }

  joinCouple(coupleId: string): void {
    if (this._coupleId) {
      throw new Error('User already in a couple');
    }
    this._coupleId = coupleId;
    this._updatedAt = new Date();
  }

  leaveCouple(): void {
    this._coupleId = null;
    this._updatedAt = new Date();
  }

  updateProfile(name: string, avatarUrl?: string): void {
    this._name = name.trim();
    if (avatarUrl !== undefined) {
      this._avatarUrl = avatarUrl;
    }
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id.value,
      email: this._email.value,
      name: this._name,
      avatarUrl: this._avatarUrl,
      coupleId: this._coupleId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
