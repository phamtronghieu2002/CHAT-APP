import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAoJ_mi07fJ8ie9k9mcUXvIRmminyDvFJQ",
  authDomain: "chatapp-realtime-eff6f.firebaseapp.com",
  projectId: "chatapp-realtime-eff6f",
  storageBucket: "chatapp-realtime-eff6f.appspot.com",
  messagingSenderId: "607742281402",
  appId: "1:607742281402:web:04444eb761edf9eab72483",
  measurementId: "G-SELXF6HDH3",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage(app);
const firebase = {
  app,
  auth,
  db,
  storage,
};

export default firebase;
