import React from "react";

import { useState } from "react";

let inputContext = React.createContext();

function Inputprovider({ children }) {
  let [inputChat, setInputChat] = useState(null);

  return (
    <inputContext.Provider value={{ inputChat, setInputChat }}>
      {children}
    </inputContext.Provider>
  );
}

export { Inputprovider, inputContext };
