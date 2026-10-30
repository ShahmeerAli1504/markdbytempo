import { site } from '@/lib/site';

export const metadata = {
  title: 'Privacy Policy',
  description: `How ${site.name} collects, uses and protects your information.`,
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <section className="section">
      <div className="wrap prose">
        <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 4rem)' }}>Privacy Policy</h1>
        <p className="muted">Last updated October 30, 2026</p>
        <h2>What we collect</h2>
        <p>What you send through our forms: sponsorship pledges (business name, contact details, logo, amount, message), athlete applications (name, contact details, social handles, story, photo) and contact messages, plus basic technical data needed to run the site. There are no user accounts.</p>
        <h2>What’s public</h2>
        <p>Published athlete pages, campaigns and accepted sponsors (business name, logo, links, amount and spot) are public. Emails and phone numbers are never shown on the website.</p>
        <h2>How we use it</h2>
        <p>To review applications, build athlete pages, confirm sponsorships, reply to you, prevent abuse and improve the service. We don’t sell personal information.</p>
        <h2>Where it’s stored</h2>
        <p>Data is stored with our infrastructure providers (Supabase for the database and file storage, Vercel for hosting) with access controls on every table.</p>
        <h2>Your choices</h2>
        <p>You can ask us to update or delete your information at any time by emailing <a className="accent" href={`mailto:${site.email}`}>{site.email}</a>.</p>
        <h2>Cookies</h2>
        <p>We don’t use advertising or tracking cookies.</p>
      </div>
    </section>
  );
}
