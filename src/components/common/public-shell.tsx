'use client';

import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { StickyHelpBar } from './sticky-help-bar';
import { LeadModal } from './lead-modal';

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isWorkshopDetail = /^\/workshops\/[^/]+/.test(pathname);

  if (isAdmin || isWorkshopDetail) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
      <SiteFooter />
      <StickyHelpBar />
      <LeadModal />
    </>
  );
}
