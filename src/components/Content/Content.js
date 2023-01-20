import { useContext } from "react";
import { chatContext } from "../../providers/Chatprovider";
import { ResponsiveContext } from "..//..//providers//Responsiveprovider";
import classNames from "classnames/bind";
import Styles from "./Content.module.scss";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import DefaultAvatar from "../DefaultAvatar/DefaultAvatar";
import Conversation from "./Conversation";
import Chatbox from "./Chatbox";
import Notify from "./Notify";
let cx = classNames.bind(Styles);

function Content({ Responsive }) {
  const { userChat } = useContext(chatContext);
  let { setResponsive } = useContext(ResponsiveContext);

  const handleClickBack = () => {
    setResponsive(false);
  };

  return (
    <div className={cx("content", { Responsive })}>
      {userChat ? (
        <>
          <div className={cx("header")}>
            <div className={cx("icon-back")} onClick={handleClickBack}>
              <i className="fa-solid fa-circle-chevron-left"></i>
            </div>
            <div className={cx("userChat")}>
              <div className={cx("avatar")}>
                {userChat ? (
                  userChat.avatar ? (
                    <img src={userChat.avatar} />
                  ) : (
                    <DefaultAvatar />
                  )
                ) : (
                  <DefaultAvatar />
                )}
                <span className={cx("status-icon")}>
                  <i className="fa-solid fa-circle"></i>
                </span>
              </div>
              <div className={cx("infor")}>
                <div className={cx("userName")}>
                  {userChat ? userChat.displayName : "Admin"}
                </div>
                <span className={cx("status")}>Đang hoạt động</span>
              </div>
            </div>
            <div className={cx("actions")}>
              <Tippy content={<span>Bắt đầu gọi thoại</span>}>
                <span className={cx("icon")}>
                  <i className="fa-solid fa-phone"></i>
                </span>
              </Tippy>
              <Tippy content={<span>Bắt đầu gọi video</span>}>
                <span className={cx("icon")}>
                  <i className="fa-solid fa-video"></i>
                </span>
              </Tippy>
              <Tippy content={<span>Thêm thông tin </span>}>
                <span className={cx("icon")}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                </span>
              </Tippy>
            </div>
          </div>
          <Conversation />
          <Chatbox />
        </>
      ) : (
        <Notify />
      )}
    </div>
  );
}

export default Content;
