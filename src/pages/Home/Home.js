import { ResponsiveContext } from "../../providers/Responsiveprovider";
import { useContext } from "react";
import classNames from "classnames/bind";
import Styles from "./Home.module.scss";
import Sidebar from "../../components/Sidebar";
import Content from "../../components/Content";
let cx = classNames.bind(Styles);
function Home() {
  let { Responsive } = useContext(ResponsiveContext);

  return (
    <div className={cx("wrapper")}>
      <Sidebar Responsive={Responsive} />
      <Content Responsive={Responsive} />
    </div>
  );
}

export default Home;
