import Configs from "../configs";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
const publicRoutes = [
  {
    path: Configs.routes.home,
    component: Home,
  },
  {
    path: Configs.routes.login,
    component: Login,
  },
  {
    path: Configs.routes.register,
    component: Register,
  },
];

const privateRoutes = [];

export default publicRoutes;
