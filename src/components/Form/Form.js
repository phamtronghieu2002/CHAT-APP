import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { authContext } from "../../providers/Authprovider";
import classNames from "classnames/bind";
import "react-toastify/dist/ReactToastify.css";
import Configs from "../../configs";
import Styles from "./Form.module.scss";

let cx = classNames.bind(Styles);
const auth = Configs.firebase.auth;
const db = Configs.firebase.db;

const createKeywords = (str) => {
  let keys = [];
  const k = str.split(" ");
  const length = k.length;
  const handeString = (string) => {
    let key = "";
    for (let i = 0; i < string.length; i++) {
      key = key + string[i];
      keys.push(key);
    }
  };

  handeString(str);
  if (length > 1) {
    handeString(k[k.length - 1]);
  }
  return keys;
};

function Form({ login }) {
  const navigate = useNavigate();

  let [status, setStatus] = useState(false);
  let { setCurrentUser } = useContext(authContext);
  const refInput = useRef();

  useEffect(() => {
    if (status) {
      toast("Đăng kí thành công !!");
      let timeOut = setTimeout(() => {
        navigate(Configs.routes.login);
      }, 2000);
    }
  }, [status]);

  useEffect(() => {
    refInput.current.focus();
  }, []);

  const handleRegister = async (e) => {
    if (!login) {
      e.preventDefault();
      const name = e.target[0].value;
      const email = e.target[1].value;
      const password = e.target[2].value;

      if (!name || !password || !email) {
        toast("không được để trống trường !!!");

        return;
      } else {
        if (password.length < 6) {
          toast("password  tối thiểu 6 kí tự !!!");
          return;
        }
      }

      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        if (res.user) {
          //  add user to db
          try {
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              email,
              avatar: "",
              displayName: name,
              keywords: createKeywords(name),
            });
          } catch (error) {
            alert(error);
          }
          // add user to userChats

          try {
            await setDoc(doc(db, "userChats", res.user.uid), {});
          } catch (error) {
            alert(error);
          }
          setStatus(true);
        }
      } catch (error) {
        toast("email không hop le!!!");
      }
    }
  };

  const handleBtnLogin = async (e) => {
    e.preventDefault();
    if (login) {
      const email = e.target[0].value;
      const password = e.target[1].value;
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        if (res) {
          const getUser = async () => {
            const q = query(
              collection(db, "users"),
              where("uid", "==", res.user.uid)
            );

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
              if (doc.exists()) {
                setCurrentUser(doc.data());
                navigate(Configs.routes.home);
              }
            });
          };
          getUser();
        }
      } catch (error) {
        toast("Tên đăng nhập hoặc mật khẩu không đúng !!!!!");
      }
    }
  };

  return (
    <div className={cx("wrapper")}>
      <ToastContainer />
      <form
        onSubmit={(e) => {
          handleRegister(e);
          handleBtnLogin(e);
        }}
      >
        <div className={cx("title-icon")}>
          {!login ? (
            <i className="fa-solid fa-circle-user"></i>
          ) : (
            <i className="fa-solid fa-right-to-bracket"></i>
          )}
        </div>
        <h3 className={cx("title")}>{login ? "Đăng Nhập" : "Đăng kí"}</h3>
        {/* INPUT DISPLAYNAME */}
        {!login && (
          <div className={cx("input-group")}>
            <label>Name</label>
            <input type="text"></input>
            <span className={cx("icon-input")}>
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        )}
        {/*INPUT EMAIL  */}
        <div className={cx("input-group")}>
          <label>Email</label>
          <input type="text" ref={refInput}></input>
          <span className={cx("icon-input")}>
            <i className="fa-solid fa-envelope"></i>
          </span>
        </div>
        {/* INPUT PASSWORD */}
        <div className={cx("input-group")}>
          <label>Password</label>
          <input type="password"></input>
          <span className={cx("icon-input")}>
            <i className="fa-solid fa-lock"></i>
          </span>
        </div>
        {login && (
          <p style={{ textAlign: "left", padding: "0 20px" }}>
            Bạn chưa có tài khoản hãy{" "}
            <Link style={{ margin: "0  0 0 10px" }} to="/register">
              Đăng kí
            </Link>
          </p>
        )}
        <div className={cx("btn-submit")}>
          <button>
            {login ? "Đăng Nhập" : "Đăng kí"}{" "}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
