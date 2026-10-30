import Link from 'next/link';
import SponsorCard from '@/components/SponsorCard';
import InviteButton from '@/components/InviteButton';
import CampaignCard from '@/components/CampaignCard';
import { getCampaigns, getSponsorWall } from '@/lib/data';

export const revalidate = 60;

export const metadata = {
  title: 'Sponsor an athlete — local business sponsorships',
  description:
    'Get your business represented on race day. Sponsor a local athlete with a logo patch, social media shoutouts or race-day photos and video. Any budget, pay only once accepted.',
  alternates: { canonical: '/sponsors' },
  openGraph: { url: '/sponsors', title: 'Sponsor an athlete | Markd by Tempo' },
};

const PLACEMENTS = [
  ['Logo patch', 'Your logo printed as a patch on the athlete’s race apparel — in every photo from the start line to the finish.'],
  ['Social shoutouts', 'Posts, story tags and mentions to the athlete’s followers throughout their training block.'],
  ['Race-day content', 'Photos and video of your brand in action, yours to use in your own marketing.'],
  ['Race costs', 'Cover registration, travel or gear and get credited as the sponsor who made it possible.'],
];

export default async function SponsorsPage() {
  const [wall, campaigns] = await Promise.all([getSponsorWall(), getCampaigns({ limit: 3 })]);
  return (
    <>
      <section className="page-head lanes">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>Sponsors</span></nav>
          <span className="eyebrow">For businesses</span>
          <h1>Get represented<br /><span className="accent">on race day.</span></h1>
          <p>Sponsor a local athlete and put your brand where the energy is. Pick a spot, pledge any amount, and only pay once it’s confirmed.</p>
          <div className="page-head-actions">
            <a href="#become-a-sponsor" className="btn btn-primary btn-lg">Sponsor an athlete</a>
            <InviteButton kind="sponsor" />
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="section-head"><h2>What you can sponsor</h2></div>
          <div className="benefits">
            {PLACEMENTS.map(([t, d], i) => (
              <div className="benefit" key={t}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Sponsor wall</span>
              <h2>{wall.length} sponsor{wall.length === 1 ? '' : 's'} backing athletes</h2>
            </div>
          </div>
          {wall.length ? (
            <div className="sponsor-list">{wall.map((s) => <SponsorCard key={s.id} s={s} />)}</div>
          ) : (
            <div className="empty">
              <h3>Your logo could be first</h3>
              <p>The sponsor wall lists every business backing a Markd athlete, with links to your website and socials.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section" id="become-a-sponsor">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Become a sponsor</span>
              <h2>Pick an athlete</h2>
              <p className="muted">Choose a campaign, select a spot and send your pledge — no account needed. Questions first? <Link href="/about#contact" className="accent">Contact us</Link>.</p>
            </div>
            <Link href="/campaigns" className="btn btn-ghost">All campaigns →</Link>
          </div>
          <div className="grid-cards">{campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)}</div>
        </div>
      </section>
    </>
  );
}
