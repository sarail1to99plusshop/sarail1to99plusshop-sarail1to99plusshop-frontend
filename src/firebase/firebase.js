import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
} from 'firebase/auth';

// Firebase configuration from environment variables with project defaults
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    'AIzaSyBCTCz6ZzzKcahfaEACb5YeMWTxXorLxC4',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'sarail1to99plus-shop.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sarail1to99plus-shop',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'sarail1to99plus-shop.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '272021851635',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:272021851635:web:d3273b28cbe60c763e5686',
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-G7L0B7Y2X4',
};

// Initialize Firebase app singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth without eager popupRedirectResolver so that
// firebaseapp.com/__/auth/iframe.js (93 KB) and apis.google.com (42 KB)
// are NOT injected on initial page load, only when Google Popup login is triggered.
let auth;
try {
  auth = initializeAuth(app, {
    persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  });
} catch {
  auth = getAuth(app);
}

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, googleProvider, browserPopupRedirectResolver };
