import Link from 'next/link';
import Avatar from './Avatar';
import Progress from './Progress';
import { dateRange, daysUntil, shortDate, money } from '@/lib/format';

export default function CampaignCard({ campaign, featured = false }) {
  const a = campaign.athlete || {};
  const r = campaign.race;
  const left = daysUntil(r?.starts_on);
  const fromPrice = campaign.spots?.length ? Math.min(...campaign.spots.map((s) => s.price_cents)) : null;
  return (
    <article className={`campaign-card ${featured ? 'is-featured' : ''}`}>
      <Link href={`/campaigns/${campaign.slug}`} className="card-link" aria-label={`${campaign.title} by ${a.display_name}`} />
      <div className="bib">
        <div className="bib-top">
          <span className="mono">{r ? r.name.toUpperCase() : 'OPEN CAMPAIGN'}</span>
          {left !== null && left >= 0 && <span className="bib-days mono">T-{left}D</span>}
        </div>
        <div className="bib-number">{a.display_name}</div>
        <div className="bib-bottom mono">
          <span>{r?.city || a.location || '—'}</span>
          <span>{r?.starts_on ? dateRange(r.starts_on, r.ends_on) : ''}</span>
        </div>
      </div>
      <div className="campaign-body">
        <div className="campaign-athlete">
          <Avatar src={a.avatar_url} name={a.display_name} size={36} />
          <div>
            <h3>{campaign.title}</h3>
            <p className="muted small">
              @{a.handle}
              {a.location ? ` · ${a.location}` : ''}
            </p>
          </div>
        </div>
        <Progress raised={campaign.raised_cents} goal={campaign.goal_cents} count={campaign.sponsor_count} compact />
        <div className="campaign-meta">
          {fromPrice !== null && <span className="chip">Spots from {money(fromPrice)}</span>}
          {campaign.sponsor_by && <span className="chip chip-hot">Sponsor by {shortDate(campaign.sponsor_by)}</span>}
        </div>
      </div>
    </article>
  );
}
