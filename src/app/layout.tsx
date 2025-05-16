
import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Geist_Mono can be removed if not used for code blocks
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// This metadata can serve as a fallback or base if needed,
// but generateMetadata in [locale]/layout.tsx will take precedence for localized pages.
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard for managing your application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The lang attribute here will be overridden by the [locale]/layout.tsx for localized routes
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        {children} {/* This will render the content from [locale]/layout.tsx */}
        <Toaster />
      </body>
    </html>
  );
}

