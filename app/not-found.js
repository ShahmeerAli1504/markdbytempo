import Link from 'next/link';

export const metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="section lanes">
      <div className="wrap center" style={{ display: 'grid', justifyItems: 'center', gap: 16 }}>
        <span className="eyebrow">DNF · 404</span>
        <h1>Off course.</h1>
        <p className="muted">That page didn’t make it to the start line.</p>
        <div className="cta-actions" style={{ justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/campaigns" className="btn btn-ghost">Browse campaigns</Link>
        </div>
      </div>
    </section>
  );
}
