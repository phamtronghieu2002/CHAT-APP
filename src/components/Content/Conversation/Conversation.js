import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useState, useEffect, useRef } from "react";
import { chatContext } from "../../../providers/Chatprovider";
import { authContext } from "../../../providers/Authprovider";

import classNames from "classnames/bind";
import Styles from "./Conversation.module.scss";
import Messages from "../Messages/";
import Configs from "../../../configs";

let cx = classNames.bind(Styles);
const db = Configs.firebase.db;

function Conversation() {
  const { currentUser } = useContext(authContext);
  const { userChat } = useContext(chatContext);
  let [conversation, setConversation] = useState([]);

  const combinedID =
    currentUser.uid > userChat.uid
      ? currentUser.uid + userChat.uid
      : userChat.uid + currentUser.uid;

  const docChat = doc(db, "chats", combinedID);

  useEffect(() => {
    return onSnapshot(docChat, (docSnap) => {
      try {
        if (docSnap.exists()) {
          setConversation(docSnap.data().messages);
        }
      } catch (error) {
        alert(error);
      }
    });
  }, [userChat]);

  const handleTime = (time) => {
    let myDate = time;
    const fireBaseTime = new Date(
      myDate.seconds * 1000 + myDate.nanoseconds / 1000000
    );
    const atTime = fireBaseTime.toLocaleTimeString();
    return atTime;
  };
  const RenderMesssage = () => {
    if (conversation.length > 0) {
      let arrayMess = [];
      let subMess = [
        {
          timeStamp: handleTime(conversation[0].createdAT),
          text: conversation[0].message,
        },
      ];

      for (let index = 0; index < conversation.length; index++) {
        const nextIndex = index + 1;

        if (nextIndex == conversation.length) {
          if (conversation[index].senderID == currentUser.uid) {
            arrayMess.push(<Messages key={index} messages={subMess} sender />);
          } else {
            arrayMess.push(<Messages key={index} messages={subMess} />);
          }

          return arrayMess;
        }
        const ID = conversation[index].senderID;
        const nextID = conversation[index + 1].senderID;
        if (ID == nextID) {
          subMess.push({
            timeStamp: handleTime(conversation[index + 1].createdAT),
            text: conversation[index + 1].message,
          });
        } else {
          if (ID == currentUser.uid) {
            arrayMess.push(<Messages key={index} messages={subMess} sender />);
            subMess = [
              {
                timeStamp: handleTime(conversation[index + 1].createdAT),
                text: conversation[index + 1].message,
              },
            ];
          } else {
            arrayMess.push(<Messages key={index} messages={subMess} />);
            subMess = [
              {
                timeStamp: handleTime(conversation[index + 1].createdAT),
                text: conversation[index + 1].message,
              },
            ];
          }
        }
      }

      return arrayMess;
    }
    return [];
  };

  return (
    <div className={cx("wrapper")}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {RenderMesssage()}
      </div>
    </div>
  );
}

export default Conversation;
