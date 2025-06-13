'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' }); // Redirect after logout
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-4 w-full bg-red-600 py-2 rounded hover:bg-red-700 text-white font-semibold transition-colors cursor-pointer"
    >
      Logout
    </button>
  );
}
