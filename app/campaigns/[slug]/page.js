import Link from 'next/link';
import { notFound } from 'next/navigation';
import Avatar from '@/components/Avatar';
import Countdown from '@/components/Countdown';
import Progress from '@/components/Progress';
import SponsorForm from '@/components/SponsorForm';
import SponsorCard from '@/components/SponsorCard';
import InviteButton from '@/components/InviteButton';
import Story from '@/components/Story';
import Gallery from '@/components/Gallery';
import KitMap from '@/components/KitMap';
import SponsorTiers from '@/components/SponsorTiers';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import { getCampaign, getCampaigns } from '@/lib/data';
import { pledgeSponsorship } from '@/app/actions';
import { compactNumber, dateRange, daysUntil, money, shortDate, igUrl } from '@/lib/format';
import { site, SPOT_KINDS } from '@/lib/site';

export const revalidate = 60;

export async function generateStaticParams() {
  const campaigns = await getCampaigns({ limit: 100 });
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = await getCampaign(slug);
  if (!c) return { title: 'Campaign not found', robots: { index: false } };
  const name = c.athlete?.display_name;
  const where = c.race ? ` at ${c.race.name}` : '';
  const title = `Sponsor ${name}${where}`;
  const description = `${c.title}: sponsor ${name}${where}${c.race?.starts_on ? ` (${dateRange(c.race.starts_on, c.race.ends_on)}, ${c.race.city})` : ''}. Logo patches, social shoutouts and race-day content for local businesses — sponsorships of all sizes welcome.`;
  return {
    title,
    description,
    alternates: { canonical: `/campaigns/${c.slug}` },
    openGraph: { type: 'article', url: `/campaigns/${c.slug}`, title: `${title} | ${site.name}`, description },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CampaignPage({ params }) {
  const { slug } = await params;
  const c = await getCampaign(slug);
  if (!c) notFound();
  const a = c.athlete || {};
  const r = c.race;
  const left = daysUntil(c.sponsor_by);
  const isHyrox = r?.name?.toLowerCase().includes('hyrox');
  const open = c.status === 'live';

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          { '@type': 'ListItem', position: 2, name: 'Campaigns', item: `${site.url}/campaigns` },
          { '@type': 'ListItem', position: 3, name: c.title, item: `${site.url}/campaigns/${c.slug}` },
        ],
      },
      r && {
        '@type': 'SportsEvent',
        name: r.name,
        startDate: r.starts_on,
        endDate: r.ends_on,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: r.venue || r.city, address: r.city },
        description: r.description,
        performer: { '@type': 'Person', name: a.display_name, url: `${site.url}/athletes/${a.handle}` },
        organizer: { '@type': 'Organization', name: r.name.split(' ')[0], url: r.url },
        offers: c.spots.map((s) => ({
          '@type': 'Offer',
          name: s.title,
          description: s.description,
          price: (s.price_cents / 100).toFixed(2),
          priceCurrency: 'USD',
          availability: s.quantity && s.claimed >= s.quantity ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          url: `${site.url}/campaigns/${c.slug}#sponsor`,
          validFrom: c.created_at,
        })),
      },
    ].filter(Boolean),
  };

  return (
    <>
      <section className="cmp-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link> / <Link href="/campaigns">Campaigns</Link> / <span>{c.title}</span>
          </nav>
          <div className="cmp-grid">
            <div>
              <span className="eyebrow">{open ? 'Open for sponsors' : 'Campaign closed'}{left !== null && left >= 0 && open ? ` · ${left} days left` : ''}</span>
              <h1 className="cmp-title">{c.title}</h1>
              <div className="cmp-athlete">
                <Avatar src={a.avatar_url} name={a.display_name} size={52} />
                <div>
                  <Link href={`/athletes/${a.handle}`}>{a.display_name}</Link>
                  <div className="muted small">
                    {a.location}
                    {a.followers > 0 ? ` · ${compactNumber(a.followers)} followers` : ''}
                    {a.instagram ? <> · <a href={igUrl(a.instagram)} target="_blank" rel="noopener noreferrer">{a.instagram.startsWith('@') ? a.instagram : 'Instagram'}</a></> : null}
                  </div>
                </div>
              </div>

              {open && <a href="#sponsor" className="btn btn-primary btn-lg btn-block mobile-only">Sponsor {a.display_name?.split(' ')[0]}</a>}

              {a.cover_url && (
                <div className="cmp-photo">
                  <Image src={a.cover_url} alt={`${a.display_name} training for ${r?.name || 'race day'}`} fill priority sizes="(max-width: 920px) 100vw, 760px" />
                </div>
              )}

              {r && (
                <div className="race-box">
                  <div><span>Race</span><strong>{r.name}</strong></div>
                  <div><span>Dates</span><strong>{dateRange(r.starts_on, r.ends_on)}</strong></div>
                  <div><span>Where</span><strong>{r.venue ? `${r.venue}, ` : ''}{r.city}</strong></div>
                </div>
              )}

              {isHyrox && (
                <>
                  <h2 style={{ fontSize: '2.2rem' }}>The challenge</h2>
                  <div className="challenge">
                    <div><strong>8 km</strong><span>of running, split into 1 km laps</span></div>
                    <div><strong>8</strong><span>intense functional workout stations</span></div>
                    <div><strong>1</strong><span>true test of strength, endurance & determination</span></div>
                  </div>
                </>
              )}

              <Story text={c.story} />

              <div style={{ marginTop: 48 }}>
                <Gallery photos={a.gallery} title="On the road to race day" name={a.display_name} />
              </div>

              {c.tiers?.length ? (
                <>
                  <div style={{ marginTop: 56 }}>
                    <KitMap photos={a.kit_photos} spots={c.spots} name={a.display_name} />
                  </div>
                  <div style={{ marginTop: 56 }}>
                    <SponsorTiers tiers={c.tiers} spots={c.spots} />
                  </div>
                </>
              ) : (
                <>
              <h2 style={{ fontSize: '2.2rem', marginTop: 48 }}>Sponsor spots</h2>
              <div className="spot-list">
                {c.spots.map((s) => {
                  const soldOut = s.quantity && s.claimed >= s.quantity;
                  return (
                    <div className="spot-row" key={s.id}>
                      <div>
                        <span className="chip chip-hot">{SPOT_KINDS[s.kind]?.label || 'Spot'}</span>
                        <h3 style={{ marginTop: 10 }}>{s.title}</h3>
                        {s.description && <p>{s.description}</p>}
                      </div>
                      <div className="price">
                        {money(s.price_cents)}+
                        <small>{soldOut ? 'Sold out' : s.quantity ? `${s.quantity - (s.claimed || 0)} of ${s.quantity} left` : 'Unlimited'}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
                </>
              )}

              <h2 style={{ fontSize: '2.2rem', marginTop: 48 }}>Sponsors ({c.sponsors.length})</h2>
              {c.sponsors.length ? (
                <div className="sponsor-list">{c.sponsors.map((s) => <SponsorCard key={s.id} s={s} />)}</div>
              ) : (
                <div className="empty">
                  <h3>No sponsors yet</h3>
                  <p>Be the first business on {a.display_name}’s kit. First sponsors get the best patch placement.</p>
                </div>
              )}

              {c.proofs.length > 0 && (
                <>
                  <h2 style={{ fontSize: '2.2rem', marginTop: 48 }}>Race-day proof</h2>
                  <div className="proof-grid">
                    {c.proofs.map((p) => (
                      <figure key={p.id}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.media_url} alt={p.caption || `${a.display_name} race-day photo`} loading="lazy" />
                        {p.caption && <figcaption>{p.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="cmp-aside" id="sponsor">
              {r?.starts_on && daysUntil(r.starts_on) > 0 && (
                <div className="panel"><Countdown date={r.starts_on} /></div>
              )}
              <div className="panel">
                <Progress raised={c.raised_cents} goal={c.goal_cents} count={c.sponsor_count} />
                {c.sponsor_by && <p className="muted small" style={{ marginTop: 12, marginBottom: 0 }}>Sponsor by {shortDate(c.sponsor_by)} so your logo makes the race kit.</p>}
              </div>
              <div className="panel">
                <h2>Sponsor {a.display_name?.split(' ')[0]}</h2>
                {open ? (
                  <SponsorForm action={pledgeSponsorship} campaignId={c.id} spots={c.spots} athleteName={a.display_name} />
                ) : (
                  <p className="muted">This campaign isn’t taking new sponsors right now.</p>
                )}
              </div>
              <div className="panel" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <InviteButton kind="sponsor" label="Share with a business" className="btn btn-ghost btn-sm" />
                <Link href="/about#contact" className="btn btn-ghost btn-sm">Questions? Contact us</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <div style={{ height: 96 }} />
      <JsonLd data={ld} />
    </>
  );
}
