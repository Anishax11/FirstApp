import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Using environment variables for Firebase config for security BEST PRACTICE
// Fallback to hardcoded only if env vars are missing (NOT RECOMMENDED for production)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD7MO0CBfcm9thC6QX7Lf3kK0QvY7eBYsc",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skill-opportunity-translator.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skill-opportunity-translator",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skill-opportunity-translator.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1045875669164",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1045875669164:web:13ab203f4f96d051b58709"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;