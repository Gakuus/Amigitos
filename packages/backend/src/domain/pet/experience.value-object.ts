export class Experience {
  private constructor(private readonly _value: number) {
    if (_value < 0) {
      throw new Error('Experience cannot be negative');
    }
  }

  get value(): number {
    return this._value;
  }

  static create(value: number): Experience {
    return new Experience(value);
  }
}
