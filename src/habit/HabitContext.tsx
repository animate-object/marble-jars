import { createContext } from "react";

interface HabitContextType {
  habits: HabitDefinition[];
  habitCount: number;
}

export const HabitContext = createContext<HabitContextType>({
  habits: [],
  habitCount: 0,
});

// dumb provider for bootstrapping
const EmptyHabitContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <HabitContext.Provider value={{ habits: [], habitCount: 0 }}>
      {children}
    </HabitContext.Provider>
  );
};

export const HabitContextProvider = {
  Empty: EmptyHabitContextProvider,
};
