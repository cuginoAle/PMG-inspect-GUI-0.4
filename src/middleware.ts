import { NextRequest, NextResponse } from 'next/server';

// Basic auth credentials (in production, use environment variables)
const USERNAME = 'admin';
const PASSWORD = 'password123';

export function middleware(request: NextRequest) {
  // Only apply to /protected routes
  if (request.nextUrl.pathname.startsWith('/protected')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Protected Area"',
        },
      });
    }

    // Extract and decode credentials
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      'base64',
    ).toString();
    const [username, password] = decodedCredentials.split(':');

    // Validate credentials
    if (username !== USERNAME || password !== PASSWORD) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Protected Area"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/protected/:path*',
};
