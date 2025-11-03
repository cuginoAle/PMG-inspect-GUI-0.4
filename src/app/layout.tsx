import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import { Theme } from '@radix-ui/themes';
import styles from './page.module.css';
import { label } from '@/package.json';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: label,
  description: 'The PMG Inspect web tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load critical global CSS via a dedicated route to guarantee ordering */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/css/globals.css" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Analytics />
        <Theme
          accentColor="amber"
          appearance="dark"
          panelBackground="solid"
          radius="small"
        >
          <Toaster
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <div className={styles.page}>
            <div className={styles.content}>{children}</div>
          </div>
        </Theme>
      </body>
    </html>
  );
}
