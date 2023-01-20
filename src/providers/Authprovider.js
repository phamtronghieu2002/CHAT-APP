import React from "react";

import { useState } from "react";

let authContext = React.createContext();

function Authprovider({ children }) {
  let [currentUser, setCurrentUser] = useState(null);

  return (
    <authContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </authContext.Provider>
  );
}

export { Authprovider, authContext };
