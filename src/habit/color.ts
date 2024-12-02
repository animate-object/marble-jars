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
};
