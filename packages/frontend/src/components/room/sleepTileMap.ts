export interface SleepPosition {
  x: number;
  depth: number;
  top: number;
}

export function getSleepPositions(count: number): SleepPosition[] {
  const cols = count <= 2 ? count : 3;
  const positions: SleepPosition[] = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = ((col + 0.5) / cols) * 100;
    const top = row === 0 ? 65 : 78;
    const depth = row === 0 ? 0.35 : 0.75;
    positions.push({ x, depth, top });
  }
  return positions;
}
