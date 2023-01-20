import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import publicRoutes from "./routes";
import { authContext } from "./providers/Authprovider";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import Configs from "./configs";

function App() {
  const { currentUser } = useContext(authContext);

  return (
    <Routes>
      {publicRoutes.map((routes, index) => {
        let Component = routes.component;
        let path = routes.path;
        let props = {};
        if (routes.path == "/" && !currentUser) {
          Component = Navigate;
          props.to = Configs.routes.login;
        }
        return (
          <Route
            key={index}
            path={path}
            element={<Component {...props} />}
          ></Route>
        );
      })}
    </Routes>
  );
}

export default App;
