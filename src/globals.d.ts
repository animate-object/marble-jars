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
  | "sand";

type HabitSchedule = TriggerSchedule;

type HabitDuration = number;

interface HabitDefinition {
  id: number;
  schedule: HabitSchedule;
  action: string;
  duration: HabitDuration;
  color: HabitColorName;
}

interface Habit {
  id: number;
  definition: HabitDefinition;
  progress: number;
}
