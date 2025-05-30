"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx"; // optional: utility to simplify conditional classes

const navLinks = [
  { href: "/", label: "🏠 Dashboard" },
  { href: "/chat", label: "💬 Chat" },
  { href: "/documents", label: "📄 Documents" },
  { href: "/settings", label: "⚙️ Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col p-4">
      <div className="text-2xl font-bold mb-8">🚀 {process.env.NEXT_PUBLIC_APP_NAME}</div>

      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "px-3 py-2 rounded hover:bg-blue-50",
              pathname === link.href
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-700"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4 border-t pt-6">
        <Link
          href="/api/auth/signout"
          className="text-red-600 hover:text-red-700"
        >
          🚪 Logout
        </Link>
        <div className="text-xs text-gray-500">&copy; 2025 {process.env.NEXT_PUBLIC_APP_NAME}</div>
      </div>
    </aside>
  );
}
