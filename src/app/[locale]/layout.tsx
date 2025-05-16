
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../globals.css'; // Corrected path
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

export async function generateMetadata({params}: {params: {locale: string}}): Promise<Metadata> {
  const currentLocale = params.locale; 

  if (!['en', 'vi'].includes(currentLocale)) {
    console.warn(`[next-intl] generateMetadata: Invalid locale "${currentLocale}" received. This should ideally be caught by middleware or i18n.ts.`);
    // notFound(); // It's better to return minimal metadata or let the layout handle notFound for the page itself.
                 // If notFound is called here, it might prevent the RootLayout from rendering properly.
    return {
      title: 'Admin Dashboard (Locale Error)',
      description: 'Invalid locale specified for metadata.',
    };
  }

  let t;
  try {
    t = await getTranslations({locale: currentLocale, namespace: 'AppHeader'});
  } catch (error) {
    console.error(`[next-intl] Error in generateMetadata for locale ${currentLocale} (getTranslations):`, error);
    return {
      title: 'Admin Dashboard (Translation Error)',
      description: 'Error loading translations for metadata.',
    };
  }

  try {
    return {
      title: t('adminDashboardTitle'),
      description: t('adminDashboardTitle') 
    };
  } catch (error) {
     console.error(`[next-intl] Error in generateMetadata for locale ${currentLocale} (using t()):`, error);
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

  if (!['en', 'vi'].includes(currentLocale)) {
    console.warn(`[next-intl] RootLayout: Invalid locale "${currentLocale}" received. This should have been caught by middleware or i18n.ts. Calling notFound().`);
    notFound();
  }

  try {
    messages = await getMessages(); 
  } catch (error) {
    console.error(`[next-intl] Error in RootLayout for locale ${currentLocale} (getMessages):`, error);
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

