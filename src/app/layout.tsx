import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import ConvexClerkProvider from '@/providers/convex-clerk-provider';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CodeFlex AI - Get Jacked',
  description: 'A modern fitness AI platform to get jacked for free.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang='en'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          {/* GRID BACKGROUND */}
          <div className='fixed inset-0 -z-1'>
            <div className='absolute inset-0 bg-gradient-to-b from-background via-background to-background' />
            <div className='absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px]' />
          </div>
          <main className='flex-grow pt-24'>{children}</main>
          <Footer />
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
