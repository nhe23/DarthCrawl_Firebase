import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyCexB0u6-dNC5pyijr4ZmU0jZh0DoxQf3Q",
//   projectId: "darth-crawl",
// };
const firebaseConfig = {
  apiKey: "AIzaSyCexB0u6-dNC5pyijr4ZmU0jZh0DoxQf3Q",
  authDomain: "darth-crawl.firebaseapp.com",
  projectId: "darth-crawl",
  storageBucket: "darth-crawl.appspot.com",
  messagingSenderId: "514454403021",
  appId: "1:514454403021:web:0e7d1f50b5f1216ec0f684",
  measurementId: "G-4CSCFQQ0SR",
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
export const functions = firebase.functions();
const storage = firebase.storage();
export const storageRef = storage.ref();

if (location.host.includes("localhost")) {
  db.settings({ host: "localhost:8080", ssl: false });
  functions.useFunctionsEmulator("http://localhost:5001");
}
export const analytics = firebase.analytics();
