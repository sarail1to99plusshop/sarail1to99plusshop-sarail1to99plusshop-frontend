import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Sign up with Email, Password and Display Name
  const signUp = async (email, password, displayName = '') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name if provided
    if (displayName) {
      try {
        await updateProfile(user, { displayName });
      } catch (e) {
        console.warn('Failed to set displayName on profile:', e);
      }
    }

    // Automatically send verification email
    try {
      await sendEmailVerification(user);
    } catch (e) {
      console.warn('Failed to send initial verification email:', e);
    }

    // Sync state
    setCurrentUser(auth.currentUser);
    return user;
  };

  // Sign in with Email and Password
  const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setCurrentUser(userCredential.user);
    return userCredential.user;
  };

  // Sign in with Google Popup
  const signInWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    setCurrentUser(userCredential.user);
    return userCredential.user;
  };

  // Send Password Reset Email
  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  // Resend Email Verification to Current User
  const sendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error('No user is currently signed in.');
    return await sendEmailVerification(auth.currentUser);
  };

  // Reload user state to check if emailVerified status changed
  const reloadUser = async () => {
    if (!auth.currentUser) return null;
    await auth.currentUser.reload();
    setCurrentUser({ ...auth.currentUser });
    return auth.currentUser;
  };

  // Sign out
  const logOut = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userLoading,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    sendVerificationEmail,
    reloadUser,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
