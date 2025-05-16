
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../globals.css'; // Corrected path
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/app-header';
import AppSidebar from '@/components/layout/app-sidebar';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation'; // Import notFound

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export async function generateMetadata({params}: {params: {locale: string}}): Promise<Metadata> {
  const { locale } = params;
  // Basic validation, though middleware and i18n.ts should handle unsupported locales
  if (!['en', 'vi'].includes(locale)) {
    return {
      title: 'Unsupported Locale',
      description: 'This locale is not supported.',
    };
  }

  try {
    const t = await getTranslations({locale: params.locale, namespace: 'AppHeader'});
    return {
      title: t('adminDashboardTitle'),
      description: t('adminDashboardTitle') // Or a more generic description
    };
  } catch (error) {
    console.error(`[next-intl] Error in generateMetadata for locale ${params.locale}:`, error);
    // Fallback metadata in case of error
    return {
      title: 'Admin Dashboard',
      description: 'Error loading translations for metadata.',
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
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error(`[next-intl] Error in RootLayout calling getMessages() for locale ${params.locale}:`, error);
    // If messages fail to load, treat as a critical error for this locale page.
    // You could redirect to a generic error page or a default locale,
    // but notFound() is appropriate if the localized page can't be rendered.
    // However, if the error is "config not found", notFound() might hide the root cause.
    // Let's provide empty messages to allow NextIntlClientProvider to initialize,
    // to see if the "config not found" error from next-intl itself is the primary blocker.
    messages = {}; 
    // If the error persists as "config not found", it means getMessages() itself is failing
    // due to next-intl not initializing, not just messages for a specific locale being absent.
  }

  // If locale in params is somehow invalid despite middleware, i18n.ts should call notFound.
  // We double check here for safety before passing to NextIntlClientProvider.
  if (!['en', 'vi'].includes(params.locale)) {
    console.warn(`[next-intl] RootLayout: Invalid locale "${params.locale}" received. This should have been caught by middleware or i18n.ts.`);
    notFound();
  }
  
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <SidebarProvider defaultOpen>
            <AppSidebar messages={messages} locale={params.locale} />
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
