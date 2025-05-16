
import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'vi'],
 
  // Used when no locale matches
  defaultLocale: 'en',

  // Always show the locale in the path
  localePrefix: 'always'
});
 
export const config = {
  // Match only internationalized pathnames
  // Match all pathnames except for
  // - … Knewen filenames (_next, locale, etc.)
  // - … The root path (/)
  // - … Static files (e.g. images, fonts, etc.)
  matcher: [
    // Match all pathnames except for
    // - … URLs starting with /api (API routes)
    // - … URLs starting with /_next/static (static files)
    // - … URLs starting with /_next/image (image optimization files)
    // - … URLs starting with /favicon.ico (favicon file)
    // - … URLs starting with /images (public images, if you have them)
    // - … URLs starting with /fonts (public fonts, if you have them)
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)',
    // Match the root path specifically to redirect to /en or /vi
    '/' 
  ]
};
