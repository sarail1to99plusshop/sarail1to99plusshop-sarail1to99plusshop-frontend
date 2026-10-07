import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration from environment variables with project defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBVAEDAlpAIXj0kgNLnr7eIz-ASJcIcgLU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sarail-1-to-99-plus-shop.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sarail-1-to-99-plus-shop",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sarail-1-to-99-plus-shop.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "185125632621",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:185125632621:web:2d4aaeed902829788edd64",
};

// Initialize Firebase app singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, googleProvider };
