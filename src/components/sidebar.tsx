'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import LogoutButton from './LogoutButton';

const navLinks = [
  { href: '/dashboard', label: '🏠 Dashboard' },
  { href: '/chat', label: '💬 Chat' },
  { href: '/documents', label: '📄 Documents' },
  { href: '/settings', label: '⚙️ Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-lg font-bold mb-6">
          🚀 {process.env.NEXT_PUBLIC_APP_NAME}
        </h2>
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'px-3 py-2 rounded hover:bg-blue-50 hover:text-gray-800 transition-colors',
                pathname === link.href
                  ? 'bg-blue-100 text-gray-800 font-semibold'
                  : 'text-gray-300'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-4 border-t border-gray-700 pt-2">
        <LogoutButton />
        <div className="text-xs text-gray-500">
          &copy; 2025 {process.env.NEXT_PUBLIC_APP_NAME}
        </div>
      </div>
    </aside>
  );
}
