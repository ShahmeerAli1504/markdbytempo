import Link from 'next/link';
import CampaignCard from '@/components/CampaignCard';
import InviteButton from '@/components/InviteButton';
import { getCampaigns } from '@/lib/data';

export const revalidate = 60;

export const metadata = {
  title: 'Sponsorship campaigns — back an athlete’s next race',
  description:
    'Browse live athlete sponsorship campaigns. Put your logo on race apparel, get social shoutouts and race-day content — starting at any budget.',
  alternates: { canonical: '/campaigns' },
  openGraph: { url: '/campaigns', title: 'Sponsorship campaigns | Markd by Tempo' },
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  return (
    <>
      <section className="page-head lanes">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>Campaigns</span></nav>
          <span className="eyebrow">{campaigns.length} live</span>
          <h1>Campaigns</h1>
          <p>Every campaign is one athlete, one race and a set of sponsor spots. Pick one, pledge, and your brand goes with them to the start line.</p>
          <div className="page-head-actions">
            <Link href="/get-sponsored" className="btn btn-primary">Start a campaign</Link>
            <InviteButton kind="sponsor" />
          </div>
        </div>
      </section>
      <section className="section-tight">
        <div className="wrap">
          {campaigns.length ? (
            <div className="grid-cards">
              {campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          ) : (
            <div className="empty">
              <h3>No live campaigns yet</h3>
              <p>Athletes are lacing up. Be the first to launch a campaign.</p>
              <Link href="/get-sponsored" className="btn btn-primary">Start a campaign</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
