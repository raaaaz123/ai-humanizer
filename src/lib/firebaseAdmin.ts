// lib/firebaseAdmin.ts
import * as admin from "firebase-admin";
import { cookies } from "next/headers";
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

export const getAdminFirestore = () => {
  try {
    return admin.firestore();
  } catch (error) {
    console.error('Failed to get Firestore instance:', error);
    return null;
  }
};

export const getAdminAuth = () => {
  try {
    return admin.auth();
  } catch (error) {
    console.error('Failed to get Auth instance:', error);
    return null;
  }
};

/**
 * Verify a Firebase ID token and return the decoded token
 * @param idToken Firebase ID token to verify
 * @returns Decoded token or null if verification fails
 */
export const verifyIdToken = async (idToken: string) => {
  try {
    const auth = getAdminAuth();
    if (!auth) return null;
    
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
};

/**
 * Create a session cookie from a Firebase ID token
 * @param idToken Firebase ID token
 * @param expiresIn Session expiration in milliseconds
 * @returns Session cookie string or null if creation fails
 */
export const createSessionCookie = async (idToken: string, expiresIn = 60 * 60 * 24 * 5 * 1000) => {
  try {
    const auth = getAdminAuth();
    if (!auth) return null;
    
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    return sessionCookie;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return null;
  }
};

/**
 * Verify a session cookie and return the decoded claims
 * @param sessionCookie Firebase session cookie to verify
 * @returns Decoded claims or null if verification fails
 */
export const verifySessionCookie = async (sessionCookie: string) => {
  try {
    const auth = getAdminAuth();
    if (!auth) return null;
    
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
};

/**
 * Get the current user from the session cookie
 * @param cookieHeader Cookie header string from the request
 * @returns User record or null if not authenticated
 */
export const getCurrentUser = async (cookieHeader?: string) => {
  try {
    let sessionCookie: string | undefined;
    
    if (cookieHeader) {
      // Parse cookies from header string
      const parsedCookies = parseCookies(cookieHeader);
      sessionCookie = parsedCookies['firebase-auth-token'];
    } else {
      // Try to get cookies from Next.js cookies() API
      try {
        const cookieStore = await cookies();
        sessionCookie = cookieStore.get('firebase-auth-token')?.value;
      } catch (error) {
        console.error('Error accessing cookies:', error);
      }
    }
    
    if (!sessionCookie) return null;
    
    const decodedClaims = await verifySessionCookie(sessionCookie);
    if (!decodedClaims) return null;
    
    const auth = getAdminAuth();
    if (!auth) return null;
    
    const userRecord = await auth.getUser(decodedClaims.uid);
    return userRecord;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Parse cookies from a cookie header string
 * @param cookieHeader Cookie header string
 * @returns Object with cookie name-value pairs
 */
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    const value = rest.join('=');
    
    if (name && value) {
      cookies[name.trim()] = decodeURIComponent(value.trim());
    }
  });
  
  return cookies;
}

export default admin;
