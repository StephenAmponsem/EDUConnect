// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // or getFirestore for Firestore
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCmv5_-4DBoXnM2BtmkB5wjuzPWfohgg7E",
  authDomain: "educonnect-51829.firebaseapp.com",
  databaseURL: "YOUR_DB_URLhttps://educonnect-51829-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "educonnect-51829",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "824907516853",
  appId: "1:824907516853:web:7c951c4969a84b5432e7fc",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);