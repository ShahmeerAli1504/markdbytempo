import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

export const metadata = {
  title: 'Pricing & refunds',
  description: 'Markd is free for athletes and sponsors during launch. See how payments, refunds and race-day proof work.',
  alternates: { canonical: '/pricing' },
};

const FAQ = [
  ['Is Markd free?', 'Yes. Athlete pages and campaigns are free, and there is no platform fee for sponsors during our launch period. If that ever changes it will be shown clearly before you pledge.'],
  ['Do I need an account?', 'No. There are no logins — sponsors pledge with a simple form, and athletes apply with a form and we build their page.'],
  ['How do sponsors pay?', 'After your pledge is accepted, we email you payment details (for example a payment link, Zelle or an invoice). Your brand then goes on the sponsor wall.'],
  ['When do I pay as a sponsor?', 'Only after your pledge is confirmed. Submitting a pledge never charges you.'],
  ['What counts as race-day proof?', 'Photos or video from the race showing your placement — your patch on the kit, a tagged post, or the content package you chose. We post proof to the campaign page.'],
  ['Can a pledge be declined?', 'Yes. Athletes approve every sponsor so their kit and feed stay true to them. Declined pledges are never charged.'],
  ['What sizes of sponsorship are allowed?', 'Any. Each spot has a minimum, and there is always a custom option for any amount.'],
];

export default function Pricing() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  return (
    <>
      <section className="page-head lanes">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>Pricing</span></nav>
          <h1>Pricing</h1>
          <p>Simple: it’s free while we launch, and there’s nothing to sign up for.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="wrap" style={{ display: 'grid', gap: 56 }}>
          <div className="price-cards">
            <div className="price-card is-dark">
              <span className="eyebrow">Athletes</span>
              <span className="big">$0</span>
              <p>We build your page and campaign for free.</p>
              <ul><li>Public athlete page</li><li>Race campaign with sponsor spots</li><li>Share image for every campaign</li></ul>
              <Link href="/get-sponsored" className="btn btn-primary" style={{ marginTop: 'auto' }}>Get sponsored</Link>
            </div>
            <div className="price-card">
              <span className="eyebrow">Sponsors</span>
              <span className="big">$0</span>
              <p>No platform fee. You pay the athlete only for the spot you choose.</p>
              <ul><li>No account needed</li><li>Spot on the sponsor wall</li><li>Race-day proof</li></ul>
              <Link href="/campaigns" className="btn btn-dark" style={{ marginTop: 'auto' }}>Browse campaigns</Link>
            </div>
            <div className="price-card">
              <span className="eyebrow">Founding members</span>
              <span className="big">1,000</span>
              <p>The first 1,000 athletes and sponsors get a permanent Founding Member badge.</p>
              <Link href="/get-sponsored" className="btn btn-ghost" style={{ marginTop: 'auto' }}>Apply now</Link>
            </div>
          </div>

          <div id="refunds" className="prose">
            <h2 style={{ marginTop: 0 }}>Refunds</h2>
            <p>Sponsors only pay after a pledge is accepted. If an athlete can’t deliver what was agreed — for example they withdraw from the race or race-day proof isn’t posted — the sponsor is refunded in full.</p>
            <p>If a refund isn’t resolved within 14 days of the race, contact us and we’ll step in, including removing the athlete from the platform where appropriate.</p>
          </div>

          <div>
            <h2>FAQ</h2>
            <div className="faq">
              {FAQ.map(([q, a]) => (
                <details key={q}><summary>{q}</summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </div>
      </section>
      <JsonLd data={ld} />
    </>
  );
}
