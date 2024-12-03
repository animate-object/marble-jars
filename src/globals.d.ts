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
