import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAYUl8X2D06RRRYQ-Zrjq67Jkq2TnF2w7A",
  authDomain: "testai-skafis.firebaseapp.com",
  databaseURL:
    "https://testai-skafis-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "testai-skafis",
  storageBucket: "testai-skafis.appspot.com",
  messagingSenderId: "85290631355",
  appId: "1:85290631355:web:58f8907b7bfa4fc372a99e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
