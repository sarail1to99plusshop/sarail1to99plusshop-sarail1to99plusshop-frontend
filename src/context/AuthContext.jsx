import { createContext, useContext, useEffect, useState } from 'react';
import {
  registerUserInDB,
  updateUserLoginTimeInDB,
  fetchUserProfileFromDB,
} from '../services/api';

const AuthContext = createContext(null);
const AUTH_CACHE_KEY = 'sarail_cached_auth_user';

const readCachedUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCachedUser = (user) => {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_CACHE_KEY);
      return;
    }
    localStorage.setItem(
      AUTH_CACHE_KEY,
      JSON.stringify({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        emailVerified: Boolean(user.emailVerified),
      })
    );
  } catch {
    // ignore storage errors
  }
};

let firebaseBundlePromise = null;
const loadFirebaseAuth = () => {
  if (!firebaseBundlePromise) {
    firebaseBundlePromise = Promise.all([
      import('firebase/auth'),
      import('../firebase/firebase'),
    ]).then(([authMod, fbConfig]) => ({
      ...authMod,
      ...fbConfig,
    }));
  }
  return firebaseBundlePromise;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => readCachedUser());
  const [dbUser, setDbUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  // Sign up with Email, Password and Display Name + store user in MongoDB collection
  const signUp = async (email, password, displayName = '') => {
    const {
      auth,
      createUserWithEmailAndPassword,
      updateProfile,
      sendEmailVerification,
    } = await loadFirebaseAuth();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (displayName) {
      try {
        await updateProfile(user, { displayName });
      } catch (e) {
        console.warn('Failed to set displayName on profile:', e);
      }
    }

    try {
      await sendEmailVerification(user);
    } catch (e) {
      console.warn('Failed to send initial verification email:', e);
    }

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

    setCurrentUser(auth.currentUser);
    writeCachedUser(auth.currentUser);
    return user;
  };

  // Sign in with Email and Password + update lastLoginAt time in MongoDB
  const signIn = async (email, password) => {
    const { auth, signInWithEmailAndPassword } = await loadFirebaseAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    setCurrentUser(user);
    writeCachedUser(user);

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
    const {
      auth,
      googleProvider,
      browserPopupRedirectResolver,
      signInWithPopup,
    } = await loadFirebaseAuth();

    const userCredential = await signInWithPopup(
      auth,
      googleProvider,
      browserPopupRedirectResolver
    );
    const user = userCredential.user;
    setCurrentUser(user);
    writeCachedUser(user);

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
    const { auth, sendPasswordResetEmail } = await loadFirebaseAuth();
    return await sendPasswordResetEmail(auth, email);
  };

  // Resend Email Verification to Current User
  const sendVerificationEmail = async () => {
    const { auth, sendEmailVerification } = await loadFirebaseAuth();
    if (!auth.currentUser) throw new Error('No user is currently signed in.');
    return await sendEmailVerification(auth.currentUser);
  };

  // Reload user state to check if emailVerified status changed
  const reloadUser = async () => {
    const { auth } = await loadFirebaseAuth();
    if (!auth.currentUser) return null;
    await auth.currentUser.reload();
    const freshUser = { ...auth.currentUser };
    setCurrentUser(freshUser);
    writeCachedUser(freshUser);

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
    const { auth, signOut } = await loadFirebaseAuth();
    await signOut(auth);
    setCurrentUser(null);
    setDbUser(null);
    writeCachedUser(null);
  };

  // Defer Firebase Auth listener initialization until after initial paint so LCP/FCP are never blocked
  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    const initAuthListener = async () => {
      try {
        const { auth, onAuthStateChanged } = await loadFirebaseAuth();
        if (cancelled) return;

        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (cancelled) return;
          setCurrentUser(user);
          writeCachedUser(user);
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
      } catch {
        setUserLoading(false);
      }
    };

    // Only load Firebase immediately if there's an existing cached session or on `/account`;
    // otherwise wait until idle after initial render so mobile LCP is unblocked.
    const hasCachedSession = Boolean(readCachedUser());
    const isAccountRoute =
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/account');

    if (hasCachedSession || isAccountRoute) {
      initAuthListener();
    } else {
      const timer = setTimeout(initAuthListener, 1800);
      return () => {
        cancelled = true;
        clearTimeout(timer);
        unsubscribe();
      };
    }

    return () => {
      cancelled = true;
      unsubscribe();
    };
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
