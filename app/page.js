import Link from 'next/link';
import CampaignCard from '@/components/CampaignCard';
import AthleteCard from '@/components/AthleteCard';
import SponsorCard from '@/components/SponsorCard';
import Countdown from '@/components/Countdown';
import Progress from '@/components/Progress';
import InviteButton from '@/components/InviteButton';
import JsonLd from '@/components/JsonLd';
import { getCampaigns, getAthletes, getSponsorWall, getStats } from '@/lib/data';
import { compactNumber, dateRange, money } from '@/lib/format';
import { hyroxRace, site } from '@/lib/site';

export const revalidate = 60;

export const metadata = {
  title: { absolute: `${site.name} — Sponsor an athlete. Get your brand to race day.` },
  alternates: { canonical: '/' },
};

const SPONSOR_BENEFITS = [
  ['Any budget', 'From a $25 shoutout to a full race kit — every size of business fits.'],
  ['No sign-up', 'No account, no password. Pick a spot, fill one form, done.'],
  ['On the sponsor wall', 'Your logo, links and the race you supported, seen by every visitor.'],
  ['Found in search', 'Campaign and sponsor pages are built to rank for local searches.'],
  ['Pay after acceptance', 'Pledge first. You only pay once the sponsorship is confirmed.'],
  ['Race-day proof', 'Athletes post photos and video of your brand on race day.'],
  ['Your logo, your links', 'Your logo links to your website and Instagram from every page you appear on.'],
  ['Local goodwill', 'Customers remember the business that backed their neighbour.'],
];

export default async function Home() {
  const [campaigns, athletes, sponsors, stats] = await Promise.all([
    getCampaigns({ limit: 7 }),
    getAthletes({ limit: 6 }),
    getSponsorWall({ limit: 5 }),
    getStats(),
  ]);

  const featured = campaigns.find((c) => c.race?.slug === hyroxRace.slug) || campaigns[0];
  const others = campaigns.filter((c) => c.id !== featured?.id).slice(0, 6);
  const race = featured?.race || hyroxRace;
  const patchSpot = featured?.spots?.find((s) => s.kind === 'patch');
  const patchesTaken = Math.min(6, patchSpot?.claimed || 0);

  const eventLd = featured && {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: race.name,
    startDate: race.starts_on,
    endDate: race.ends_on,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: race.venue, address: race.city },
    description: race.description,
    url: `${site.url}/campaigns/${featured.slug}`,
    performer: { '@type': 'Person', name: featured.athlete?.display_name },
  };

  return (
    <>
      {/* HERO */}
      <section className="hero lanes">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow rise">Athlete sponsorship · {site.region}</span>
            <h1 className="rise rise-2">
              Your logo.<span className="accent">Their finish line.</span>
            </h1>
            <p className="hero-lede rise rise-3">
              Markd connects local businesses with the athletes training down the street. Sponsor a race, get your brand on the
              kit and in the feed — or apply for a free page and get backed for the next start line.
            </p>
            <div className="hero-paths rise rise-3">
              <Link href="/get-sponsored" className="path-card is-primary">
                <span className="mono">For athletes</span>
                <strong>Get paid to race</strong>
                <p>Free page, your spots, your price.</p>
                <span className="arrow" aria-hidden="true">↗</span>
              </Link>
              <Link href="/sponsors" className="path-card">
                <span className="mono">For sponsors</span>
                <strong>Get on race day</strong>
                <p>Back an athlete, get seen.</p>
                <span className="arrow" aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="founding">
              <span className="founding-badge">Founding member</span>
              <span>The first 1,000 athletes get a permanent badge.</span>
            </div>
          </div>

          <div className="hero-bib rise rise-2" aria-label={`Race bib for ${race.name}`}>
            <div className="hero-bib-top">
              <span>{race.name.toUpperCase()}</span>
              <span>{dateRange(race.starts_on, race.ends_on).toUpperCase()}</span>
            </div>
            <div className="hero-bib-num">0001</div>
            <div className="hero-bib-name">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/markd-runner-black.png" alt="" width={428} height={218} className="hero-bib-runner" />
              {featured?.athlete?.display_name || 'Your athlete'}
            </div>
            <div className="hero-bib-patches">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className={i < patchesTaken ? 'is-taken' : ''}>
                  {i < patchesTaken ? 'Sponsor ✓' : 'Your logo here'}
                </span>
              ))}
            </div>
            <div className="hero-bib-foot">
              <span>{race.venue}</span>
              <span>{6 - patchesTaken} patches open</span>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} style={{ display: 'flex', gap: 48 }}>
              <span>Get seen</span><span>Get sponsored</span><span>Get Markd</span><span>Road to HYROX Anaheim</span><span>Back local athletes</span>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section aria-label="Platform stats">
        <div className="stats">
          <div className="stat"><strong>{stats.athletes}</strong><span>Athletes</span></div>
          <div className="stat"><strong>{compactNumber(stats.audience)}</strong><span>Collective audience</span></div>
          <div className="stat"><strong>{money(stats.raised_cents, { compact: true })}</strong><span>Sponsored</span></div>
          <div className="stat"><strong>{stats.sponsors}</strong><span>Sponsors</span></div>
        </div>
      </section>

      {/* FEATURED CAMPAIGN */}
      {featured && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">Featured campaign</span>
                <h2>{featured.title}</h2>
              </div>
              <Link href={`/campaigns/${featured.slug}`} className="btn btn-ghost">See full campaign →</Link>
            </div>
            <div className="feature">
              <div className="feature-visual">
                <div>
                  <span className="mono">{dateRange(race.starts_on, race.ends_on)} · {race.venue}</span>
                  <h3 style={{ marginTop: 14 }}>{race.name}</h3>
                </div>
                <div className="feature-specs">
                  <div><strong>8 KM</strong><span>Running</span></div>
                  <div><strong>8</strong><span>Workout stations</span></div>
                  <div><strong>1</strong><span>Finish line</span></div>
                </div>
              </div>
              <div className="feature-body">
                <Countdown date={race.starts_on} />
                <Progress raised={featured.raised_cents} goal={featured.goal_cents} count={featured.sponsor_count} />
                <ul className="perks">
                  <li>Your business logo printed as a patch on race apparel</li>
                  <li>Brand exposure through social media posts</li>
                  <li>Sponsor recognition throughout the training journey</li>
                  <li>Race-day photos and videos featuring your brand</li>
                </ul>
                <div className="cta-actions">
                  <Link href={`/campaigns/${featured.slug}#sponsor`} className="btn btn-primary btn-lg">Sponsor this race</Link>
                  <InviteButton kind="sponsor" label="Share with a business" />
                </div>
              </div>
            </div>
          </div>
          <JsonLd data={eventLd} />
        </section>
      )}

      {/* MORE CAMPAIGNS */}
      {others.length > 0 && (
        <section className="section-tight">
          <div className="wrap">
            <div className="section-head">
              <h2>Open campaigns</h2>
              <Link href="/campaigns" className="btn btn-ghost">All campaigns →</Link>
            </div>
            <div className="grid-cards">
              {others.map((c) => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </div>
        </section>
      )}

      {/* ATHLETES */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">The roster</span>
              <h2>Athletes on Markd</h2>
              <p className="muted">Runners, hybrid racers and lifters building toward their next start line.</p>
            </div>
            <div className="cta-actions">
              <InviteButton kind="athlete" />
              <Link href="/athletes" className="btn btn-ghost">See all athletes →</Link>
            </div>
          </div>
          <div className="grid-cards">
            {athletes.map((a) => <AthleteCard key={a.id} athlete={a} />)}
            <div className="empty">
              <h3>Your spot on the roster</h3>
              <p>Apply for a free page with your photo, story and races. We build it for you.</p>
              <Link href="/get-sponsored" className="btn btn-primary">Apply now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-paper" id="how-it-works">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">How it works</span>
              <h2>Three steps to race day</h2>
            </div>
            <Link href="/how-it-works" className="btn btn-ghost">The full playbook →</Link>
          </div>
          <div className="how-tabs">
            <div className="how-col is-dark">
              <span className="eyebrow">Athletes</span>
              <h3>Get sponsored</h3>
              <ol className="steps">
                <li><div><strong>Apply in two minutes</strong><p>Tell us your story, audience and the race you’re training for.</p></div></li>
                <li><div><strong>We build your page</strong><p>Your campaign goes live with sponsor spots — patches, shoutouts, race-day content, race costs.</p></div></li>
                <li><div><strong>Race, show proof, get paid</strong><p>Sponsors pay once confirmed. Race-day photos go up on your campaign.</p></div></li>
              </ol>
            </div>
            <div className="how-col">
              <span className="eyebrow">Sponsors</span>
              <h3>Get represented</h3>
              <ol className="steps">
                <li><div><strong>Pick an athlete and a spot</strong><p>Browse campaigns and choose the placement that fits your brand and budget.</p></div></li>
                <li><div><strong>Pledge — no account needed</strong><p>Send your pledge with your logo. You only pay once it’s confirmed.</p></div></li>
                <li><div><strong>See it on race day</strong><p>Get photos and video of your brand in action, and a spot on the sponsor wall.</p></div></li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* SPONSOR WALL */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Sponsor wall</span>
              <h2>Businesses backing athletes</h2>
            </div>
            <div className="cta-actions">
              <InviteButton kind="sponsor" />
              <Link href="/sponsors" className="btn btn-ghost">See all sponsors →</Link>
            </div>
          </div>
          {sponsors.length > 0 ? (
            <div className="sponsor-list">
              {sponsors.map((s) => <SponsorCard key={s.id} s={s} />)}
            </div>
          ) : (
            <div className="empty">
              <h3>The first spot on the wall is open</h3>
              <p>Be the first business to back a Markd athlete — your logo goes here, linked to your site.</p>
              {featured && <Link href={`/campaigns/${featured.slug}#sponsor`} className="btn btn-primary">Become the first sponsor</Link>}
            </div>
          )}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section-tight">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Why sponsor</span>
              <h2>Built for local business</h2>
            </div>
          </div>
          <div className="benefits">
            {SPONSOR_BENEFITS.map(([t, d], i) => (
              <div className="benefit" key={t}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="section">
        <div className="wrap mission">
          <span className="eyebrow">Our mission</span>
          <blockquote>Empower every athlete to turn their passion into opportunity.</blockquote>
          <p className="muted">Athletes put in thousands of hours. Local businesses want real, human marketing. Markd puts them on the same start line.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight section-accent">
        <div className="wrap cta-band">
          <h2>Ready to get Markd?</h2>
          <div className="cta-actions">
            <Link href="/get-sponsored" className="btn btn-dark btn-lg">I’m an athlete</Link>
            <Link href="/sponsors#become-a-sponsor" className="btn btn-light btn-lg">I’m a business</Link>
          </div>
        </div>
      </section>
    </>
  );
}
