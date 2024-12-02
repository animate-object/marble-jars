// grid based detail experience for habit tracking

import { useContext, useMemo } from "react";
import { annotateCells, generateBasicCell, generateGrid } from "./grid";
import { MeasurementContext } from "../../../util/Measurement.context";

interface Props {
  habit: Habit;
}
export const GridDetail = ({ habit }: Props) => {
  const { definition, progress } = habit;

  const { duration, color } = definition;

  const capacity = duration;
  const filled = progress;
  const fillColor = color;

  const { windowHeightPx } = useContext(MeasurementContext);
  const { grid, height: gridHeight } = useMemo(() => {
    const gridData = generateGrid(capacity, {
      generateCell: generateBasicCell,
      skinnyFactor: 0.8,
    });
    return annotateCells(capacity, filled, gridData, (cell) => ({
      ...cell,
      fillColor,
    }));
  }, [capacity, filled]);

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
              className={`bg-${cell.fillColor}`}
              style={{
                width: cellSize,
                height: cellSize,
                border: "0.5px solid #eeeeee",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
