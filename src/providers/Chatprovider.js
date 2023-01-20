import React from "react";

import { useState } from "react";

let chatContext = React.createContext();

function Chatprovider({ children }) {
  let [userChat, setUserChat] = useState(null);

  return (
    <chatContext.Provider value={{ userChat, setUserChat }}>
      {children}
    </chatContext.Provider>
  );
}

export { Chatprovider, chatContext };
