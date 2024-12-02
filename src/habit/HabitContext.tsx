import { createContext, useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "../useLocalStorage";

interface HabitContextType {
  habits: Habit[];
  habitCount: number;
  selectedHabit?: Habit;
  maxHabits?: number;
  clearAllHabits: () => void;
  createNewHabit: (definition: HabitDefinition) => void;
  trackHabitProgress: (habitId: number) => void;
  selectHabit: (habitId: number) => void;
  clearSelectedHabit: () => void;
  deleteHabit: (habitId: number) => void;
}

export const HabitContext = createContext<HabitContextType>({
  habits: [],
  habitCount: 0,
  createNewHabit: () => {},
  trackHabitProgress: (_habitId: number) => {},
  clearAllHabits: () => {},
  selectHabit: (_habitId: number) => {},
  clearSelectedHabit: () => {},
  deleteHabit: (_habitId: number) => {},
});

// dumb provider for bootstrapping
const EmptyHabitContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <HabitContext.Provider
      value={{
        habits: [],
        habitCount: 0,
        createNewHabit: () => {},
        trackHabitProgress: () => {},
        clearAllHabits: () => {},
        selectHabit: () => {},
        clearSelectedHabit: () => {},
        deleteHabit: () => {},
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

const PersistentHabitContextProvider = ({
  children,
  maxHabits = 5,
}: {
  children: React.ReactNode;
  maxHabits?: number;
}) => {
  const [habits, setHabits] = useLocalStorage<Habit[]>("habits", []);
  const [selectedHabitId, setSelectedHabitId] = useState<number | undefined>();

  const createNewHabit = (definition: HabitDefinition) => {
    if (habits.length >= maxHabits) {
      return;
    }
    setHabits([
      ...habits,
      {
        id: habits.length + 1,
        definition,
        progress: 0,
      },
    ]);
  };

  const trackHabitProgress = (habitId: number) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? { ...habit, progress: habit.progress + 1 }
          : habit
      )
    );
  };

  const clearAllHabits = () => {
    setHabits([]);
  };

  const selectHabit = (habitId: number) => {
    setSelectedHabitId(habitId);
  };

  const habitCount = useMemo(() => habits.length, [habits]);

  const selectedHabit = useMemo(
    () => habits.find((habit) => habit.id === selectedHabitId),
    [habits, selectedHabitId]
  );

  const clearSelectedHabit = useCallback(() => {
    setSelectedHabitId(undefined);
  }, []);

  const deleteHabit = useCallback(
    (habitId: number) => {
      setHabits(habits.filter((habit) => habit.id !== habitId));
    },
    [habits, setHabits]
  );

  return (
    <HabitContext.Provider
      value={{
        habits,
        habitCount,
        selectedHabit,
        createNewHabit,
        trackHabitProgress,
        clearAllHabits,
        selectHabit,
        clearSelectedHabit,
        deleteHabit,
        maxHabits,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const HabitContextProvider = {
  Empty: EmptyHabitContextProvider,
  Peristent: PersistentHabitContextProvider,
};
