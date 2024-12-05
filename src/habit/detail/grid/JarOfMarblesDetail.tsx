// grid based detail experience for habit tracking

import { useContext, useMemo } from "react";
import { annotateCells, generateBasicCell, generateGrid } from "./grid";
import { MeasurementContext } from "../../../util/Measurement.context";
import { RandomMarbleWithBaseColor } from "../../../marbles/RandomMarbles";
import { newPrng } from "pretty-good-prng";

interface Props {
  habit: Habit;
}
export const JarOfMarblesDetail = ({ habit }: Props) => {
  const { definition, progress, id: seed } = habit;

  const { duration, color } = definition;

  const capacity = duration;
  const filled = Math.min(progress, duration);
  const fillColor = color;

  const { windowHeightPx } = useContext(MeasurementContext);
  const {
    grid,
    height: gridHeight,
    size: gridSize,
  } = useMemo(() => {
    const gridData = generateGrid(capacity, {
      generateCell: generateBasicCell,
      skinnyFactor: 0.8,
    });
    return annotateCells(capacity, filled, gridData, (cell) => ({
      ...cell,
      fillColor,
    }));
  }, [capacity, filled]);

  const randomNumbersForEveryCell = useMemo(() => {
    const prng = newPrng(seed);

    const randomNumbers = [];
    for (let i = 0; i < gridSize; i++) {
      randomNumbers.push(prng());
    }
    console.log("randomNumbers", randomNumbers);
    return randomNumbers;
  }, [seed, gridSize]);

  const cellSize = useMemo(() => {
    const maxHeight = windowHeightPx * 0.6;
    return Math.floor(maxHeight / gridHeight);
  }, [windowHeightPx, gridHeight]);

  return (
    <div className="flex flex-col items-center">
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={x}
              style={{
                width: cellSize,
                height: cellSize,
                border: "0.5px solid #eeeeee",
              }}
            >
              {cell.fillColor && (
                <RandomMarbleWithBaseColor
                  key={x}
                  radius={cellSize / 2}
                  rng={randomNumbersForEveryCell[cell.idx] ?? 1}
                  baseColor={cell.fillColor}
                  seed={seed}
                  x={x}
                  y={y}
                  idx={x * row.length + y}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
