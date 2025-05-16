
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../globals.css'; // Corrected path
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/app-header';
import AppSidebar from '@/components/layout/app-sidebar';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export async function generateMetadata({params}: {params: {locale: string}}) {
  // Using params.locale directly as required by getTranslations
  const t = await getTranslations({locale: params.locale, namespace: 'AppHeader'});
 
  return {
    title: t('adminDashboardTitle'),
    description: t('adminDashboardTitle') // Or a more generic description
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  // getMessages infers locale from the request context set up by middleware
  const messages = await getMessages();

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <SidebarProvider defaultOpen>
            <AppSidebar messages={messages} locale={params.locale} /> {/* Pass messages and locale here */}
            <div className="flex flex-col flex-1 min-h-screen">
              <AppHeader />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
