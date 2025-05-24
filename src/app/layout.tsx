import type { Metadata } from 'next';
import './globals.css';
import { Manrope } from 'next/font/google';
import MainWrapper from './main';
import 'react-activity/dist/library.css';
import { RefreshOnLoad } from '../components/RefreshOnload';
import ChatNotification from './(private)/message/components/ChatNotification';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'PayCita',
  description:
    'Simplify business operations with PayCita—your all-in-one solution for payroll, attendance, invoicing, vendor management, and expenses. Streamline payments, manage leave, and boost efficiency. Unlock your team’s potential today!',
  icons: {
    icon: '/logo',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} antialiased`}
        suppressHydrationWarning
      >
        <MainWrapper>
          {children}
          <RefreshOnLoad />
          <ChatNotification />
        </MainWrapper>
      </body>
    </html>
  );
}
