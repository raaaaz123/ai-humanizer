// lib/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  getIdToken,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Define PostHog interface
interface PostHogWindow extends Window {
  posthog?: {
    capture: (eventName: string, properties: Record<string, string | null>) => void;
  };
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const googleProvider = new GoogleAuthProvider();

/**
 * Create a session cookie for the user
 * @param user Firebase user
 */
const createSession = async (user: User) => {
  try {
    const idToken = await getIdToken(user);
    
    // Call our API to create a session cookie
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
    
    if (!response.ok) {
      console.error('Failed to create session:', await response.text());
    }
  } catch (error) {
    console.error('Error creating session:', error);
  }
};

/**
 * Clear the session cookie
 */
const clearSession = async () => {
  try {
    await fetch('/api/auth/session', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if this is a new user (first sign in)
    const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
    
    if (isNewUser) {
      // Create user document in Firestore
      await createUserDocument(result.user);
      
      // Track new user signup in PostHog
      if (typeof window !== 'undefined' && (window as PostHogWindow).posthog) {
        (window as PostHogWindow).posthog?.capture('user_signed_up', {
          method: 'google',
          userId: result.user.uid,
          email: result.user.email
        });
      }
    }
    
    // Create session cookie
    await createSession(result.user);
    
    // Update last login time in Firestore
    const userRef = doc(db, "users", result.user.uid);
    await setDoc(userRef, {
      lastLogin: serverTimestamp(),
    }, { merge: true });
    
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signUpWithEmailPassword = async (email: string, password: string, displayName: string) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Send email verification
    await sendEmailVerification(user);
    
    // Create user document in Firestore
    await createUserDocument(user);
    
    // Sign out immediately to force email verification
    await firebaseSignOut(auth);
    
    return user;
  } catch (error) {
    console.error("Error signing up with email/password", error);
    throw error;
  }
};

export const signInWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Reload user data to get latest emailVerified status
    await user.reload();
    
    // Only allow sign in if email is verified
    if (!user.emailVerified) {
      // Sign out if not verified
      await firebaseSignOut(auth);
      throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
    }
    
    // Create session cookie
    await createSession(user);
    
    return user;
  } catch (error) {
    console.error("Error signing in with email/password", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    // Clear session cookie first
    await clearSession();
    
    // Then sign out from Firebase
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Helper function to create a user document in Firestore
const createUserDocument = async (user: User) => {
  try {
    const userRef = doc(db, "users", user.uid);
    
    // Create user document with default values
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      wordBalance: 250, // Default free words
      subscription: "Free Plan",
      subscriptionStatus: null,
    }, { merge: true });
    
    return userRef;
  } catch (error) {
    console.error("Error creating user document", error);
    throw error;
  }
};

export { app, auth, db, analytics };
