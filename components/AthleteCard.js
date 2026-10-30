import Link from 'next/link';
import Avatar from './Avatar';
import { compactNumber } from '@/lib/format';

export default function AthleteCard({ athlete }) {
  return (
    <article className="athlete-card">
      <Link href={`/athletes/${athlete.handle}`} className="card-link" aria-label={athlete.display_name} />
      <div className="athlete-cover" style={athlete.cover_url ? { backgroundImage: `url(${athlete.cover_url})` } : undefined}>
        {athlete.founding_member && <span className="badge-founding">Founding member</span>}
      </div>
      <div className="athlete-body">
        <Avatar src={athlete.avatar_url} name={athlete.display_name} size={64} className="athlete-avatar" />
        <h3>{athlete.display_name}</h3>
        {athlete.tagline && <p className="athlete-tagline">{athlete.tagline}</p>}
        <div className="athlete-meta mono">
          {athlete.location && <span>{athlete.location}</span>}
          {athlete.followers > 0 && <span>{compactNumber(athlete.followers)} followers</span>}
          {athlete.sport && <span>{athlete.sport}</span>}
        </div>
      </div>
    </article>
  );
}
