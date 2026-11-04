import Link from 'next/link';
import { notFound } from 'next/navigation';
import Avatar from '@/components/Avatar';
import CampaignCard from '@/components/CampaignCard';
import JsonLd from '@/components/JsonLd';
import Gallery from '@/components/Gallery';
import KitMap from '@/components/KitMap';
import SponsorTiers from '@/components/SponsorTiers';
import { getAthlete, getAthletes } from '@/lib/data';
import { compactNumber, externalUrl, igUrl } from '@/lib/format';
import { site } from '@/lib/site';

export const revalidate = 120;

export async function generateStaticParams() {
  const athletes = await getAthletes({ limit: 100 });
  return athletes.map((a) => ({ handle: a.handle }));
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const data = await getAthlete(handle);
  if (!data) return { title: 'Athlete not found', robots: { index: false } };
  const a = data.athlete;
  const description = (a.tagline || a.bio || `${a.display_name} is an athlete looking for sponsors on ${site.name}.`).slice(0, 160);
  return {
    title: `${a.display_name} (@${a.handle}) — sponsor this athlete`,
    description,
    alternates: { canonical: `/athletes/${a.handle}` },
    openGraph: { type: 'profile', url: `/athletes/${a.handle}`, title: `${a.display_name} | ${site.name}`, description, images: a.cover_url ? [a.cover_url] : undefined },
  };
}

export default async function AthletePage({ params }) {
  const { handle } = await params;
  const data = await getAthlete(handle);
  if (!data) notFound();
  const { athlete: a, campaigns } = data;
  const live = campaigns.find((c) => c.status === 'live');

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: a.display_name,
      alternateName: `@${a.handle}`,
      description: a.bio || a.tagline,
      image: a.avatar_url ? `${site.url}${a.avatar_url}` : undefined,
      homeLocation: a.location ? { '@type': 'Place', name: a.location } : undefined,
      sameAs: [igUrl(a.instagram), externalUrl(a.website)].filter(Boolean),
    },
  };

  return (
    <>
      <section>
        <div className="athlete-cover" style={{ height: 'clamp(160px, 26vw, 280px)', ...(a.cover_url ? { backgroundImage: `url(${a.cover_url})` } : {}) }} />
        <div className="wrap" style={{ marginTop: -60, position: 'relative' }}>
          <Avatar src={a.avatar_url} name={a.display_name} size={120} className="athlete-avatar" />
          <div className="section-head" style={{ marginTop: 12 }}>
            <div>
              <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/athletes">Athletes</Link> / <span>@{a.handle}</span></nav>
              <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', marginBottom: 8 }}>{a.display_name}</h1>
              {a.tagline && <p className="muted" style={{ fontSize: '1.15rem' }}>{a.tagline}</p>}
              <div className="campaign-meta">
                {a.founding_member && <span className="chip chip-hot">Founding member</span>}
                {a.location && <span className="chip">{a.location}</span>}
                {a.sport && <span className="chip">{a.sport}</span>}
                {a.followers > 0 && <span className="chip">{compactNumber(a.followers)} followers</span>}
              </div>
            </div>
            <div className="cta-actions">
              {a.instagram && <a href={igUrl(a.instagram)} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">{a.instagram.startsWith('@') ? a.instagram : 'Instagram'}</a>}
              {a.website && <a href={externalUrl(a.website)} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">Website</a>}
              {live && <Link href={`/campaigns/${live.slug}#sponsor`} className="btn btn-primary">Sponsor {a.display_name.split(' ')[0]}</Link>}
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap" style={{ display: 'grid', gap: 48 }}>
          {a.profile?.length ? (
            <div className="profile">
              <div className="profile-intro">
                <div>
                  <span className="eyebrow">{a.profile[0].title}</span>
                  <p className="profile-lead">{a.profile[0].body}</p>
                </div>
                {a.facts?.length > 0 && (
                  <dl className="profile-facts">
                    {a.facts.map((f) => (
                      <div key={f.label}>
                        <dt className="mono">{f.label}</dt>
                        <dd>{f.value}</dd>
                      </div>
                    ))}
                    {a.instagram && (
                      <div>
                        <dt className="mono">Instagram</dt>
                        <dd><a href={igUrl(a.instagram)} target="_blank" rel="noopener noreferrer">{a.instagram}</a></dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>
              <div className="profile-grid">
                {a.profile.slice(1).map((sec, i) => (
                  <article key={sec.id} className="profile-sec">
                    <span className="profile-num mono">{String(i + 1).padStart(2, '0')}</span>
                    <h2>{sec.title}</h2>
                    {sec.body.split(/\n+/).map((para, j) => <p key={j}>{para}</p>)}
                    {sec.pull && <blockquote className="profile-pull">“{sec.pull}”</blockquote>}
                  </article>
                ))}
              </div>
            </div>
          ) : (
            a.bio && (
              <div className="prose">
                <h2 style={{ marginTop: 0 }}>About</h2>
                {a.bio.split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            )
          )}
          {live?.tiers?.length > 0 && (
            <>
              <KitMap photos={a.kit_photos} spots={live.spots} name={a.display_name} campaignHref={`/campaigns/${live.slug}`} />
              <SponsorTiers tiers={live.tiers} spots={live.spots} campaignHref={`/campaigns/${live.slug}`} />
            </>
          )}
          <Gallery photos={a.gallery} title="Training" name={a.display_name} />
          <div>
            <h2>Campaigns</h2>
            {campaigns.length ? (
              <div className="grid-cards">{campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)}</div>
            ) : (
              <p className="muted">No live campaigns right now.</p>
            )}
          </div>
        </div>
      </section>
      <div style={{ height: 64 }} />
      <JsonLd data={ld} />
    </>
  );
}
