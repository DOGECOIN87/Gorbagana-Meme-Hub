// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpdleXicA9oeiHPdb1FKEaHfC8TSi5gq0",
  authDomain: "delta-cortex-387523.firebaseapp.com",
  projectId: "delta-cortex-387523",
  storageBucket: "delta-cortex-387523.firebasestorage.app",
  messagingSenderId: "489778411796",
  appId: "1:489778411796:web:d76d850688f5cbdfa72a01",
  measurementId: "G-XN4ZC5V0C8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);


// Conditionally initialize analytics only in the browser
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}


export { app, db, analytics };
