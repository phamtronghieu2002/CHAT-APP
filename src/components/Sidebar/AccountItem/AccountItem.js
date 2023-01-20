import styles from "./AccountItem.module.scss";
import classNames from "classnames/bind";
import DefaultAvatar from "../../DefaultAvatar";
let cx = classNames.bind(styles);

function AccountItem({ avatar, displayName, lastMessage, active, onClick }) {
  return (
    <div className={cx("wrapper")}>
      <div onClick={onClick} className={cx("item", { active })}>
        <div className={cx("avatar")}>
          {avatar ? <img src={avatar} /> : <DefaultAvatar />}
        </div>
        <div className={cx("infor")}>
          <h3 className={cx("displayName")}>{displayName}</h3>
          <span className={cx("last-message")}>{lastMessage}</span>
        </div>
      </div>
    </div>
  );
}

export default AccountItem;
