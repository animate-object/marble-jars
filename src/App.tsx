import { act, useContext, useEffect, useMemo, useState } from "react";
import { TailWindAndDaisyUIDemoPage } from "./CssDemoPage";
import { FullScreenVerticalContainer } from "./layout/FullScreenVerticalContainer";
import { HabitContext } from "./habit/HabitContext";
import { AppContext, UiView } from "./AppState.context";

// app state should be primarily concerned with the current view
// our app is simple so we can avoid complex routing. only habit detail needs
// a 'sub selection' to show a particular habit

const PAGES: Record<UiView, React.ReactNode> = {
  init: undefined,
  welcome: <div>Welcome Placeholder</div>,
  "habit-authoring": <div>Habit Authoring Placeholder</div>,
  "habit-list": <div>Habit List Placeholder</div>,
  "habit-detail": <div>Habit Detail Placeholder</div>,
};

const chooseActivePage = (view: UiView): React.ReactNode => {
  return PAGES[view] ?? <></>;
};

function App() {
  const { habitCount } = useContext(HabitContext);
  const { setActiveView, activeView } = useContext(AppContext);

  useEffect(() => {
    if (habitCount === 0) {
      setActiveView("welcome");
    } else {
      setActiveView("habit-list");
    }
  }, [habitCount]);

  const activePage = useMemo(() => chooseActivePage(activeView), [activeView]);

  return (
    <FullScreenVerticalContainer>{activePage}</FullScreenVerticalContainer>
  );
}

export default App;
