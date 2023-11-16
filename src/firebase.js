import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    // appId: process.env.REACT_APP_FIREBASE_APP_ID,
    // measurementId:process.env. REACT_APP_FIREBASE_MEASUREMENT_ID
    apiKey: "AIzaSyASU93dxZ4zwvXgNmgzs0AGIFzup_Mg_5I",
    authDomain: "whatsapp-one-to-one-chat.firebaseapp.com",
    projectId: "whatsapp-one-to-one-chat",
    storageBucket: "whatsapp-one-to-one-chat.appspot.com",
    messagingSenderId: "245232354625",
    appId: "1:245232354625:web:be701e5355106342d58dc0",
    measurementId: "G-6WPDL3QHS8"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

