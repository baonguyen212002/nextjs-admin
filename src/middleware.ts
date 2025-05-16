
import createMiddleware from 'next-intl/middleware';

// Supported locales - ensure this matches i18n.ts
const locales = ['en', 'vi'];
const defaultLocale = 'en';

export default createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: 'always' // Ensures the locale is always in the URL path
});

export const config = {
  // Match all pathnames except for
  // - …unless those start with /api, /_next, /_vercel,
  // - …or contain a dot (e.g. /favicon.ico).
  matcher: [
    // Match all routes except static files and API routes
    '/((?!api|_next/static|_next/image|images|fonts|favicon.ico).*)',
    // Explicitly match the root path if you want it to be localized
    '/'
  ]
};
