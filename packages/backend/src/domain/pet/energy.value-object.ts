export class Energy {
  private constructor(private readonly _value: number) {
    if (_value < 0 || _value > 100) {
      throw new Error('Energy must be between 0 and 100');
    }
  }

  get value(): number {
    return this._value;
  }

  static create(value: number): Energy {
    return new Energy(Math.round(value));
  }
}
