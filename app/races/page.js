import Link from 'next/link';
import { getRaces } from '@/lib/data';
import { dateRange, daysUntil } from '@/lib/format';

export const revalidate = 300;

export const metadata = {
  title: 'Races — upcoming events with sponsored athletes',
  description: 'Upcoming races and fitness events where Markd athletes are competing — including HYROX Anaheim 2026. Find an athlete to sponsor at each event.',
  alternates: { canonical: '/races' },
};

export default async function RacesPage() {
  const races = await getRaces();
  const upcoming = races.filter((r) => !r.ends_on || daysUntil(r.ends_on) >= 0);
  const past = races.filter((r) => r.ends_on && daysUntil(r.ends_on) < 0);
  const Row = ({ r }) => (
    <div className="spot-row">
      <div>
        <span className="chip">{dateRange(r.starts_on, r.ends_on)}</span>
        <h3 style={{ marginTop: 10 }}>{r.name}</h3>
        <p>{[r.venue, r.city].filter(Boolean).join(' · ')}</p>
      </div>
      <div className="price" style={{ display: 'grid', gap: 8, justifyItems: 'end' }}>
        {r.campaign_count}<small>athlete campaign{r.campaign_count === 1 ? '' : 's'}</small>
        <Link href="/campaigns" className="btn btn-sm btn-ghost">Find athletes</Link>
      </div>
    </div>
  );
  return (
    <>
      <section className="page-head lanes">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>Races</span></nav>
          <h1>Races</h1>
          <p>The start lines Markd athletes are chasing. Every race here has at least one athlete looking for sponsors.</p>
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap" style={{ display: 'grid', gap: 40 }}>
          <div>
            <h2>Upcoming</h2>
            <div className="spot-list">{upcoming.length ? upcoming.map((r) => <Row key={r.id} r={r} />) : <p className="muted">No upcoming races yet.</p>}</div>
          </div>
          {past.length > 0 && (
            <div>
              <h2>Past</h2>
              <div className="spot-list">{past.map((r) => <Row key={r.id} r={r} />)}</div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
