import React, { createContext, useState, useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

type Context = {
  count: number;
  increment: () => void;
};

const SimulationContext = createContext<Context | null>(null);

export const SimulationContextProvider = ({ children }: Props) => {
  const [count, setCount] = useState(0);
  //TODO: boilerpalte! change!
  useEffect(() => {
    setCount(42);
  }, []);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <SimulationContext.Provider value={{ count, increment }}>
      {children}
    </SimulationContext.Provider>
  );
};
