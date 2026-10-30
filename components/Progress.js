import { money } from '@/lib/format';

export default function Progress({ raised = 0, goal = 0, count = 0, compact = false }) {
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  return (
    <div className={`progress ${compact ? 'progress-compact' : ''}`}>
      <div className="progress-nums">
        <strong>{money(raised)}</strong>
        <span>{goal > 0 ? `of ${money(goal)} goal` : 'raised'}</span>
        {!compact && <span className="progress-count">{count} sponsor{count === 1 ? '' : 's'}</span>}
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Sponsorship progress">
        <div className="progress-fill" style={{ width: `${Math.max(pct, raised > 0 ? 3 : 0)}%` }} />
      </div>
    </div>
  );
}
