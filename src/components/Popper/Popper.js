import styles from "./Popper.module.scss";
import classNames from "classnames/bind";

let cx = classNames.bind(styles);

function Popper({ children, search }) {
  return (
    <div className={cx("wrapper", { popperAccount: search })}>{children}</div>
  );
}

export default Popper;
