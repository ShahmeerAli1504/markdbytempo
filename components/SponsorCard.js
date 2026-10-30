import Link from 'next/link';
import { externalUrl, igUrl, money, shortDate } from '@/lib/format';

export default function SponsorCard({ s, showAmount = true }) {
  const initials = (s.business_name || '?').slice(0, 2).toUpperCase();
  return (
    <article className="sponsor-card">
      <div className="sponsor-logo">
        {s.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.logo_url} alt={`${s.business_name} logo`} loading="lazy" />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>
      <div className="sponsor-info">
        <h3>{s.business_name}</h3>
        <p className="muted small">
          {s.sponsor_location ? `${s.sponsor_location} · ` : ''}Since {shortDate(s.created_at)}
        </p>
        <p className="sponsor-backed">
          Backed <Link href={`/athletes/${s.athlete_handle}`}>{s.athlete_name}</Link>
          {s.race_name ? <> at <Link href={`/campaigns/${s.campaign_slug}`}>{s.race_name}</Link></> : null}
          {showAmount && s.amount_cents ? <span className="mono"> · {money(s.amount_cents)}</span> : null}
        </p>
        {s.spot_title && <span className="chip">{s.spot_title}</span>}
      </div>
      <div className="sponsor-links">
        {s.website && <a href={externalUrl(s.website)} target="_blank" rel="noopener noreferrer nofollow" className="btn btn-sm btn-ghost">Website</a>}
        {s.instagram && <a href={igUrl(s.instagram)} target="_blank" rel="noopener noreferrer nofollow" className="btn btn-sm btn-ghost">Instagram</a>}
        {s.facebook && <a href={externalUrl(s.facebook)} target="_blank" rel="noopener noreferrer nofollow" className="btn btn-sm btn-ghost">Facebook</a>}
      </div>
    </article>
  );
}
