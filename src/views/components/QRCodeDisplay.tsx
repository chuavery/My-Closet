interface Props {
  id: string;
  size?: number;
}

function makeGrid(id: string): boolean[][] {
  const N = 21;
  const grid: boolean[][] = Array.from({ length: N }, () => Array(N).fill(false));

  // Finder pattern helper
  const finder = (rOff: number, cOff: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        grid[rOff + r][cOff + c] =
          r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      }
    }
  };
  finder(0, 0);
  finder(0, 14);
  finder(14, 0);

  // Timing strips
  for (let i = 8; i < 13; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Data fill – deterministic from id
  let h = 5381;
  for (let i = 0; i < id.length; i++) h = ((h << 5) + h + id.charCodeAt(i)) | 0;

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const inFinder = (r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8);
      if (inFinder || r === 6 || c === 6) continue;
      h = ((h << 5) + h + r * N + c) | 0;
      grid[r][c] = (h & 3) !== 0; // ~75% density
    }
  }

  return grid;
}

export default function QRCodeDisplay({ id, size = 120 }: Props) {
  const grid = makeGrid(id);
  const N = grid.length;
  const cell = size / N;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className="block"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect width={size} height={size} fill="white" />
      {grid.flatMap((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill="#252320"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
