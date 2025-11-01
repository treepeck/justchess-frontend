import '@/app/ui/globals.css';

import React from 'react';
import type { Metadata } from 'next';

import Header from '@/components/header';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-dvh">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
