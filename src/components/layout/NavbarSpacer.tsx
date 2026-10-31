'use client';

import { usePathname } from 'next/navigation';

export default function NavbarSpacer() {
  const pathname = usePathname();

  if (pathname === '/' || pathname?.startsWith('/admin')) {
    return null;
  }

  return <div aria-hidden className="h-[78px] sm:h-[86px]" />;
}
