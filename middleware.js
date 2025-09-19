import { NextResponse } from 'next/server'

export function middleware(request) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to the login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // For other admin routes, check authentication
    // This is a basic implementation - in production, you'd want more robust auth
    const authHeader = request.headers.get('authorization')
    const isAuthenticated = authHeader === 'Bearer admin-token' // This would be more sophisticated in production

    if (!isAuthenticated) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
