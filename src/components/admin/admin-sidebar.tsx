'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, CalendarDays, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Blogs', href: '/admin/blogs', icon: FileText },
  { label: 'Workshops', href: '/admin/workshops', icon: CalendarDays },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);

  function handleLogout() {
    dispatch(logout());
    router.replace('/admin/login');
  }

  return (
    <aside className="w-56 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800">
        <Link href="/admin/dashboard" className="text-lg font-bold text-white">
          Coding<span className="text-[#ff6b2c]">Sharks</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-[#ff6b2c]/10 text-[#ff6b2c] font-medium'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-zinc-800">
        {user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-white text-sm font-medium truncate">{user.full_name}</p>
            <p className="text-zinc-500 text-xs truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
