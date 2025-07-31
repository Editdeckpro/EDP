"use client";
import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";

type TourContextType = {
  startTour: boolean;
  setStartTour: Dispatch<SetStateAction<boolean>>;
  setProgress: Dispatch<SetStateAction<number>>;
  progress: number;
  loaded: boolean;
  handleStartTour: () => void;
  handleTourEnd: () => void;
  totalSteps: number;
};

const TourContext = createContext<TourContextType | null>(null);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [startTour, setStartTour] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState<number>(1);
  const totalSteps: number = 4;

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleStartTour = () => setStartTour(true);
  const handleTourEnd = () => setStartTour(false);

  return (
    <TourContext.Provider
      value={{
        startTour,
        setStartTour,
        loaded,
        handleStartTour,
        handleTourEnd,
        totalSteps,
        setProgress,
        progress,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

// ✅ Always validate context access with a custom hook
export const useTour = (): TourContextType => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
