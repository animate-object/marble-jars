import { Button } from "react-daisyui";
import EmptyJar from "./EmptyJar";
import { useContext } from "react";
import { AppContext } from "../AppState.context";

const Welcome = (): JSX.Element => {
  const { setActiveView } = useContext(AppContext);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="text-4xl">Marble Jars</h1>
      <p className="italic">Visualize habits to make them real</p>
      <EmptyJar strokeWidth={1} />
      <Button color="primary" onClick={() => setActiveView("habit-authoring")}>
        Get Started
      </Button>
    </div>
  );
};

export default Welcome;
