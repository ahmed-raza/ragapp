'use client';
import { SessionProvider } from 'next-auth/react';
import Sidebar from '../../components/sidebar';
import ProtectedWrapper from '@/components/ProtectedWrapper';

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex min-h-screen">
      <SessionProvider>
        <ProtectedWrapper>
          <Sidebar />
          <main className="flex-1 bg-gray-50">{children}</main>
        </ProtectedWrapper>
      </SessionProvider>
    </div>
  );
}
