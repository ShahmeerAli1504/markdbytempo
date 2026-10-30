import Link from 'next/link';
import ActionForm from '@/components/ActionForm';
import { submitApplication } from '@/app/actions';
import { SPOT_KINDS } from '@/lib/site';

export const metadata = {
  title: 'Get sponsored — apply for a free athlete page',
  description:
    'Apply for a free athlete sponsorship page. We build your page and race campaign with sponsor spots like logo patches and social shoutouts, and local businesses back your next race.',
  alternates: { canonical: '/get-sponsored' },
  openGraph: { url: '/get-sponsored', title: 'Get sponsored for your next race | Markd by Tempo' },
};

const STEPS = [
  ['Apply', 'Tell us about you, your audience and the race you’re training for.'],
  ['We build your page', 'We set up your athlete page and campaign with sponsor spots and prices.'],
  ['Get backed', 'Local businesses pledge. We confirm each sponsor and you race with their brand.'],
];

export default function GetSponsored() {
  return (
    <>
      <section className="hero lanes">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">For athletes · free</span>
            <h1>Get paid to do<span className="accent">what you love.</span></h1>
            <p className="hero-lede">
              Registration, travel, gear — racing isn’t cheap. Apply once and we’ll build your sponsorship page, list your spots and put
              you in front of local businesses.
            </p>
            <ol className="steps" style={{ maxWidth: 520 }}>
              {STEPS.map(([t, d]) => (
                <li key={t}><div><strong>{t}</strong><p className="muted">{d}</p></div></li>
              ))}
            </ol>
          </div>
          <div className="panel" id="apply">
            <h2>Apply</h2>
            <ActionForm action={submitApplication} submitLabel="Send my application" pendingLabel="Sending…" submitClassName="btn btn-primary btn-lg btn-block">
              <div className="hp" aria-hidden="true"><label>Company URL<input name="company_url" tabIndex={-1} autoComplete="off" /></label></div>
              <div className="grid-2">
                <label className="field"><span>Your name *</span><input name="name" required maxLength={120} autoComplete="name" /></label>
                <label className="field"><span>Email *</span><input name="email" type="email" required autoComplete="email" /></label>
                <label className="field"><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
                <label className="field"><span>Instagram</span><input name="instagram" placeholder="@yourhandle" /></label>
                <label className="field"><span>Total followers</span><input name="followers" inputMode="numeric" placeholder="e.g. 4,500" /></label>
                <label className="field"><span>City</span><input name="location" placeholder="Reno, NV" /></label>
                <label className="field"><span>Sport</span><input name="sport" placeholder="HYROX, marathon, triathlon…" /></label>
                <label className="field"><span>Sponsorship goal (USD)</span><input name="goal" inputMode="decimal" placeholder="1500" /></label>
                <label className="field"><span>Next race</span><input name="race_name" placeholder="HYROX Anaheim 2026" /></label>
                <label className="field"><span>Race date</span><input name="race_date" type="date" /></label>
              </div>
              <label className="field"><span>Your story</span><textarea name="story" rows={4} maxLength={4000} placeholder="Why this race matters and what sponsors would help with." /></label>
              <label className="field"><span>Photo of you (optional, max 5 MB)</span><input name="photo" type="file" accept="image/png,image/jpeg,image/webp" /></label>
              <p className="muted small" style={{ margin: 0 }}>By applying you agree to the <Link href="/terms" className="accent">Terms</Link> and <Link href="/privacy" className="accent">Privacy Policy</Link>.</p>
            </ActionForm>
          </div>
        </div>
      </section>
      <section className="section section-paper">
        <div className="wrap">
          <div className="section-head"><div><span className="eyebrow">What sponsors can buy</span><h2>Your spots, your prices</h2></div></div>
          <div className="price-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))' }}>
            {Object.entries(SPOT_KINDS).map(([k, v]) => (
              <div className="price-card" key={k}>
                <span className="big accent">{v.icon}</span>
                <h3 style={{ margin: 0 }}>{v.label}</h3>
                <p style={{ margin: 0 }}>{v.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
