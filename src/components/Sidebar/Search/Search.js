import { doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { authContext } from "../../../providers/Authprovider";
import { chatContext } from "../../../providers/Chatprovider";
import { ResponsiveContext } from "../../../providers/Responsiveprovider";
import classNames from "classnames/bind";
import Styles from "./Search.module.scss";
import Tippy from "@tippyjs/react/headless";
import Popper from "../../Popper";
import AccountItem from "./AccountItems";
import Configs from "..//..//..//configs";

const db = Configs.firebase.db;

let cx = classNames.bind(Styles);

function Search() {
  let [keywords, setKeywords] = useState("");
  let [loading, setLoading] = useState(false);
  let [back, setBack] = useState(false);
  let [result, setResult] = useState([]);
  let { setResponsive } = useContext(ResponsiveContext);
  let debounce = useDebounce(keywords, 700);

  if (!keywords) {
    debounce = "";
  }

  const { currentUser } = useContext(authContext);
  const { setUserChat } = useContext(chatContext);

  const handleFocus = () => {
    back || setBack(true);
  };

  const handleClickBack = () => {
    setBack(false);

    setKeywords("");
  };

  const handleClickUserChat = async (acc) => {
    const combinedID =
      currentUser.uid > acc.uid
        ? currentUser.uid + acc.uid
        : acc.uid + currentUser.uid;
    // update userChats
    // const docSnap = await getDoc(doc(db, "userChats", currentUser.uid));
    // if (docSnap.exists()) {
    //   let flag = false;
    //   for (const key in docSnap.data()) {
    //     console.log(key);
    //     if (key === combinedID) {
    //       flag = true;
    //     }
    //   }
    //   if (!flag) {
    //     try {
    //       await updateDoc(doc(db, "userChats", currentUser.uid), {
    //         [`${combinedID}.infor`]: {
    //           uid: acc.uid,
    //           displayName: acc.displayName,
    //           avatar: acc.avatar,
    //         },
    //         [`${combinedID}.lastMessage`]: "",
    //         [`${combinedID}.timeStamp`]: serverTimestamp(),
    //       });
    //     } catch (error) {
    //       alert(error);
    //     }
    //   }
    // }

    // create Chats
    const docSnapChats = await getDoc(doc(db, "chats", combinedID));
    if (!docSnapChats.exists()) {
      await setDoc(doc(db, "chats", combinedID), {
        messages: [],
      });
    }

    setUserChat(acc);
  };

  useEffect(() => {
    let users = [];
    if (!keywords) {
      setResult([]);
      return;
    }
    setLoading(true);

    const res = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));

      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          const keyWords = doc.data().keywords;

          const flag = keyWords.some(
            (key) => key.toLowerCase() === debounce.toLowerCase()
          );
          if (flag) {
            const { avatar, displayName, email, uid } = doc.data();

            users.push({ avatar, displayName, email, uid });
          }
        }
      });
      setResult(users);
      setLoading(false);
    };
    res();
  }, [debounce]);

  return (
    <Tippy
      visible={result.length >= 0 && back}
      duration={500}
      placement="bottom"
      arrow={true}
      offset={"0"}
      interactive={true}
      render={(attrs) => (
        <div className="box" tabIndex="-1" {...attrs}>
          <Popper search>
            {result.map((acc, index) => (
              <AccountItem
                key={index}
                acc={acc}
                onClick={() => {
                  handleClickBack();
                  handleClickUserChat(acc);
                  setResponsive(true);
                }}
              />
            ))}
          </Popper>
        </div>
      )}
    >
      <div className={cx("avatar")}>
        <div className={cx("wrapper")}>
          {back && (
            <button onClick={handleClickBack} className={cx("btn-back")}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          )}
          <div className={cx("Search")}>
            <span className={cx("search-icon")}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <span className={cx("loading-icon")}>
              {loading && <i className="fa-solid fa-spinner"></i>}
            </span>
            <input
              onChange={(e) => {
                setKeywords(e.target.value);
              }}
              value={keywords}
              onFocus={handleFocus}
              type="text"
              placeholder="Tìm kiếm người trò chuyện"
            />
          </div>
        </div>
      </div>
    </Tippy>
  );
}

export default Search;
