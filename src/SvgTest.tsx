// this file will test generating and displaying many SVG elements with random gradients

import { newPrng, NextRandom } from "pretty-good-prng";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, Join, Select } from "react-daisyui";
import { HabitColors } from "./habit/color";
import { RandomMarbleWithBaseColor } from "./marbles/RandomMarbles";

interface Settings {
  seed: string;
  count: number;
  rowFactor: number;
  baseColor: HabitColorName;
  generator: string;
  radius: number;
}

interface GeneratorProps extends Settings {
  rng: number;
  x: number;
  y: number;
  idx: number;
}

export const SimpleSvg = ({ rng, radius }: GeneratorProps) => {
  const stopFromHash = rng * 40 + 40;
  const randomColorFromHash = `hsl(${rng * 360}, 100%, 55%)`;

  const size = radius * 2;
  const offset = radius;
  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient
          id={`gradient-${rng}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="white" />
          <stop offset={`${stopFromHash}%`} stopColor={randomColorFromHash} />
        </linearGradient>
      </defs>
      <circle
        cx={offset}
        cy={offset}
        r={radius}
        stroke="black"
        strokeWidth="3"
        fill={`url(#gradient-${rng})`}
      />
    </svg>
  );
};

export const SolidColorSvg = ({ baseColor, radius }: GeneratorProps) => {
  const size = radius * 2;
  const offset = radius;
  return (
    <svg width={size} height={size}>
      <circle
        cx={offset}
        cy={offset}
        r={radius - 1}
        fill={HabitColors.value(baseColor)}
      />
    </svg>
  );
};

const MARBLE_GENERATORS: Record<
  string,
  (props: GeneratorProps) => JSX.Element
> = {
  "Simple Random": SimpleSvg,
  "Solid Color": SolidColorSvg,
  "Random Marble": RandomMarbleWithBaseColor,
};

const SettingsForm = ({
  settings,
  onUpdateSettings,
}: {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}) => {
  const { seed } = settings;
  return (
    <div className="border-2 border-slate-300 rounded-lg m-2 p-4 flex gap-4 flex-wrap">
      <h1 className="text-2xl font-light">Settings</h1>
      <Join horizontal>
        <Button
          color="primary"
          className="join-item"
          size="sm"
          onClick={() =>
            onUpdateSettings({ ...settings, seed: crypto.randomUUID() })
          }
        >
          Generate New Seed
        </Button>
        <span className="join-item border-2 border-primary flex flex-col justify-center align-middle px-2 flex-shrink-0">
          {seed}
        </span>
      </Join>

      <Join horizontal>
        <span className="join-item bg-slate-300 text-slate-800 flex flex-col justify-center align-middle px-2 flex-shrink-0">
          Number of Elements
        </span>
        <Input
          className="join-item"
          type="number"
          size="sm"
          max={1000}
          min={1}
          value={settings.count}
          onChange={(e) =>
            onUpdateSettings({ ...settings, count: parseInt(e.target.value) })
          }
        />
      </Join>
      <Join horizontal>
        <span className="join-item bg-slate-300 text-slate-800 flex flex-col justify-center align-middle px-2 flex-shrink-0">
          Row Factor
        </span>
        <Input
          className="join-item"
          type="number"
          max={2}
          min={0.8}
          step={0.1}
          size="sm"
          value={settings.rowFactor}
          onChange={(e) =>
            onUpdateSettings({
              ...settings,
              rowFactor: parseFloat(e.target.value),
            })
          }
        />
      </Join>
      <Join horizontal>
        <span className="join-item bg-slate-300 text-slate-800 flex flex-col justify-center align-middle px-2 flex-shrink-0">
          Marble Radius
        </span>
        <Input
          className="join-item"
          type="number"
          max={100}
          min={5}
          size="sm"
          value={settings.radius}
          onChange={(e) =>
            onUpdateSettings({
              ...settings,
              radius: parseInt(e.target.value),
            })
          }
        />
      </Join>
      <Join>
        <Select
          size="sm"
          className="join-item"
          value={settings.baseColor}
          onChange={(e) =>
            onUpdateSettings({
              ...settings,
              baseColor: e.currentTarget.value as HabitColorName,
            })
          }
        >
          {HabitColors.list.map((color) => (
            <Select.Option key={color} value={color}>
              {color}
            </Select.Option>
          ))}
        </Select>
        <div
          className={`w-16 ${HabitColors.bg(settings.baseColor)} join-item`}
        />
      </Join>
      <Join>
        <Select
          size="sm"
          className="join-item"
          value={settings.generator}
          onChange={(e) =>
            onUpdateSettings({
              ...settings,
              generator: e.currentTarget.value,
            })
          }
        >
          {Object.keys(MARBLE_GENERATORS).map((generator) => (
            <Select.Option key={generator} value={generator}>
              {generator}
            </Select.Option>
          ))}
        </Select>
      </Join>
    </div>
  );
};

export const SvgTest = () => {
  const [settings, setSettings] = useState<Settings>({
    seed: crypto.randomUUID(),
    count: 100,
    rowFactor: 1.2,
    baseColor: "breeze",
    generator: "Random Marble",
    radius: 30,
  });
  const { seed, count, rowFactor } = settings;
  const [activePrngSeed, setActivePrngSeed] = useState<undefined | string>();

  const prngRef = useRef<NextRandom>();

  useEffect(() => {
    const prng = newPrng(seed);
    prngRef.current = prng;
    setActivePrngSeed(seed);
  }, [rowFactor, count, seed]);

  const {
    columnCount,
    rowCount,
  }: {
    columnCount: number;
    rowCount: number;
  } = useMemo(() => {
    const columnCount = Math.ceil(Math.sqrt(count / rowFactor));
    const rowCount = Math.ceil(count / columnCount);
    return { columnCount, rowCount };
  }, [count, rowFactor]);

  const gridArray: Array<
    Array<{ x: number; y: number; idx: number; rando: number }>
  > = useMemo(() => {
    if (activePrngSeed == null) {
      return [];
    }
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      const row = [];
      for (let j = 0; j < columnCount; j++) {
        row.push({
          x: j,
          y: i,
          idx: i * columnCount + j,
          rando: prngRef.current ? prngRef.current() : 0,
        });
      }
      rows.push(row);
    }
    return rows;
  }, [columnCount, rowCount, activePrngSeed, seed]);

  const Generator = MARBLE_GENERATORS[settings.generator];

  return (
    <div>
      <SettingsForm settings={settings} onUpdateSettings={setSettings} />
      {gridArray.map((row, i) => (
        <div key={i} className="flex">
          {row.map(({ rando, x, y, idx }, j) => (
            <div key={j}>
              <Generator rng={rando} x={x} y={y} idx={idx} {...settings} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
