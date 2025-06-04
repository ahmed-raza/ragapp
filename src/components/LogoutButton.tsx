// src/components/LogoutButton.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the JWT token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    router.push('/login');
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
