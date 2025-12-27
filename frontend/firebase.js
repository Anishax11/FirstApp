// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7MO0CBfcm9thC6QX7Lf3kK0QvY7eBYsc",
    authDomain: "skill-opportunity-translator.firebaseapp.com",
    projectId: "skill-opportunity-translator",
    storageBucket: "skill-opportunity-translator.firebasestorage.app",
    messagingSenderId: "1045875669164",
    appId: "1:1045875669164:web:13ab203f4f96d051b58709"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;