
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// This metadata can serve as a fallback or base if needed,
// but generateMetadata in [locale]/layout.tsx will take precedence for localized pages.
export const metadata: Metadata = {
  title: 'Admin Dashboard', // General, non-localized title
  description: 'Admin Dashboard for managing your application',
  icons: {
    icon: '/favicon.ico', // Ensure favicon is referenced here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The lang attribute here will be overridden by [locale]/layout.tsx for localized routes.
    // It serves as a fallback for non-localized parts or if localization fails at a higher level.
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        {children} {/* This will render the content from [locale]/layout.tsx */}
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
