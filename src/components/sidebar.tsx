'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import LogoutButton from './LogoutButton';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/chat', label: 'Chat', icon: '💬' },
  { href: '/documents', label: 'Documents', icon: '📄' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-md flex flex-col justify-between h-screen">
      <div>
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            🚀 {process.env.NEXT_PUBLIC_APP_NAME}
          </h2>
        </div>
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium',
                pathname === href
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <span className="text-lg">{icon}</span> {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-4 py-4 border-t border-gray-100">
        <LogoutButton />
        <p className="text-xs text-gray-400 mt-4 text-center">
          &copy; 2025 {process.env.NEXT_PUBLIC_APP_NAME}
        </p>
      </div>
    </aside>
  );
}
