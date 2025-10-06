import { NextRequest, NextResponse } from 'next/server';

// Basic auth credentials now sourced from environment variables.
// Define in .env.local (not committed):

const USERNAME = process.env.PROTECTED_BASIC_AUTH_USER;
const PASSWORD = process.env.PROTECTED_BASIC_AUTH_PASS;

// Safe decode (edge-friendly)
function decodeBasic(header: string) {
  try {
    const encoded = header.split(' ')[1] || '';
    const decoded = atob(encoded);
    const idx = decoded.indexOf(':');
    if (idx === -1) return [null, null];
    return [decoded.slice(0, idx), decoded.slice(idx + 1)];
  } catch {
    return [null, null];
  }
}

// --- Simple attempt tracking (in-memory, non-distributed) ---
// NOTE: This resets on serverless cold start and is not suitable for strong security.
// Provides basic throttling against casual brute force.
const MAX_ATTEMPTS = 5; // threshold within window
const WINDOW_MS = 5 * 60_000; // 5 minutes
type AttemptEntry = { count: number; first: number };
const attempts: Map<string, AttemptEntry> = new Map();

function registerFailure(key: string): number {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || now - current.first > WINDOW_MS) {
    const fresh = { count: 1, first: now };
    attempts.set(key, fresh);
    return fresh.count;
  }
  current.count += 1;
  return current.count;
}

function resetAttempts(key: string) {
  attempts.delete(key);
}

export function middleware(request: NextRequest) {
  // Only apply to /protected routes
  if (request.nextUrl.pathname.startsWith('/protected')) {
    // Fail fast if server not configured correctly (avoid exposing which var is missing)
    if (!USERNAME || !PASSWORD) {
      return new NextResponse(
        'Server authentication (env variables) not configured',
        {
          status: 500,
        },
      );
    }
    const authHeader = request.headers.get('authorization');
    // Derive a client key from common forwarding headers (best-effort, not cryptographically secure)
    const clientKey =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      const attemptCount = registerFailure(clientKey);
      if (attemptCount > MAX_ATTEMPTS) {
        return new NextResponse('Too many attempts', { status: 429 });
      }
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Protected Area"' },
      });
    }

    // Extract and decode credentials
    const [username, password] = decodeBasic(authHeader);

    // Validate credentials
    if (username !== USERNAME || password !== PASSWORD) {
      const attemptCount = registerFailure(clientKey);
      if (attemptCount > MAX_ATTEMPTS) {
        return new NextResponse('Too many attempts', { status: 429 });
      }
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Protected Area"' },
      });
    }

    // Successful auth ⇒ clear attempts
    resetAttempts(clientKey);
  }

  // // Add a new header x-current-path which passes the path to downstream components
  // const headers = new Headers(request.headers);

  // headers.set('x-current-url', request.nextUrl.search);
  // return NextResponse.next({ headers });
  return NextResponse.next();
}

export const config = {
  matcher: '/protected/:path*',
};
