import { chatContext } from "../../../providers/Chatprovider";
import { useContext } from "react";
import classNames from "classnames/bind";
import Styles from "./Messages.module.scss";
import DefaultAvatar from "../../DefaultAvatar/DefaultAvatar";

let cx = classNames.bind(Styles);

function Messages({ messages, sender, timeStamp }) {
  const { userChat } = useContext(chatContext);

  return (
    <div className={cx("wrapper", { sender })}>
      <div className={cx("avatar")}>
        {!sender &&
          (userChat.avatar ? <img src={userChat.avatar} /> : <DefaultAvatar />)}
      </div>
      <div className={cx("wp-messages")}>
        {messages.map((m, index) => (
          <div
            className={cx("messages")}
            key={index}
            style={{ position: "relative" }}
          >
            <p className={cx("text", { send_message: sender })}>{m.text}</p>
            <div className={cx("timeStamp")}>{m.timeStamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
