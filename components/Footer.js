import Link from 'next/link';
import Logo from './Logo';
import { site } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p className="footer-tag">{site.tagline}</p>
            <p className="muted small">{site.mission}</p>
            <div className="footer-social">
              <a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </div>
          <nav className="footer-cols" aria-label="Footer">
            <div>
              <h2>Explore</h2>
              <Link href="/campaigns">Campaigns</Link>
              <Link href="/athletes">Athletes</Link>
              <Link href="/races">Races</Link>
              <Link href="/sponsors">Sponsors</Link>
            </div>
            <div>
              <h2>Get started</h2>
              <Link href="/get-sponsored">Get sponsored</Link>
              <Link href="/sponsors#become-a-sponsor">Become a sponsor</Link>
              <Link href="/about#contact">Contact</Link>
            </div>
            <div>
              <h2>Learn</h2>
              <Link href="/about">About</Link>
              <Link href="/how-it-works">How it works</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/pricing#refunds">Refunds</Link>
            </div>
            <div>
              <h2>Legal</h2>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {year} {site.name}. Made in {site.region}.</span>
          <span className="mono">EST. 2026 · BIB #0001</span>
        </div>
      </div>
    </footer>
  );
}
