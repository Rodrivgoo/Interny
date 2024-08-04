import { NextResponse } from "next/server";
import { auth } from "./auth";

let locales = ['en', 'es']

// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
  const acceptLanguageHeader = request.headers.get('accept-language');
  const preferredLocales = acceptLanguageHeader ? acceptLanguageHeader.split(',') : [];
  const availableLocales = locales

  for (const locale of preferredLocales) {
    const trimmedLocale = locale.trim();
    if (availableLocales.includes(trimmedLocale)) {
      console.log('Preferred locale found:', trimmedLocale);
      return trimmedLocale;
    }
  }

  // If no preferred locale is found, return a default locale
  return 'es';
}

// TODO: bla

export async function middleware(request) {

  // logger.info("IN MIDDLEWARE")

  // if (request.nextUrl.pathname.startsWith('/assets')) {
  //   console.log('Assets') 
  //   return NextResponse.next()
  // }

  // check if user is authenticated for all pages except /login and /register
  // !true && true = false

  let publicURLs = ['/', '/es', '/en', '/login', '/register', '/terms', '/supervisorpass', '/supervisorgrade', '/evaluation'];

  // enter if only if it doesn't end with any of the publicURLs
  if (!publicURLs.some(url => request.nextUrl.pathname.endsWith(url))) {
    const session = await auth()
    // console.log('session in middleware: ', session)
    if (!session) {
      request.nextUrl.pathname = `/login`
      return NextResponse.redirect(request.nextUrl)
    }
  }



  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */

    // Match all request paths except for the ones starting with:
    // '/((?!api|assets|_next/static|_next/image|favicon.ico).*)',
    // and also ending with .svg
    '/((?!api|assets|_next/static|_next/image|favicon.ico)(?!.*.svg$)(?!.*.jpg).*)',


    // '/login', '/register', '/test', '/dashboard', '/internships', '/grades'
  ],
}
