import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCokJwZZP8APWycGaTL_elKTadkopS5H8o",
    authDomain: "flyotech-861f2.firebaseapp.com",
    projectId: "flyotech-861f2",
    storageBucket: "flyotech-861f2.firebasestorage.app",
    messagingSenderId: "690788684612",
    appId: "1:690788684612:web:8bec3ccadc2906d5acfd11",
    measurementId: "G-CKW20RWP6Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics conditionally
let analytics: any = null;
isSupported().then(supported => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});

export { app, auth, db, analytics, googleProvider };
