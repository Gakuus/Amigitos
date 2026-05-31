import { v4 as uuidv4 } from 'uuid';

export class PetId {
  private constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('PetId cannot be empty');
    }
  }

  get value(): string {
    return this._value;
  }

  static create(value?: string): PetId {
    return new PetId(value ?? uuidv4());
  }

  equals(other: PetId): boolean {
    return this._value === other._value;
  }
}
