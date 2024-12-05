import { useMemo } from "react";
import { HabitColors } from "../habit/color";

type Props = SvgSettings;

const adjustHue = (baseColorName: HabitColorName, rng: number): string => {
  const habitColor = HabitColors.hsl(baseColorName);

  const lightnessScaleFactor = 1.4 - projectNumber(80, rng) / 100;

  const l = habitColor.l * lightnessScaleFactor;

  const satAdjuster = rng << 1;
  const shouldAdjustSat = (rng << 2) % 3 === 0;

  const satScaleFactor = 1.3 - projectNumber(75, satAdjuster) / 100;

  const s = habitColor.s * (shouldAdjustSat ? satScaleFactor : 1);

  const hsl = `hsl(${habitColor.h}, ${s}%, ${l}%)`;

  return hsl;
};

const projectNumber = (
  targetDomain: number,
  rawN: number,
  rawNDomain: number | undefined = undefined
) => {
  // if nDomain is not provided, it's assumed to be n rounded up to the next power of 10
  // e.g. 1234 -> 10000, 94 -> 100
  const n = rawN === 0 ? 1 : rawN;
  const nDomain = rawNDomain || Math.pow(10, Math.ceil(Math.log10(n)));

  const projected = Math.ceil((n / nDomain) * targetDomain);

  return projected;
};

const selectFromArrayByProjection = <T,>(
  n: number,
  array: T[],
  nDomain: number | undefined = undefined
): T => {
  const index = projectNumber(array.length, n, nDomain) - 1;
  if (index > array.length - 1 || index < 0) {
    console.warn(
      `Index ${index} out of bounds for array of length ${array.length}`
    );
    return array[array.length - 1];
  }
  return array[index];
};

interface FillData {
  defs: React.ReactNode[];
  fill: string;
}

type FillGenerator = (props: Props, rng: number) => FillData;

const selectAlternateHabitColor = (
  baseColor: HabitColorName,
  random: number
): HabitColorName => {
  const candidates = HabitColors.list.filter((color) => color !== baseColor);

  return selectFromArrayByProjection(random, candidates);
};

const selectAlternateHabitColorValue = (
  baseColor: HabitColorName,
  random: number
): string => {
  return HabitColors.value(selectAlternateHabitColor(baseColor, random));
};

const sometimesSelectAlternateHabitColorValue = (
  baseColor: HabitColorName,
  random: number,
  oneIn: number,
  bitShiftBy: number = 1,
  defaultValue: string = "white"
): string => {
  const bitshifted = random >> bitShiftBy;
  if (bitshifted % oneIn === 0) {
    return selectAlternateHabitColorValue(baseColor, random);
  }
  return defaultValue;
};

// const solidColorFillGenerator: FillGenerator = ({ baseColor }) => {
//   return {
//     defs: [],
//     fill: HabitColors.value(baseColor),
//   };
// };

const gradientFillGenerator: FillGenerator = (
  { baseColor, idx, seed },
  tuning
) => {
  const gradientId = `gradient-${seed}-${idx}`;

  const rotationDeg = 90 - (tuning % 180);

  const stopPositions = useMemo(() => {
    const base = projectNumber(30, tuning) + 10;
    const stopPosition = projectNumber(20, tuning) + 50;
    let stopPositions = [base, stopPosition];

    return stopPositions;
  }, [tuning]);

  const adjustedBaseColor = adjustHue(baseColor, tuning);

  const gradientColor = sometimesSelectAlternateHabitColorValue(
    baseColor,
    tuning,
    13
  );

  return {
    defs: [
      <linearGradient
        id={gradientId}
        key={gradientId}
        gradientTransform={`rotate(${rotationDeg})`}
        x1="0%"
        y1="0%"
        x2="80%"
        y2="80%"
      >
        <stop
          offset={`${stopPositions[0]}%`}
          style={{ stopColor: adjustedBaseColor, stopOpacity: 1 }}
        />
        <stop
          offset={`${stopPositions[1]}%`}
          style={{ stopColor: gradientColor, stopOpacity: 1 }}
        />
      </linearGradient>,
    ],
    fill: `url(#${gradientId})`,
  };
};

const stripeFillGenerator: FillGenerator = (
  { baseColor, idx, seed },
  tuning
) => {
  const gradientId = `gradient-${seed}-${idx}`;

  const bitshifted = tuning >> 1;

  const rotationDeg = 90 - (bitshifted % 180);

  const stopPositions = useMemo(() => {
    const stripeWidth = projectNumber(30, tuning) + 10;
    const halfStripeWidth = stripeWidth / 2;
    const stripeCenter = projectNumber(30, tuning) + 30;
    const stripeStart = stripeCenter - halfStripeWidth;
    const stripeEnd = stripeCenter + halfStripeWidth;

    const stopPositions = [0, stripeStart, stripeCenter, stripeEnd, 100];

    return stopPositions;
  }, [tuning]);
  const stripeColor = sometimesSelectAlternateHabitColorValue(
    baseColor,
    tuning,
    7
  );
  const adjustedBaseColor = adjustHue(baseColor, tuning);

  return {
    defs: [
      <linearGradient
        id={gradientId}
        key={gradientId}
        gradientTransform={`rotate(${rotationDeg})`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop
          offset={`${stopPositions[0]}%`}
          style={{ stopColor: adjustedBaseColor, stopOpacity: 1 }}
        />
        <stop
          offset={`${stopPositions[1]}%`}
          style={{ stopColor: adjustedBaseColor, stopOpacity: 1 }}
        />
        <stop
          offset={`${stopPositions[2]}%`}
          style={{ stopColor: stripeColor, stopOpacity: 1 }}
        />
        <stop
          offset={`${stopPositions[3]}%`}
          style={{ stopColor: adjustedBaseColor, stopOpacity: 1 }}
        />
        <stop
          offset={`${stopPositions[4]}%`}
          style={{ stopColor: adjustedBaseColor, stopOpacity: 1 }}
        />
      </linearGradient>,
    ],
    fill: `url(#${gradientId})`,
  };
};

const radialGradientFillGenerator: FillGenerator = (
  { baseColor, idx, seed },
  tuning
) => {
  const gradientId = `gradient-${seed}-${idx}`;

  const adjustedBaseColor = adjustHue(baseColor, tuning);

  const bitshifted = tuning >> 1;
  const evenTuning = tuning % 2 === 0;
  const evenBitshifted = bitshifted % 2 === 0;

  const cx = projectNumber(30, tuning) + (evenTuning ? 0 : 70);
  const cy = projectNumber(30, tuning) + (evenBitshifted ? 70 : 0);

  const gradientColor = sometimesSelectAlternateHabitColorValue(
    baseColor,
    tuning,
    11
  );

  return {
    defs: [
      <radialGradient
        id={gradientId}
        key={gradientId}
        cx={`${cx}%`}
        cy={`${cy}%`}
        r="100%"
        fx="50%"
        fy="50%"
      >
        <stop
          offset="0%"
          style={{ stopColor: gradientColor, stopOpacity: 1 }}
        />
        <stop
          offset="50%"
          style={{ stopColor: adjustedBaseColor, stopOpacity: 1 }}
        />
      </radialGradient>,
    ],
    fill: `url(#${gradientId})`,
  };
};

const slightlyDarkerOrLighterFillGenerator: FillGenerator = (
  { baseColor },
  tuning
) => {
  const hsl = adjustHue(baseColor, tuning);
  return {
    defs: [],
    fill: hsl,
  };
};

const solidColorFillGenerator: FillGenerator = ({ baseColor }) => {
  return {
    defs: [],
    fill: HabitColors.value(baseColor),
  };
};

const GENERATOR_MAP: Record<string, FillGenerator> = {
  solid: solidColorFillGenerator,
  gradient: gradientFillGenerator,
  stripe: stripeFillGenerator,
  radial: radialGradientFillGenerator,
  lightness: slightlyDarkerOrLighterFillGenerator,
};

const FILL_GENERATOR_BAG: Array<keyof typeof GENERATOR_MAP> = [
  "solid",
  "gradient",
  "stripe",
  "stripe",
  "radial",
  "lightness",
  "lightness",
  "lightness",
  "lightness",
  "lightness",
  "lightness",
];

export const RandomMarbleWithBaseColor = (props: Props) => {
  const { radius, rng } = props;
  const size = radius * 2;
  const offset = radius;

  // produce a six digit number
  const expandedRandom = Math.floor(rng * 10 ** 6);

  // first two digits are the selector
  const selectorPart = Math.floor(expandedRandom / 10 ** 4);
  // last four digits are the tuning
  const tuningPart = expandedRandom % 10 ** 4;

  // allows some spacing
  const trueRadius = radius - 1;

  const generatorName = selectFromArrayByProjection(
    selectorPart,
    FILL_GENERATOR_BAG
  );

  const generator = GENERATOR_MAP[generatorName];

  if (typeof generator !== "function") {
    console.warn({ generator, msg: "generator is not a function" });
    return null;
  }

  const { defs, fill } = generator(props, tuningPart);

  return (
    <svg width={size} height={size}>
      <defs>{...defs}</defs>
      <circle cx={offset} cy={offset} r={trueRadius} fill={fill} />
    </svg>
  );
};
