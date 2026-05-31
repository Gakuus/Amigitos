export function isValidPetName(name: string): boolean {
  return name.length >= 2 && name.length <= 20 && /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(name);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
