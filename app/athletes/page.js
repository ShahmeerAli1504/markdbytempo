import Link from 'next/link';
import AthleteCard from '@/components/AthleteCard';
import InviteButton from '@/components/InviteButton';
import { getAthletes } from '@/lib/data';

export const revalidate = 120;

export const metadata = {
  title: 'Athletes looking for sponsors',
  description: 'Meet local runners, HYROX racers and hybrid athletes looking for business sponsors. Back their next race and get your brand seen.',
  alternates: { canonical: '/athletes' },
  openGraph: { url: '/athletes', title: 'Athletes looking for sponsors | Markd by Tempo' },
};

export default async function AthletesPage() {
  const athletes = await getAthletes();
  return (
    <>
      <section className="page-head lanes">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>Athletes</span></nav>
          <span className="eyebrow">{athletes.length} on the roster</span>
          <h1>Athletes</h1>
          <p>Real people training for real races. Every profile shows their story, audience and the start lines they’re chasing.</p>
          <div className="page-head-actions">
            <Link href="/get-sponsored" className="btn btn-primary">Join as an athlete</Link>
            <InviteButton kind="athlete" />
          </div>
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap grid-cards">
          {athletes.map((a) => <AthleteCard key={a.id} athlete={a} />)}
          <div className="empty">
            <h3>Know an athlete?</h3>
            <p>Invite a training partner, teammate or friend to apply for a page.</p>
            <InviteButton kind="athlete" className="btn btn-primary" />
          </div>
        </div>
      </section>
    </>
  );
}
