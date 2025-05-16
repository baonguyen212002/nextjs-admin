import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css'; // Assuming globals.css is now relative to [locale] or path is adjusted. Let's assume it's okay.
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/layout/app-header';
import AppSidebar from '@/components/layout/app-sidebar';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// export const metadata: Metadata = { // Metadata can be generated dynamically too
//   title: 'Admin Dashboard',
//   description: 'Admin Dashboard for managing your application',
// };

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'AppHeader'});
 
  return {
    title: t('adminDashboardTitle'),
    description: t('adminDashboardTitle') // Or a more generic description
  };
}

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SidebarProvider defaultOpen>
            <AppSidebar />
            <div className="flex flex-col flex-1 min-h-screen">
              <AppHeader />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
                {children}
              </main>
            </div>
          </SidebarProvider>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
