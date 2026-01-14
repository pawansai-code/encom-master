
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBh3Tudhb6iiT5I9WKWDpDjeK0ia2W6__k",
    authDomain: "encom-43040.firebaseapp.com",
    projectId: "encom-43040",
    storageBucket: "encom-43040.firebasestorage.app",
    messagingSenderId: "528309961336",
    appId: "1:528309961336:web:8eb39acb0cbf587444a38d",
    measurementId: "G-ERGQ9XF331"
};

import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { analytics, app, auth, googleProvider, storage };

