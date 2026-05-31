export class PetLevel {
  private static readonly MIN = 1;
  private static readonly MAX = 50;

  private constructor(private readonly _value: number) {
    if (_value < PetLevel.MIN || _value > PetLevel.MAX) {
      throw new Error(`PetLevel must be between ${PetLevel.MIN} and ${PetLevel.MAX}`);
    }
  }

  get value(): number {
    return this._value;
  }

  static create(value: number): PetLevel {
    return new PetLevel(value);
  }
}
