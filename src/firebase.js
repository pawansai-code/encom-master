import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Replace the following config with your actual Firebase project configuration
// Get this from: Firebase Console -> Project Settings -> General -> Your Apps -> SDK Setup
const firebaseConfig = {
    apiKey: "AIzaSyD6hsl8B5de8tA67SWwoxYXURyReW0kQaA",
    authDomain: "eduverse-2006.firebaseapp.com",
    projectId: "eduverse-2006",
    storageBucket: "eduverse-2006.firebasestorage.app",
    messagingSenderId: "563672033266",
    appId: "1:563672033266:web:3ea4d87875d16437e3ed6b",
    measurementId: "G-3E5W12LMRM",
    databaseURL: "https://eduverse-2006-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

export default app;
