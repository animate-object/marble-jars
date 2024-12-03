import { createContext, useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "../useLocalStorage";

interface HabitContextType {
  habits: Habit[];
  habitCount: number;
  selectedHabit?: Habit;
  maxHabits?: number;
  clearAllHabits: () => void;
  createNewHabit: (definition: HabitDefinition) => void;
  trackHabitProgress: (habitId: HabitId) => void;
  selectHabit: (habitId: HabitId) => void;
  clearSelectedHabit: () => void;
  deleteHabit: (habitId: HabitId) => void;
}

export const HabitContext = createContext<HabitContextType>({
  habits: [],
  habitCount: 0,
  createNewHabit: () => {},
  trackHabitProgress: (_habitId: HabitId) => {},
  clearAllHabits: () => {},
  selectHabit: (_habitId: HabitId) => {},
  clearSelectedHabit: () => {},
  deleteHabit: (_habitId: HabitId) => {},
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

type SchematizedHabitList = SchematizedData<Habit[]>;

const PersistentHabitContextProvider = ({
  children,
  maxHabits = 5,
}: {
  children: React.ReactNode;
  maxHabits?: number;
}) => {
  const [{ data: habits }, setHabits] = useLocalStorage<SchematizedHabitList>(
    "habit-list",
    {
      schemaVersion: "1",
      data: [],
    }
  );
  const [selectedHabitId, setSelectedHabitId] = useState<HabitId | undefined>();

  const setHabitsWithSchema = useCallback((habits: Habit[]) => {
    setHabits({ schemaVersion: "1", data: habits });
  }, []);

  const createNewHabit = (definition: HabitDefinition) => {
    if (habits.length >= maxHabits) {
      return;
    }
    setHabitsWithSchema([
      ...habits,
      {
        id: crypto.randomUUID(),
        definition,
        progress: 0,
      },
    ]);
  };

  const trackHabitProgress = (habitId: HabitId) => {
    setHabitsWithSchema(
      habits.map((habit) =>
        habit.id === habitId
          ? { ...habit, progress: habit.progress + 1 }
          : habit
      )
    );
  };

  const clearAllHabits = () => {
    setHabitsWithSchema([]);
  };

  const selectHabit = (habitId: HabitId) => {
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
    (habitId: HabitId) => {
      setHabitsWithSchema(habits.filter((habit) => habit.id !== habitId));
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
