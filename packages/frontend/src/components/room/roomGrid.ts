/* ───────── Grid system for 2.5D room ─────────
 *
 * The floor is divided into GRID_COLS × GRID_ROWS cells.
 * Row 0 = back of room (depth ~0, scale ~0.5)
 * Row GRID_ROWS-1 = front (depth ~1, scale ~1.05)
 * Col 0 = left wall, Col GRID_COLS-1 = right wall
 */

export const GRID_COLS = 10;
export const GRID_ROWS = 8;

/* Floor occupies the bottom 42 % of the room container */
export const FLOOR_TOP_PCT = 58;
export const FLOOR_HEIGHT_PCT = 42;

/* Depth-to-scale: matches depth() in RoomScene */
export function depthToScale(d: number) {
  return 0.5 + d * 0.55;
}

/* ───────── Types ───────── */

export interface GridCell {
  col: number;
  row: number;
}

export interface GridFurniture {
  id: string;
  col: number; // leftmost column
  row: number; // backmost row (closer to wall)
  width: number; // columns occupied
  height: number; // rows occupied
  label: string;
  emoji?: string;
}

export interface GridPosition {
  /** Horizontal position as percentage (0‑100) */
  xPct: number;
  /** Depth 0‑1, 0 = back wall, 1 = front edge */
  depth: number;
  /** Top position as percentage (where on screen) */
  topPct: number;
  /** Scale factor for this depth */
  scale: number;
}

/* ───────── Coordinate conversion ───────── */

/** Convert a grid cell to screen position + depth.
 *  `anchor` controls which part of the furniture snaps to the cell:
 *   - 'floor'   → the cell is where the furniture sits on the floor (default)
 *   - 'center'  → the cell is the visual center of the furniture
 */
export function gridToPosition(
  col: number,
  row: number,
  anchor: 'floor' | 'center' = 'floor',
): GridPosition {
  const depth = row / (GRID_ROWS - 1);
  /* Horizontal: 2 % – 98 % so furniture doesn't clip walls */
  const leftMargin = 2;
  const rightMargin = 98;
  const xPct = leftMargin + (col / (GRID_COLS - 1)) * (rightMargin - leftMargin);

  /* Floor top is FLOOR_TOP_PCT, each row is a fraction of the floor height.
   * We want row 0 to sit at the back of the floor and row MAX at the front.
   * For 'floor' anchor: the cell's vertical position on the floor screen area */
  const floorScreenTop = FLOOR_TOP_PCT;
  const floorRowFraction = row / (GRID_ROWS - 1);
  /* The visual "sitting point" of the object moves down as depth increases.
   * At depth 0 (back), the item sits near the top of the floor.
   * At depth 1 (front), the item sits near the bottom. */
  const topPct = floorScreenTop + floorRowFraction * FLOOR_HEIGHT_PCT;

  const scale = depthToScale(depth);
  return { xPct, depth, topPct, scale };
}

/** Get all cells occupied by a furniture piece */
export function getFurnitureCells(f: GridFurniture): GridCell[] {
  const cells: GridCell[] = [];
  for (let c = f.col; c < f.col + f.width; c++) {
    for (let r = f.row; r < f.row + f.height; r++) {
      if (c >= 0 && c < GRID_COLS && r >= 0 && r < GRID_ROWS) {
        cells.push({ col: c, row: r });
      }
    }
  }
  return cells;
}

/** Check if a cell is occupied by any furniture in a list */
export function isCellOccupied(
  cell: GridCell,
  furniture: GridFurniture[],
): boolean {
  return furniture.some((f) => {
    for (let c = f.col; c < f.col + f.width; c++) {
      for (let r = f.row; r < f.row + f.height; r++) {
        if (c === cell.col && r === cell.row) return true;
      }
    }
    return false;
  });
}

/** Find the nearest free cell for placing an item */
export function findNearestFreeCell(
  target: GridCell,
  furniture: GridFurniture[],
): GridCell | null {
  for (let radius = 0; radius < Math.max(GRID_COLS, GRID_ROWS); radius++) {
    for (let dc = -radius; dc <= radius; dc++) {
      for (let dr = -radius; dr <= radius; dr++) {
        const c = target.col + dc;
        const r = target.row + dr;
        if (c < 0 || c >= GRID_COLS || r < 0 || r >= GRID_ROWS) continue;
        if (dc === 0 && dr === 0) continue;
        if (!furniture.some((f) => f.col <= c && c < f.col + f.width && f.row <= r && r < f.row + f.height)) {
          return { col: c, row: r };
        }
      }
    }
  }
  return null;
}

/** Generate CSS grid-template style for a perspective grid overlay */
export function perspectiveGridStyle() {
  const colW = 100 / GRID_COLS;
  const rowH = 100 / GRID_ROWS;

  const bgSize = `${colW}% ${rowH}%`;

  return {
    backgroundImage: [
      'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      'linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
    ].join(', '),
    backgroundSize: bgSize,
    maskImage:
      'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
    WebkitMaskImage:
      'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
  };
}
