export interface SleepPosition {
  x: number;
  depth: number;
  top: number;
}

export function getBedPositions(count: number): SleepPosition[] {
  const maxBeds = Math.min(count, 5);
  const positions: SleepPosition[] = [];

  for (let i = 0; i < maxBeds; i++) {
    let x: number, top: number;
    if (maxBeds <= 3) {
      const cols = maxBeds;
      const startX = 50 - ((cols - 1) * 12);
      x = startX + i * 12;
      top = 66;
    } else {
      const perRow = maxBeds <= 4 ? 2 : 3;
      const col = i % perRow;
      const row = Math.floor(i / perRow);
      const rowWidth = (perRow - 1) * 12;
      const startX = 50 - rowWidth / 2;
      x = startX + col * 12;
      top = 62 + row * 14;
    }
    positions.push({ x, depth: 0.3, top });
  }

  return positions;
}

const BED_WIDTH_PCT = 20;
const BED_HALF = BED_WIDTH_PCT / 2;

export function isOverBed(
  px: number,
  py: number,
  beds: SleepPosition[],
): number {
  for (let i = 0; i < beds.length; i++) {
    const b = beds[i]!;
    const left = b.x - BED_HALF - 1;
    const right = b.x + BED_HALF + 1;
    const top = b.top - 6;
    const bottom = b.top + 13;
    if (px >= left && px <= right && py >= top && py <= bottom) return i;
  }
  return -1;
}
