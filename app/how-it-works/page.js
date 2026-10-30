import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/site';

export const metadata = {
  title: 'How athlete sponsorship works',
  description: 'How Markd works for athletes and sponsors: apply, get a campaign page with sponsor spots, receive pledges, race and share race-day proof.',
  alternates: { canonical: '/how-it-works' },
};

const ATHLETE = [
  ['Apply', 'Fill in the Get Sponsored form with your story, audience, next race and a photo. No account needed.'],
  ['We build your page', 'We set up your athlete page and a campaign for your race with a goal and a “sponsor by” date.'],
  ['Pick your spots', 'Logo patch, social shoutouts, race-day content, race costs or a custom supporter tier — each with a minimum price.'],
  ['Share it', 'Text, email or WhatsApp your campaign to local businesses. Every campaign has its own share image.'],
  ['Get backed', 'Pledges come in through your campaign page. You approve each sponsor and they pay once confirmed.'],
  ['Race & show proof', 'Race with your sponsors’ brands, and send us race-day photos for your campaign page.'],
];
const SPONSOR = [
  ['Pick an athlete', 'Browse campaigns by race and athlete. Every page shows the story, audience and what’s on offer.'],
  ['Choose a spot', 'Select a patch, shoutout, content package or custom amount — sponsorships of all sizes are welcome.'],
  ['Pledge with your logo', 'Send your business details and logo. No account needed, and no payment yet.'],
  ['Pay once confirmed', 'We confirm with the athlete and email you payment details. Your brand joins the sponsor wall.'],
  ['See it on race day', 'Get race-day photos and video featuring your brand, posted to the campaign.'],
  ['Share the moment', 'Repost the race-day content on your own channels and show customers who you back.'],
];

export default function HowItWorks() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to get sponsored for a race on Markd',
    step: ATHLETE.map(([name, text], i) => ({ '@type': 'HowToStep', position: i + 1, name, text })),
  };
  return (
    <>
      <section className="page-head lanes">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>How it works</span></nav>
          <h1>How it works</h1>
          <p>One athlete, one race, a handful of sponsor spots. Here’s the whole loop, from page to podium.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="wrap how-tabs">
          {[['Athletes', 'Get sponsored', ATHLETE, true], ['Sponsors', 'Get represented', SPONSOR, false]].map(([eyebrow, title, steps, dark]) => (
            <div className={`how-col ${dark ? 'is-dark' : ''}`} key={eyebrow}>
              <span className="eyebrow">{eyebrow}</span>
              <h2 style={{ fontSize: '2.6rem' }}>{title}</h2>
              <ol className="steps">
                {steps.map(([t, d]) => <li key={t}><div><strong>{t}</strong><p>{d}</p></div></li>)}
              </ol>
            </div>
          ))}
        </div>
      </section>
      <section className="section-tight section-accent">
        <div className="wrap cta-band">
          <h2>Start your first campaign</h2>
          <div className="cta-actions">
            <Link href="/get-sponsored" className="btn btn-dark btn-lg">Get sponsored</Link>
            <Link href="/campaigns" className="btn btn-light btn-lg">Browse campaigns</Link>
          </div>
        </div>
      </section>
      <JsonLd data={ld} />
    </>
  );
}
