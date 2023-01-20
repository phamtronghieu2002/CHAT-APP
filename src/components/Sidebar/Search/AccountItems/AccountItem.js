import styles from "./AccountItem.module.scss";
import classNames from "classnames/bind";
import DefaultAvatar from "..//..//..//DefaultAvatar";

let cx = classNames.bind(styles);

function AccountItem({ acc, onClick }) {
  return (
    <div className={cx("item")} onClick={onClick}>
      <div className={cx("avatar")}>
        {acc.avatar ? <img src={acc.avatar} /> : <DefaultAvatar />}
      </div>
      <div className={cx("infor")}>
        <h3 className={cx("displayName")}>{acc.displayName}</h3>
        <span className={cx("email")}>{acc.email}</span>
      </div>
    </div>
  );
}

export default AccountItem;
