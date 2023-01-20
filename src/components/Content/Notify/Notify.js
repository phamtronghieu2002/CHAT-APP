import classNames from "classnames/bind";
import Styles from "./Notify.module.scss";

let cx = classNames.bind(Styles);
function Notify() {
  return (
    <div className={cx("wrapper")}>
      <p>Chưa có cuộc trò chuyện hãy tìm kiếm hoặc chọn người trò chuyện</p>
    </div>
  );
}

export default Notify;
