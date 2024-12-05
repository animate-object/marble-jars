const HABIT_COLORS: Array<HabitColorName> = [
  "coral",
  "sunshine",
  "saffron",
  "leaf",
  "breeze",
  "ocean",
  "royal",
  "lilac",
  "rose",
  "sand",
  "auburn",
];

const HABIT_COLOR_VALUES: Record<HabitColorName, string> = {
  coral: "#ff7d7d",
  sunshine: "#ff9864",
  saffron: "#ffff91",
  leaf: "#74bc74",
  breeze: "#75b5ff",
  ocean: "#4463d4",
  royal: "#a566ff",
  lilac: "#d4a6ff",
  rose: "#ff7dcd",
  sand: "#f5deb3",
  auburn: "#632c20",
};

interface HabitColorStyles {
  base: string;
  background: string;
  border: string;
}

const classes: Record<
  Partial<HabitColorName>,
  HabitColorStyles
> = HABIT_COLORS.reduce(
  (acc: Record<Partial<string>, HabitColorStyles>, next: HabitColorName) => {
    acc[next] = {
      base: `hc-${next}`,
      background: `hc-bg-${next}`,
      border: `hc-bd-${next}`,
    };

    return acc;
  },
  {}
);

interface Hsl {
  h: number;
  s: number;
  l: number;
  hsl: string;
}

export function hexToHsl(hex: string): Hsl {
  // Remove the '#' if it exists
  hex = hex.replace(/^#/, "");

  // Parse the hex color to RGB values
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find the min and max RGB values
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let delta = max - min;

  // Calculate the luminance
  let l = (max + min) / 2;

  // Calculate the saturation
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  // Calculate the hue
  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else if (max === b) {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) {
      h += 360;
    }
  }

  // Convert luminance and saturation to percentages
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return {
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    h,
    s,
    l,
  };
}

const HABIT_COLOR_HSL_VALUES: Record<HabitColorName, Hsl> = HABIT_COLORS.reduce(
  (acc: Record<HabitColorName, Hsl>, next: HabitColorName) => {
    acc[next] = hexToHsl(HABIT_COLOR_VALUES[next]);
    return acc;
  },
  {} as Record<HabitColorName, Hsl>
);

const allClasses: Record<HabitColorName, HabitColorStyles> = classes as Record<
  HabitColorName,
  HabitColorStyles
>;

export const HabitColors = {
  list: HABIT_COLORS,
  styles: allClasses,
  base: (color: string | undefined) =>
    allClasses[color as HabitColorName]?.base ?? "",
  bg: (color: string | undefined) =>
    allClasses[color as HabitColorName]?.background ?? "",
  bd: (color: string | undefined) =>
    allClasses[color as HabitColorName]?.border ?? "",
  value: (color: string | undefined) =>
    HABIT_COLOR_VALUES[color as HabitColorName] ?? "",
  hsl: (color: string | undefined) =>
    HABIT_COLOR_HSL_VALUES[color as HabitColorName] ?? "",
};
