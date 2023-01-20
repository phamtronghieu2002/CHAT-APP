import { doc, arrayUnion, updateDoc } from "firebase/firestore";
import { chatContext } from "../../../providers/Chatprovider";
import { authContext } from "../../../providers/Authprovider";
import { inputContext } from "../../../providers/Inputprovider";
import { useContext, useEffect, useRef, useState } from "react";
import Configs from "../../../configs";
import classNames from "classnames/bind";
import Styles from "./Chatbox.module.scss";

let cx = classNames.bind(Styles);
const db = Configs.firebase.db;

function Chatbox() {
  let [message, setMessage] = useState("");
  let { currentUser } = useContext(authContext);
  let { userChat } = useContext(chatContext);
  let { setInputChat } = useContext(inputContext);
  let refInput = useRef();

  //focus input
  useEffect(() => {
    refInput.current.focus();
    setInputChat(refInput.current);
  }, []);

  const handleSendMessage = async (e) => {
    if (message) {
      if (e.key === "Enter") {
        const combinedID =
          currentUser.uid > userChat.uid
            ? currentUser.uid + userChat.uid
            : userChat.uid + currentUser.uid;
        // update lastmessage to userChats
        try {
          await updateDoc(doc(db, "userChats", userChat.uid), {
            [`${combinedID}.infor`]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              avatar: currentUser.avatar,
            },
            [`${combinedID}.lastMessage`]: message,
            [`${combinedID}.timeStamp`]: new Date(),
          });

          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [`${combinedID}.infor`]: {
              uid: userChat.uid,
              displayName: userChat.displayName,
              avatar: userChat.avatar,
            },
            [`${combinedID}.lastMessage`]: message,
            [`${combinedID}.timeStamp`]: new Date(),
          });
        } catch (error) {
          alert(error);
        }
        //update message to chats
        try {
          const obj = {
            senderID: currentUser.uid,
            createdAT: new Date(),
            message,
          };
          await updateDoc(doc(db, "chats", combinedID), {
            messages: arrayUnion(obj),
          });
        } catch (error) {
          alert(error);
        }
        setMessage("");
      }
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("actions")}>
        <span className={cx("icon-action")}>
          <i className="fa-solid fa-circle-plus"></i>
        </span>
        {!message && (
          <>
            <span className={cx("icon-action")}>
              <i className="fa-solid fa-image"></i>
            </span>
            <span className={cx("icon-action")}>
              <i className="fa-solid fa-note-sticky"></i>
            </span>
          </>
        )}
      </div>
      <input
        value={message}
        ref={refInput}
        onKeyDown={(e) => {
          handleSendMessage(e);
        }}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        type="text"
        placeholder="Aa"
      />
      {message && (
        <span className={cx("icon-action", "icon-send")}>
          <i className="fa-solid fa-paper-plane"></i>
        </span>
      )}
    </div>
  );
}

export default Chatbox;
