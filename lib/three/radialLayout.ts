export type Point2 = readonly [number, number];

/** Group tile size in the overview, and when it is the open group in the center (px). */
export const GROUP_TILE = 112;
export const HUB_TILE = 148;

/** Technology tile size (px). */
export const TECH_W = 128;
export const TECH_H = 116;

export const PIN_LENGTH = 8;
/** Three parallel traces per connection: vertical offsets (px). */
export const LANES = [-6, 0, 6] as const;

/** Depth layers, so the scene has parallax when tilted. */
export const Z_HUB = 0;
export const Z_TRACE = 10;
export const Z_TILE = 22;

/** Approximate size of the open layout, used to fit it into the canvas. */
export const LAYOUT_WIDTH = 800;
export const LAYOUT_HEIGHT = 520;

const COLUMN_X = 330;
const ROW_PITCH = 130;
const ATTACH_RATIO = 0.28;
const RUN_LENGTH = 28;

export interface Slot {
  x: number;
  y: number;
}

/** Grid positions of the group tiles in the overview (up to 3 per row). */
export function overviewSlots(count: number): Slot[] {
  const columns = Math.min(3, Math.max(count, 1));
  const rows = Math.ceil(count / columns);
  const pitchX = 250;
  const pitchY = 214;

  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / columns);
    const column = i % columns;
    return {
      x: (column - (columns - 1) / 2) * pitchX,
      y: ((rows - 1) / 2 - row) * pitchY + 10,
    };
  });
}

export interface TilePlacement {
  x: number;
  y: number;
  /** -1 = left of the center tile, 1 = right. */
  side: -1 | 1;
  /** Height on the center tile's edge where this tile's traces attach. */
  attachY: number;
}

/** Technologies alternate left and right of the center tile, top to bottom. */
export function expandedPlacements(count: number): TilePlacement[] {
  const leftCount = Math.ceil(count / 2);
  const rightCount = count - leftCount;

  return Array.from({ length: count }, (_, i): TilePlacement => {
    const side = i % 2 === 0 ? -1 : 1;
    const row = Math.floor(i / 2);
    const rows = side === -1 ? leftCount : rightCount;
    const y = ((rows - 1) / 2 - row) * ROW_PITCH;
    return { x: side * COLUMN_X, y, side, attachY: y * ATTACH_RATIO };
  });
}

/**
 * Circuit-board traces from the center tile to a technology tile, one polyline per lane,
 * ordered from the center outward: flat, a 45° diagonal, then flat into the tile's edge.
 */
export function circuitLanes(placement: TilePlacement): Point2[][] {
  const { x, y, side, attachY } = placement;
  const edgeX = x - side * (TECH_W / 2);
  const tipX = side * (HUB_TILE / 2 + PIN_LENGTH);
  const bendX = edgeX - side * RUN_LENGTH;
  const diagonalX = bendX - side * Math.abs(y - attachY);

  return LANES.map((lane): Point2[] => [
    [tipX, attachY + lane],
    [diagonalX, attachY + lane],
    [bendX, y + lane],
    [edgeX, y + lane],
  ]);
}

/**
 * Flat [x,y,z, x,y,z, ...] line-segment pairs for several lanes, ordered segment by segment
 * across all lanes, so a draw range grows every lane at the same time.
 */
export function interleave(lanes: readonly (readonly Point2[])[], z: number): number[] {
  const out: number[] = [];
  const segmentCount = (lanes[0]?.length ?? 1) - 1;

  for (let segment = 0; segment < segmentCount; segment += 1) {
    for (const lane of lanes) {
      const a = lane[segment];
      const b = lane[segment + 1];
      if (a && b) out.push(a[0], a[1], z, b[0], b[1], z);
    }
  }
  return out;
}

/** Decorative traces leaving a tile's outer edge (coordinates relative to the tile center). */
export function stubSegments(side: -1 | 1, index: number): number[] {
  const out: number[] = [];
  const direction = index % 4 < 2 ? 1 : -1;
  const startX = side * (TECH_W / 2);
  const x1 = startX + side * 26;
  const x2 = x1 + side * 22;
  const x3 = x2 + side * 160;

  for (const lane of LANES) {
    const y2 = lane + direction * 22;
    out.push(startX, lane, 0, x1, lane, 0);
    out.push(x1, lane, 0, x2, y2, 0);
    out.push(x2, y2, 0, x3, y2, 0);
  }
  return out;
}