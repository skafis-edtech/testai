import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

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

const bankasFirebaseConfig = {
  apiKey: "AIzaSyC3Wqume9D4C4tewjmR1FmkyklkDGGFKpw",
  authDomain: "bankas-skafis.firebaseapp.com",
  databaseURL:
    "https://bankas-skafis-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bankas-skafis",
  storageBucket: "bankas-skafis.appspot.com",
  messagingSenderId: "723059913775",
  appId: "1:723059913775:web:fb0bd4b7f84b8ee64302da",
  measurementId: "G-39HR8GJ1JP",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

const bankasApp = initializeApp(bankasFirebaseConfig, "bankas");
const auth = getAuth(bankasApp);

export { auth, database, storage };
