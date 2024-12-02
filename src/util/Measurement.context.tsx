import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface MeasurementContextType {
  windowHeightPx: number;
}

export const MeasurementContext = createContext<MeasurementContextType>({
  windowHeightPx: 0,
});

interface MeasurementContextProviderProps {
  children: ReactNode;
}

export const MeasurementContextProvider = ({
  children,
}: MeasurementContextProviderProps) => {
  const [windowHeightPx, setWindowHeightPx] = useState(0);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry) {
        setWindowHeightPx(firstEntry.contentRect.height);
      }
    });

    observer.observe(document.body);

    return () => {
      observer.unobserve(document.body);
      observer.disconnect();
    };
  }, []);

  return (
    <MeasurementContext.Provider value={{ windowHeightPx }}>
      {children}
    </MeasurementContext.Provider>
  );
};

export const MeasurementContextDebugger = () => {
  const measurements = useContext(MeasurementContext);

  return (
    <div>
      <pre>{measurements.windowHeightPx}</pre>
    </div>
  );
};
