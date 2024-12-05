interface TriggerSchedule {
  kind: "trigger";
  trigger: string;
}

type HabitColorName =
  | "coral"
  | "sunshine"
  | "saffron"
  | "leaf"
  | "breeze"
  | "ocean"
  | "royal"
  | "lilac"
  | "rose"
  | "sand"
  | "auburn";

type HabitSchedule = TriggerSchedule;

type HabitDuration = number;

type HabitId = string;

type SchematizedData<T> = {
  schemaVersion: string;
  data: T;
};

interface HabitDefinition {
  schedule: HabitSchedule;
  action: string;
  duration: HabitDuration;
  color: HabitColorName;
}

interface Habit {
  id: HabitId;
  definition: HabitDefinition;
  progress: number;
}

interface SvgSettings {
  // the seed of the prng
  seed: string;

  // a random number from a prng, 0-1
  rng: number;
  // the marbles column offset counting from the left, starting at 0
  x: number;

  // the marbles row offset counting from the top, starting at 0
  y: number;

  // the index of the marble in the list of marbles, starting at 0
  idx: number;

  // base color name
  baseColor: HabitColorName;

  // marble radius in pixels
  radius: number;
}
