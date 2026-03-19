'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { refreshToken } from '@/store/slices/authSlice';
import { isTokenExpired } from '@/lib/jwt';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, refreshToken: storedRefresh } = useAppSelector((s) => s.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth guard
  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [mounted, isAuthenticated, pathname, router]);

  // Auto-refresh token every 5 minutes
  useEffect(() => {
    if (!mounted || !isAuthenticated) return;

    const checkAndRefresh = async () => {
      if (accessToken && isTokenExpired(accessToken)) {
        await dispatch(refreshToken());
      }
    };

    checkAndRefresh();
    const interval = setInterval(checkAndRefresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [mounted, isAuthenticated, accessToken, storedRefresh, dispatch]);

  // SSR ke time kuch mat render karo
  if (!mounted) return null;

  // Login page pe sidebar mat dikhao
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
