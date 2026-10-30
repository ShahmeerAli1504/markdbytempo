'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';

const NAV = [
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/athletes', label: 'Athletes' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/races', label: 'Races' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="header-logo" aria-label="Markd by Tempo — home">
          <Logo priority />
        </Link>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={pathname.startsWith(n.href) ? 'active' : ''}>
              {n.label}
            </Link>
          ))}
          <div className="nav-cta-mobile">
            <Link href="/sponsors#become-a-sponsor" className="btn btn-ghost">Sponsor an athlete</Link>
            <Link href="/get-sponsored" className="btn btn-primary">Get sponsored</Link>
          </div>
        </nav>
        <div className="header-actions">
          <Link href="/sponsors#become-a-sponsor" className="header-login">Sponsor an athlete</Link>
          <Link href="/get-sponsored" className="btn btn-primary btn-sm">Get sponsored</Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
