import React, { createContext, useState } from "react";

export type UiView =
  | "init"
  | "welcome"
  | "habit-authoring"
  | "habit-list"
  | "habit-detail";

interface AppStateContextType {
  activeView: UiView;
  setActiveView: (view: UiView) => void;
}

export const AppContext = createContext<AppStateContextType>({
  activeView: "init",
  setActiveView: () => {},
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeView, setActiveView] = useState<UiView>("init");

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
