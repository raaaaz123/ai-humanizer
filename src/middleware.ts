import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/profile'];

// Define auth routes
const authRoutes = ['/auth'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check for Firebase Auth session cookie
  const firebaseAuthCookie = request.cookies.get('firebase-auth-token');
  const isAuthenticated = !!firebaseAuthCookie;
  
  // Check if the route is protected and user is not authenticated
  if (protectedRoutes.some(route => path.startsWith(route)) && !isAuthenticated) {
    // Redirect to auth page with return URL
    const url = new URL('/auth', request.url);
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }
  
  // Check if user is authenticated and trying to access auth routes
  if (authRoutes.includes(path) && isAuthenticated) {
    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Configure matcher for the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}; 