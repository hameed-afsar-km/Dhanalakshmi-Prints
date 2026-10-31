import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Instrument_Serif, Plus_Jakarta_Sans, Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import NavbarSpacer from '@/components/layout/NavbarSpacer';
import Footer from '@/components/layout/Footer';
import SplashScreen from '@/components/home/SplashScreen';
import PageTransition from '@/components/layout/PageTransition';
import { BRAND } from '@/lib/constants';

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  weight: ['400', '700'],
  subsets: ['latin'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-heading',
  weight: ['600', '700', '800'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${BRAND.name} | Precision 3D Printing Studio`,
  description: BRAND.description,
  icons: {
    icon: '/assets/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${instrumentSerif.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink overflow-x-hidden w-full max-w-full relative">
        <SplashScreen />
        <Suspense fallback={<div className="h-[76px] bg-paper" />}>
          <Navbar />
        </Suspense>
        <main className="flex flex-1 flex-col overflow-x-hidden w-full max-w-full">
          <NavbarSpacer />
          <PageTransition>{children}</PageTransition>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
