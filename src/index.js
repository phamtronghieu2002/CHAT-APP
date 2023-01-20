import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalStyles from "./components/GlobalStyles";
import { Authprovider } from "./providers/Authprovider";
import { Chatprovider } from "./providers/Chatprovider";
import { BrowserRouter as Router } from "react-router-dom";
import { Inputprovider } from "./providers/Inputprovider";
import { ResponsiveProvider } from "./providers/Responsiveprovider";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Authprovider>
    <Chatprovider>
      <Inputprovider>
        <ResponsiveProvider>
          <Router basename={process.env.PUBLIC_URL}>
            <GlobalStyles>
              <App />
            </GlobalStyles>
          </Router>
        </ResponsiveProvider>
      </Inputprovider>
    </Chatprovider>
  </Authprovider>
);

reportWebVitals();
