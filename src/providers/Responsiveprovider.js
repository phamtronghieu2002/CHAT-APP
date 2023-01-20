import Configs from "../configs";
import React from "react";

import { useState } from "react";

let ResponsiveContext = React.createContext();

function ResponsiveProvider({ children }) {
  let [Responsive, setResponsive] = useState(false);

  return (
    <ResponsiveContext.Provider value={{ Responsive, setResponsive }}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export { ResponsiveProvider, ResponsiveContext };
