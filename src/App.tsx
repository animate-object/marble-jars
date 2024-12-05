import { useContext, useEffect, useMemo } from "react";
import { FullScreenVerticalContainer } from "./layout/FullScreenVerticalContainer";
import { HabitContext } from "./habit/HabitContext";
import { AppContext, UiView } from "./AppState.context";
import Welcome from "./welcome";
import { HabitAuthoringContainer } from "./habit/authoring/HabitAuthoringContainer";
import { HabitList } from "./habit/list/HabitList";
import { HabitDetailContainer } from "./habit/detail/HabitDetail";
import { SvgTest } from "./SvgTest";

// app state should be primarily concerned with the current view
// our app is simple so we can avoid complex routing. only habit detail needs
// a 'sub selection' to show a particular habit

const PAGES: Record<UiView, React.ReactNode> = {
  init: undefined,
  welcome: <Welcome />,
  "habit-authoring": <HabitAuthoringContainer />,
  "habit-list": <HabitList />,
  "habit-detail": <HabitDetailContainer />,
  "svg-testing": <SvgTest />,
};

const chooseActivePage = (view: UiView): React.ReactNode => {
  return PAGES[view] ?? <></>;
};

// not routing per se, but want to be able to force a particular view
// for testing and development
const readQueryParams = (key: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(key);
  return value;
};

function App() {
  const { habitCount, selectedHabit } = useContext(HabitContext);
  const { setActiveView, activeView } = useContext(AppContext);

  useEffect(() => {
    const viewOverride = readQueryParams("vo");

    if (viewOverride != null) {
      setActiveView(viewOverride as UiView);
    } else if (selectedHabit) {
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
