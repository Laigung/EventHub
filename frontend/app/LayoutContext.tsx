import React from "react";
import { createContext, useState } from "react";

type LayoutContextType = {
  menuKey: string;
  setMenuKey: (key: string) => void;
};

const defaultLayoutContext: LayoutContextType = {
  menuKey: "homeLink",
  setMenuKey: () => {},
};

const LayoutContext = createContext<LayoutContextType>(defaultLayoutContext);

export default function LayoutContextProvider({
  children,
}: React.PropsWithChildren) {
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>("homeLink");

  return (
    <LayoutContext.Provider
      value={{
        menuKey: selectedMenuKey,
        setMenuKey: setSelectedMenuKey,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  return React.useContext(LayoutContext);
}
