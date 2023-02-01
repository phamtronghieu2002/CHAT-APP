import { useState, useContext, useEffect } from "react";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { authContext } from "../../providers/Authprovider";
import { chatContext } from "../../providers/Chatprovider";
import { inputContext } from "../../providers/Inputprovider";
import { ResponsiveContext } from "../../providers/Responsiveprovider";
import Configs from "../../configs";
import classNames from "classnames/bind";
import Styles from "./Sidebar.module.scss";
import AccountItem from "./AccountItem";
import Header from "./Header";

let cx = classNames.bind(Styles);

const db = Configs.firebase.db;

function Sidebar({ Responsive }) {
  let { userChat, setUserChat } = useContext(chatContext);
  let { setResponsive } = useContext(ResponsiveContext);
  let { inputChat } = useContext(inputContext);
  const { currentUser } = useContext(authContext);
  let [userChats, setUserChats] = useState([]);

  useEffect(() => {
    const unsubUserChats = () => {
      onSnapshot(doc(db, "userChats", currentUser.uid), async (docs) => {
        let lastMessage = [];
        let midData = [];
        if (docs.data()) {
          const res = Object.entries(docs.data());

          res.sort((a, b) => {
            const timeA = new Date(
              a[1].timeStamp.seconds * 1000 +
                a[1].timeStamp.nanoseconds / 1000000
            );
            const timeB = new Date(
              b[1].timeStamp.seconds * 1000 +
                b[1].timeStamp.nanoseconds / 1000000
            );
            if (timeA < timeB) {
              return 1;
            }
            return -1;
          });

          const itemsDocs = await Promise.all(
            res.map((e) => {
              if (e[1].lastMessage) {
                lastMessage.push(e[1].lastMessage);

                return getDoc(doc(db, "users", e[1].infor.uid));
              }
            })
          );

          const data = itemsDocs.map((i) => i.data());

          for (let i = 0; i < data.length; i++) {
            midData.push({ ...data[i], lastMessage: lastMessage[i] });
          }
        }

        setUserChats(midData);
      });
    };

    unsubUserChats();
    return () => {
      unsubUserChats();
    };
  }, []);

  return (
    <div className={cx("sidebar", { Responsive })}>
      <Header />
      <div className={cx("usersChat")}>
        {userChats.map((e, index) => {
          return (
            <AccountItem
              key={index}
              avatar={e.avatar}
              displayName={e.displayName}
              lastMessage={e.lastMessage}
              onClick={() => {
                inputChat && inputChat.focus();
                setUserChat({
                  avatar: e.avatar,
                  displayName: e.displayName,
                  uid: e.uid,
                });
                setResponsive(true);
              }}
              active={userChat ? userChat.uid === e.uid : false}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
