
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

  if (!locales.includes(currentLocale)) {
    console.warn(`[next-intl] generateMetadata: Invalid locale "${currentLocale}" from params. Calling notFound().`);
    notFound();
  }

  let t;
  try {
    console.log(`[next-intl] generateMetadata: Attempting to get translations for locale ${currentLocale}, namespace AppHeader.`);
    t = await getTranslations({locale: currentLocale, namespace: 'AppHeader'});
    console.log(`[next-intl] generateMetadata: Successfully got translations for locale ${currentLocale}, namespace AppHeader.`);
  } catch (error) {
    console.error(`[next-intl] Error in generateMetadata for locale ${currentLocale} (getTranslations, AppHeader):`, error);
    // Fallback metadata if translations fail
    return {
      title: 'Admin Dashboard (Translation Config Error)',
      description: 'Error loading translations for metadata due to config issue.',
      icons: {
        icon: '/favicon.ico',
      }
    };
  }

  try {
    const pageTitle = t('adminDashboardTitle');
    return {
      title: pageTitle,
      description: pageTitle,
      icons: {
        icon: '/favicon.ico',
      }
    };
  } catch (error) {
     console.error(`[next-intl] Error using translations in generateMetadata for locale ${currentLocale} (AppHeader namespace, key 'adminDashboardTitle'):`, error);
     return {
      title: 'Admin Dashboard (Translation Key Error)',
      description: 'Error using specific translation key in metadata.',
      icons: {
        icon: '/favicon.ico',
      }
    };
  }
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const currentLocale = params.locale;

  if (!locales.includes(currentLocale)) {
    console.warn(`[next-intl] LocaleLayout: Invalid locale "${currentLocale}" from params. Calling notFound().`);
    notFound();
  }

  let messages;
  try {
    console.log(`[next-intl] LocaleLayout: Attempting to get messages for locale ${currentLocale}.`);
    messages = await getMessages();
    console.log(`[next-intl] LocaleLayout: Successfully got messages for locale ${currentLocale}. Message keys: ${Object.keys(messages || {}).length > 0 ? Object.keys(messages).slice(0,5).join(', ') + '...' : 'No keys'}`);
  } catch (error) {
    console.error(`[next-intl] Error in LocaleLayout for locale ${currentLocale} (getMessages):`, error);
    messages = {}; // Fallback to empty messages
  }

  // The <html> and <body> tags are provided by the root layout (src/app/layout.tsx)
  // This layout should only return the content for the body.
  return (
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
  );
}
