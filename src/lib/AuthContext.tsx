"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { signInWithGoogle, signOut } from "./firebase";
import { auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import posthog from 'posthog-js';

export interface User extends FirebaseUser {
  id: string;
  auth0Id?: string;
  name?: string;
  wordBalance: number;
  subscription?: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'cancelled' | null;
  subscriptionInterval?: 'month' | 'year';
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionCurrentPeriodEnd?: Date;
  subscriptionUpdatedAt?: Date;
  lastOrderId?: string;
  lastOrderDate?: Date;
}

interface UserData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  wordBalance: number;
  subscription: string;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'cancelled' | null;
  subscriptionInterval?: 'month' | 'year';
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionCurrentPeriodEnd?: Date;
  subscriptionUpdatedAt?: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseInitialized = !!auth;

  useEffect(() => {
    // Check if Firebase auth is initialized
    if (!auth) {
      console.warn("Firebase auth is not initialized. Authentication will not work.");
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const firestoreData = userDoc.data();
          
          // Convert FirebaseUser to our custom User type with Firestore data
          const customUser: User = {
            ...firebaseUser,
            id: firebaseUser.uid,
            wordBalance: firestoreData?.wordBalance || 0,
            subscription: firestoreData?.subscription || 'Free Plan',
            subscriptionId: firestoreData?.subscriptionId,
            subscriptionStatus: firestoreData?.subscriptionStatus,
            subscriptionInterval: firestoreData?.subscriptionInterval,
            subscriptionStartDate: firestoreData?.subscriptionStartDate?.toDate(),
            subscriptionEndDate: firestoreData?.subscriptionEndDate?.toDate(),
            subscriptionCurrentPeriodEnd: firestoreData?.subscriptionCurrentPeriodEnd?.toDate(),
            subscriptionUpdatedAt: firestoreData?.subscriptionUpdatedAt?.toDate(),
            lastOrderId: firestoreData?.lastOrderId,
            lastOrderDate: firestoreData?.lastOrderDate?.toDate()
          };
          
          setUser(customUser);
          
          // Set user data for components that need it
          if (firestoreData) {
            setUserData({
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              wordBalance: firestoreData.wordBalance || 0,
              subscription: firestoreData.subscription || 'Free Plan',
              subscriptionId: firestoreData.subscriptionId,
              subscriptionStatus: firestoreData.subscriptionStatus,
              subscriptionInterval: firestoreData.subscriptionInterval,
              subscriptionStartDate: firestoreData.subscriptionStartDate?.toDate(),
              subscriptionEndDate: firestoreData.subscriptionEndDate?.toDate(),
              subscriptionCurrentPeriodEnd: firestoreData.subscriptionCurrentPeriodEnd?.toDate(),
              subscriptionUpdatedAt: firestoreData.subscriptionUpdatedAt?.toDate()
            });
          }
          
          // Identify user in PostHog
          posthog.identify(firebaseUser.uid, {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            subscription: firestoreData?.subscription || 'Free Plan',
            subscription_status: firestoreData?.subscriptionStatus || 'free',
            word_balance: firestoreData?.wordBalance || 0,
            created_at: firebaseUser.metadata.creationTime,
            last_login: firebaseUser.metadata.lastSignInTime
          });
          
          // Set user properties for better segmentation
          posthog.people.set({
            $email: firebaseUser.email,
            $name: firebaseUser.displayName,
            subscription: firestoreData?.subscription || 'Free Plan',
            subscription_status: firestoreData?.subscriptionStatus || 'free',
            word_balance: firestoreData?.wordBalance || 0
          });
          
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Set basic user data if Firestore fetch fails
          const customUser: User = {
            ...firebaseUser,
            id: firebaseUser.uid,
            wordBalance: 0,
            subscription: 'Free Plan'
          };
          setUser(customUser);
          
          // Still identify the user in PostHog with basic info
          posthog.identify(firebaseUser.uid, {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            created_at: firebaseUser.metadata.creationTime,
            last_login: firebaseUser.metadata.lastSignInTime
          });
        }
      } else {
        setUser(null);
        setUserData(null);
        
        // Reset PostHog user when logged out
        posthog.reset();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!firebaseInitialized) {
      console.error("Firebase is not initialized. Cannot sign in.");
      return;
    }
    
    try {
      await signInWithGoogle();
      // Note: Session cookie is now handled in the signInWithGoogle function
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    if (!firebaseInitialized) {
      console.error("Firebase is not initialized. Cannot sign out.");
      return;
    }
    
    try {
      // Reset PostHog user before signing out
      posthog.reset();
      await signOut();
      // Note: Session cookie is now cleared in the signOut function
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 