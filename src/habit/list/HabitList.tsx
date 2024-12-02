import { useContext } from "react";
import { HabitContext } from "../HabitContext";
import { Progress, Card, Navbar, Button } from "react-daisyui";
import { AppContext } from "../../AppState.context";

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
      onClick={onClick}
    >
      <Card.Body>
        <span className="text-sm italic sm:hidden font-light">{trigger}</span>
        <Card.Title>
          {action}
          <span className="text-sm italic hidden sm:block font-light">
            ({trigger})
          </span>
        </Card.Title>
        <div>
          <p>Progress: {progressPct}%</p>
          <Progress color="success" value={progress} max={duration} />
        </div>
      </Card.Body>
    </Card>
  );
};

export const HabitListNav = () => {
  const app = useContext(AppContext);

  return (
    <Navbar className="px-4 pt-4 bg-slate-300">
      <Navbar.Start>
        <Button
          color="primary"
          onClick={() => app.setActiveView("habit-authoring")}
        >
          New
        </Button>
      </Navbar.Start>
    </Navbar>
  );
};

export const HabitList = () => {
  const habitStore = useContext(HabitContext);

  const handleSelectHabit = (habitId: number) => {
    habitStore.selectHabit(habitId);
  };

  return (
    <>
      <HabitListNav />
      <div className="w-full p-4 pt-4 md:px-40 md:pt-20 flex flex-col gap-4">
        {habitStore.habits.map((habit) => (
          <HabitListItem
            habit={habit}
            onClick={() => handleSelectHabit(habit.id)}
          />
        ))}
      </div>
    </>
  );
};
