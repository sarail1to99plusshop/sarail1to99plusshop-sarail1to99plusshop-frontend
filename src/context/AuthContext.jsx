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
import {
  registerUserInDB,
  updateUserLoginTimeInDB,
  fetchUserProfileFromDB,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  // Sign up with Email, Password and Display Name + store user in MongoDB collection
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

    // Store newly registered account in MongoDB 'users' collection
    try {
      const savedUser = await registerUserInDB({
        uid: user.uid,
        email: user.email || email,
        displayName: displayName || user.displayName || email.split('@')[0],
        photoURL: user.photoURL || '',
        authProvider: 'password',
        emailVerified: user.emailVerified,
      });
      setDbUser(savedUser);
    } catch (e) {
      console.warn('Failed to sync registered user to MongoDB:', e);
    }

    // Sync state
    setCurrentUser(auth.currentUser);
    return user;
  };

  // Sign in with Email and Password + update lastLoginAt time in MongoDB
  const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    setCurrentUser(user);

    // Update login time in MongoDB 'users' collection
    try {
      const updatedUser = await updateUserLoginTimeInDB({
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        authProvider: 'password',
        emailVerified: user.emailVerified,
      });
      setDbUser(updatedUser);
    } catch (e) {
      console.warn('Failed to update login time in MongoDB:', e);
    }

    return user;
  };

  // Sign in with Google Popup + store/update lastLoginAt time in MongoDB
  const signInWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    setCurrentUser(user);

    // Upsert user & update login time in MongoDB 'users' collection
    try {
      const updatedUser = await updateUserLoginTimeInDB({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        authProvider: 'google',
        emailVerified: user.emailVerified,
      });
      setDbUser(updatedUser);
    } catch (e) {
      console.warn('Failed to sync Google login with MongoDB:', e);
    }

    return user;
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
    const freshUser = { ...auth.currentUser };
    setCurrentUser(freshUser);

    if (freshUser.emailVerified) {
      try {
        const updated = await updateUserLoginTimeInDB({
          uid: freshUser.uid,
          email: freshUser.email,
          displayName: freshUser.displayName || '',
          photoURL: freshUser.photoURL || '',
          emailVerified: true,
        });
        setDbUser(updated);
      } catch {
        // ignore
      }
    }

    return auth.currentUser;
  };

  // Sign out
  const logOut = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setDbUser(null);
  };

  // Listen to Firebase auth state changes and load MongoDB profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setUserLoading(false);

      if (user) {
        try {
          const existingProfile = await fetchUserProfileFromDB(user.uid);
          if (existingProfile) {
            setDbUser(existingProfile);
          } else {
            const synced = await updateUserLoginTimeInDB({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              emailVerified: user.emailVerified,
            });
            setDbUser(synced);
          }
        } catch {
          // ignore
        }
      } else {
        setDbUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    dbUser,
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
