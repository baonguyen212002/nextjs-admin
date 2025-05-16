
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../globals.css'; // Path relative to this file's new location
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/app-header';
import AppSidebar from '@/components/layout/app-sidebar';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation'; // Ensure notFound is imported

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Supported locales - should match middleware.ts and i18n.ts
const locales = ['en', 'vi'];

export async function generateMetadata({params}: {params: {locale: string}}): Promise<Metadata> {
  const currentLocale = params.locale; 

  // 1. Validate locale for metadata generation
  if (!locales.includes(currentLocale)) {
    console.warn(`[next-intl] generateMetadata: Invalid locale "${currentLocale}" received. This should ideally be caught by middleware or i18n.ts. Defaulting metadata.`);
    // It's important that generateMetadata *always* returns a Metadata object.
    // Calling notFound() here would prevent rendering.
    return {
      title: 'Admin Dashboard (Locale Error)',
      description: 'Invalid locale specified for metadata.',
    };
  }

  let t;
  try {
    // 2. Attempt to get translations
    // Explicitly pass locale if needed by your i18n.ts or for clarity
    t = await getTranslations({locale: currentLocale, namespace: 'AppHeader'});
  } catch (error) {
    // This catch block is crucial. If getTranslations throws (e.g., due to config issues),
    // we log it and provide fallback metadata.
    console.error(`[next-intl] Error in generateMetadata for locale ${currentLocale} (getTranslations):`, error);
    return {
      title: 'Admin Dashboard (Translation Error)',
      description: 'Error loading translations for metadata.',
    };
  }

  try {
    // 3. Use translations if successfully fetched
    return {
      title: t('adminDashboardTitle'),
      description: t('adminDashboardTitle') // Or a more specific description key
    };
  } catch (error) {
     // This catch is for if t('key') fails for some reason (e.g., key missing, t is undefined)
     console.error(`[next-intl] Error in generateMetadata for locale ${currentLocale} (using t() for AppHeader):`, error);
     return {
      title: 'Admin Dashboard (Usage Error)',
      description: 'Error using translations in metadata.',
    };
  }
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const currentLocale = params.locale; 
  let messages;

  // 1. Validate locale for RootLayout
  // Explicitly validate locale from params before calling next-intl functions
  if (!locales.includes(currentLocale)) {
    console.warn(`[next-intl] RootLayout: Invalid locale "${currentLocale}" from params. This should have been caught by middleware or i18n.ts. Calling notFound().`);
    notFound(); // This is correct. It will stop further execution for this request.
  }

  try {
    // 2. Attempt to get messages
    // getMessages should infer the locale from the request context set by the middleware,
    // or use the locale passed if your i18n.ts config needs it explicitly.
    // By default, next-intl/server functions like getMessages derive the locale from the request.
    messages = await getMessages(); 
  } catch (error) {
    // This catch block is crucial. If getMessages throws due to config issues, log it.
    console.error(`[next-intl] Error in RootLayout for locale ${currentLocale} (getMessages):`, error);
    // Fallback to empty messages to allow the rest of the app to attempt rendering.
    // This helps differentiate between a total config failure and a message loading failure.
    messages = {}; 
  }
  
  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <NextIntlClientProvider locale={currentLocale} messages={messages}>
          <SidebarProvider defaultOpen>
            <AppSidebar messages={messages} locale={currentLocale} />
            <div className="flex flex-col flex-1 min-h-screen">
              <AppHeader />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
