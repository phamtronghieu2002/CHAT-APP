import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { authContext } from "../../../providers/Authprovider";
import { chatContext } from "../../../providers/Chatprovider";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classNames from "classnames/bind";
import Tippy from "@tippyjs/react/headless";
import Configs from "../../../configs";
import Styles from "./Header.module.scss";
import DefaultAvatar from "..//..//DefaultAvatar//DefaultAvatar";
import Popper from "..//..//Popper";
import Search from "..//Search";

let actions = [
  {
    icon: <i className="fa-regular fa-image"></i>,
    text: "Thay avatar",
  },
  {
    icon: <i className="fa-solid fa-right-from-bracket"></i>,
    text: "Đăng xuất",
  },
];
let cx = classNames.bind(Styles);
const db = Configs.firebase.db;
const auth = Configs.firebase.auth;
const storage = Configs.firebase.storage;

function Header() {
  let navigate = useNavigate();

  let { currentUser, setCurrentUser } = useContext(authContext);
  let { setUserChat } = useContext(chatContext);

  useEffect(() => {
    const unsub = () => {
      onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        setCurrentUser(doc.data());
      });
    };

    unsub();
    return () => {
      unsub();
    };
  }, []);

  const refs = useRef();

  const handleLogout = async () => {
    try {
      signOut(auth);
      setUserChat(null);
      navigate(Configs.routes.login);
    } catch (error) {
      alert("some thing is wrong !!");
    }
  };

  const onUpload = () => {
    refs.current.click();
  };

  const handleUpload = () => {
    const file = refs.current.files[0];
    const metadata = {
      contentType: "image/jpeg",
    };
    if (!file) {
      alert("Please upload an image first!");
    }

    const storageRef = ref(storage, `/files/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == 100) {
          toast("Cập nhật ảnh đại diện thành công !!!");
        }
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        alert(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            const res = await updateDoc(doc(db, "users", currentUser.uid), {
              avatar: downloadURL,
            });
          } catch (error) {
            alert(error);
          }
        });
      }
    );
  };

  return (
    <div className={cx("header")}>
      <ToastContainer />
      <div className={cx("user-infor")}>
        <Tippy
          trigger="click"
          duration={500}
          offset={0}
          interactive={true}
          render={(attrs) => (
            <div className="box" tabIndex="-1" {...attrs}>
              <Popper>
                <input
                  style={{ display: "none" }}
                  onChange={handleUpload}
                  type="file"
                  ref={refs}
                />

                {actions.map((a, index) => {
                  let props = {};
                  if (a.text === "Đăng xuất") {
                    props.onClick = handleLogout;
                  } else if (a.text === "Thay avatar") {
                    props.onClick = onUpload;
                  }
                  return (
                    <div {...props} key={index} className={cx("action")}>
                      {
                        <span
                          style={{ margin: "0 10px 0 0" }}
                          className={cx("icon-act")}
                        >
                          {" "}
                          {a.icon}
                        </span>
                      }

                      <span className={cx("text-act")}>{a.text}</span>
                    </div>
                  );
                })}
              </Popper>
            </div>
          )}
        >
          <div className={cx("avatar")}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} />
            ) : (
              <DefaultAvatar />
            )}
          </div>
        </Tippy>
        <h3 className={cx("display-name")}>{currentUser.displayName}</h3>
      </div>
      <Search />
    </div>
  );
}

export default Header;
