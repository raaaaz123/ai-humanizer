import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie, verifyIdToken } from '@/lib/firebaseAdmin';

// Session duration: 5 days
const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000;

/**
 * POST /api/auth/session
 * Create a session cookie from a Firebase ID token
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }
    
    // Verify the ID token
    const decodedToken = await verifyIdToken(idToken);
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 }
      );
    }
    
    // Create a session cookie
    const sessionCookie = await createSessionCookie(idToken, SESSION_EXPIRY);
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Failed to create session cookie' },
        { status: 500 }
      );
    }
    
    // Create response
    const response = NextResponse.json({ success: true });
    
    // Set the session cookie
    response.cookies.set({
      name: 'firebase-auth-token',
      value: sessionCookie,
      maxAge: SESSION_EXPIRY / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
    
    return response;
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Clear the session cookie
 */
export async function DELETE() {
  // Create response
  const response = NextResponse.json({ success: true });
  
  // Clear the session cookie
  response.cookies.set({
    name: 'firebase-auth-token',
    value: '',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
  
  return response;
} 