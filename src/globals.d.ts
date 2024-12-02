interface TriggerSchedule {
  kind: "trigger";
  trigger: string;
}

interface PeriodicSchedule {
  kind: "periodic";
  period: "daily" | "weekly" | "monthly";
  n: number;
}

type HabitSchedule = TriggerSchedule | PeriodicSchedule;

type HabitDuration = number;

interface HabitDefinition {
  id: number;
  schedule: HabitSchedule;
  action: string;
  duration: HabitDuration;
}
