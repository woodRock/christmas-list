import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Create an empty Next.js Response object to modify its headers.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client for the middleware.
  // This client is configured to read and write cookies from the request and response.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set the cookie on the request to make it available to subsequent server-side operations
          // within the same request lifecycle (e.g., Server Components).
          request.cookies.set({ name, value, ...options })
          // Set the cookie on the response to send it back to the client.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Remove the cookie from the request.
          request.cookies.set({ name, value: '', ...options })
          // Remove the cookie from the response.
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh the user's session.
  // Calling getUser() will automatically refresh the session if it's expired
  // and update the cookies via the `set` and `remove` methods defined above.
  // This is crucial because Server Components only have read access to cookies,
  // so middleware is needed to write updated session cookies back to the client.
  // Always use getUser() for revalidation in middleware.
  await supabase.auth.getUser()

  return response
}

// Define a matcher to specify which paths the middleware should run on.
// This helps to avoid running the middleware on static assets or API routes that don't require auth.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any other static assets in the /public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
