interface Cell {
  x: number;
  y: number;
  fillColor?: string;
  isUnfillable?: boolean;
}

interface GenerateCellOptions {
  x: number;
  y: number;
}

interface GridGenOptions<T> {
  // closer to one, the skinnier the grid
  skinnyFactor?: number;
  generateCell: (o: GenerateCellOptions) => T;
}

interface GridData<T> {
  height: number;
  width: number;
  grid: T[][];
}

export const generateGrid = <T extends Cell>(
  capacity: number,
  options: GridGenOptions<T>
): GridData<T> => {
  logMessage("Generating Grid");
  const { skinnyFactor, generateCell } = {
    skinnyFactor: 0.9,
    ...options,
  };

  const width = Math.floor(Math.sqrt(capacity) * skinnyFactor);
  const height = Math.ceil(capacity / width);

  const grid: T[][] = [];

  for (let y = 0; y < height; y++) {
    let row: T[] = [];
    for (let x = 0; x < width; x++) {
      row.push(generateCell({ x, y }));
    }
    grid.push(row);
  }

  return {
    height,
    width,
    grid,
  };
};

export const generateBasicCell = ({ x, y }: GenerateCellOptions): Cell => ({
  x,
  y,
  fillColor: undefined,
  isUnfillable: undefined,
});

type FillCellFn = (cell: Cell, fillIdx: number) => Cell;

export const annotateCells = (
  capacity: number,
  filledCount: number,
  gridData: GridData<Cell>,
  fillCell: FillCellFn
): GridData<Cell> => {
  logMessage("Annotating Cells");
  const { height, width } = gridData;
  let { grid } = gridData;

  const remainder = capacity % width;
  const unfillableCells = remainder == 0 ? 0 : width - remainder;

  logMessage(`Unfillable Cells ${unfillableCells}`);

  for (let x = 0; x < unfillableCells; x++) {
    const targetX = width - x - 1;
    logMessage(`Cell at (${targetX},0) is unfillable`);
    grid[0][targetX] = { ...grid[0][targetX], isUnfillable: true };
  }

  // we fill filled cells from the bottom up
  for (let i = 0; i < filledCount; i++) {
    const yOffset = Math.floor(i / width);

    const y = height - yOffset - 1;
    const x = i % width;
    logMessage(`Filling cell at (${x},${y})`);
    grid[y][x] = fillCell(grid[y][x], i);
  }

  return {
    height,
    width,
    grid,
  };
};

const logMessage = (message: string) => {
  console.info(`Grid:: ${message}`);
};
