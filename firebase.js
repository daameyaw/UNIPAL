// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-LnN-_vv_lXWJzrkGwoaxpDJ3ZZLnN-w",
  authDomain: "unipal-5e968.firebaseapp.com",
  projectId: "unipal-5e968",
  storageBucket: "unipal-5e968.firebasestorage.app",
  messagingSenderId: "946016291564",
  appId: "1:946016291564:web:41c30ca9d67736bd2173c9",
  measurementId: "G-Z69BEXMKJY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { app, auth, db };
