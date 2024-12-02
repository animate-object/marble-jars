import { useContext, useEffect, useMemo } from "react";
import { FullScreenVerticalContainer } from "./layout/FullScreenVerticalContainer";
import { HabitContext } from "./habit/HabitContext";
import { AppContext, UiView } from "./AppState.context";
import Welcome from "./welcome";
import { HabitAuthoringContainer } from "./habit/authoring/HabitAuthoringContainer";
import { HabitList } from "./habit/list/HabitList";

// app state should be primarily concerned with the current view
// our app is simple so we can avoid complex routing. only habit detail needs
// a 'sub selection' to show a particular habit

const PAGES: Record<UiView, React.ReactNode> = {
  init: undefined,
  welcome: <Welcome />,
  "habit-authoring": <HabitAuthoringContainer />,
  "habit-list": <HabitList />,
  "habit-detail": <div>Habit Detail Placeholder</div>,
};

const chooseActivePage = (view: UiView): React.ReactNode => {
  return PAGES[view] ?? <></>;
};

function App() {
  const { habitCount, selectedHabit } = useContext(HabitContext);
  const { setActiveView, activeView } = useContext(AppContext);

  useEffect(() => {
    if (selectedHabit) {
      setActiveView("habit-detail");
    } else if (habitCount === 0) {
      setActiveView("welcome");
    } else {
      setActiveView("habit-list");
    }
  }, [habitCount, selectedHabit]);

  const activePage = useMemo(() => chooseActivePage(activeView), [activeView]);

  return (
    <FullScreenVerticalContainer>{activePage}</FullScreenVerticalContainer>
  );
}

export default App;
