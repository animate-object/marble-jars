import { useContext } from "react";
import { HabitContext } from "../HabitContext";
import { Progress, Card, Navbar, Button } from "react-daisyui";
import { AppContext } from "../../AppState.context";
import { AppNavBar } from "../../layout/AppNavBar";
import { HabitColors } from "../color";

interface HabitListItemProps {
  habit: Habit;
  onClick: () => void;
}
const HabitListItem = ({
  habit: {
    id,
    definition: {
      action,
      schedule: { trigger },
      duration,
      color,
    },
    progress,
  },
  onClick,
}: HabitListItemProps) => {
  const progressPct = ((progress / duration) * 100).toFixed(1);
  return (
    <Card
      key={id}
      className="cursor-pointer w-full border-sky-200"
      bordered
      compact
    >
      <Card.Body onClick={onClick}>
        <span className="text-sm italic sm:hidden font-light">{trigger}</span>
        <Card.Title className={HabitColors.base(color)}>
          {action}
          <span className="text-sm italic hidden sm:block font-light">
            ({trigger})
          </span>
        </Card.Title>
        <div>
          <p>Progress: {progressPct}%</p>
          <Progress
            className={HabitColors.base(color)}
            value={progress}
            max={duration}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export const HabitListNav = () => {
  const app = useContext(AppContext);
  const { maxHabits, habitCount } = useContext(HabitContext);

  const newHabitsDisallowed = maxHabits != null && habitCount >= maxHabits;

  return (
    <AppNavBar>
      <Navbar.Start>
        {!newHabitsDisallowed && (
          <Button
            color="primary"
            size="sm"
            onClick={() => app.setActiveView("habit-authoring")}
          >
            + New
          </Button>
        )}
        {newHabitsDisallowed && (
          <span className="text-slate-700">Max {maxHabits} habits</span>
        )}
      </Navbar.Start>
    </AppNavBar>
  );
};

export const HabitList = () => {
  const habitStore = useContext(HabitContext);

  const handleSelectHabit = (habitId: HabitId) => {
    habitStore.selectHabit(habitId);
  };

  return (
    <>
      <HabitListNav />
      <div className="w-full p-4 pt-4 md:px-40 md:pt-20 flex flex-col gap-4 overflow-y-auto">
        {habitStore.habits.map((habit) => (
          <HabitListItem
            key={habit.id}
            habit={habit}
            onClick={() => handleSelectHabit(habit.id)}
          />
        ))}
      </div>
    </>
  );
};
