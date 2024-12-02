import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HabitContextProvider } from "./habit/HabitContext.tsx";
import { AppContextProvider } from "./AppState.context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppContextProvider>
      <HabitContextProvider.Peristent>
        <App />
      </HabitContextProvider.Peristent>
    </AppContextProvider>
  </StrictMode>
);
