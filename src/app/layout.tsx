import AppLayout from '@/components/AppLayout';
import { SettingsProvider } from '@/lib/SettingsContext';
import type { Metadata } from 'next';
import './globals.css';

export const revalidate = 60; // 60초마다 데이터 갱신

export const metadata: Metadata = {
  title: 'Todoist Personal',
  description: 'A personal task management app with premium features',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <SettingsProvider>
          <AppLayout>{children}</AppLayout>
        </SettingsProvider>
      </body>
    </html>
  );
}
