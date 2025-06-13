'use client';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col p-6 mx-auto">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p>Welcome, {session?.user?.email}</p>
    </div>
  );
}
