const cache = new Map<string, string[][]>();

export async function loadPetImage(url: string): Promise<string[][] | null> {
  if (cache.has(url)) return cache.get(url)!;

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.crossOrigin = 'anonymous';
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });

    const size = 32;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, size, size);
    const grid: string[][] = [];

    for (let y = 0; y < size; y++) {
      const row: string[] = [];
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const r = imageData.data[idx]!;
        const g = imageData.data[idx + 1]!;
        const b = imageData.data[idx + 2]!;
        const a = imageData.data[idx + 3]!;
        if (a < 128) {
          row.push('_');
        } else {
          row.push(rgbToHex(r, g, b));
        }
      }
      grid.push(row);
    }

    cache.set(url, grid);
    return grid;
  } catch {
    return null;
  }
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
