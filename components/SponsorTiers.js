'use client';

import { pickSpot } from './pickSpot';

const fmt = (c) => `$${(c / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

// Package ladder. Each tier adds perks on top of the one below it, so we show
// what's NEW in bold and fold the inherited perks into an expandable list.
export default function SponsorTiers({ tiers = [], spots = [], campaignHref }) {
  if (!tiers.length) return null;

  const rows = tiers.map((t, i) => {
    const below = tiers.slice(0, i);
    const inherited = below.flatMap((b) => b.perks);
    const tierSpots = spots.filter((s) => s.tier === t.id);
    const openSpots = tierSpots.filter((s) => !(s.quantity && (s.claimed || 0) >= s.quantity));
    return { ...t, prev: below[below.length - 1], inherited, tierSpots, openSpots };
  });
  const ordered = [...rows].reverse(); // most valuable first

  return (
    <section className="tiers" aria-labelledby="tiers-title">
      <span className="eyebrow">Sponsor packages</span>
      <h2 id="tiers-title">Pick your package</h2>
      <p className="muted tiers-lede">Every package stacks — each one includes everything in the package below it.</p>

      <div className="tier-grid">
        {ordered.map((t) => {
          const soldOut = t.tierSpots.length > 0 && t.openSpots.length === 0;
          return (
            <article key={t.id} className={`tier ${t.featured ? 'is-featured' : ''} ${soldOut ? 'is-out' : ''}`}>
              <header className="tier-top">
                <div>
                  {t.featured && <span className="tier-flag mono">Main sponsor</span>}
                  <h3>{t.name}</h3>
                </div>
                <div className="tier-price">{fmt(t.price_cents)}</div>
              </header>

              <p className="tier-placement">{t.placement}</p>

              <ul className="tier-perks">
                {t.perks.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              {t.inherited.length > 0 && (
                <details className="tier-more">
                  <summary>
                    + Everything in the {t.prev.name} package <span className="mono">({t.inherited.length})</span>
                  </summary>
                  <ul className="tier-perks is-inherited">
                    {t.inherited.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </details>
              )}

              <footer className="tier-foot">
                <span className="mono tier-left">
                  {t.tierSpots.length > 1
                    ? `${t.openSpots.length} of ${t.tierSpots.length} open`
                    : soldOut
                      ? 'Taken'
                      : '1 spot · exclusive'}
                </span>
                <button
                  type="button"
                  className={`btn btn-sm ${t.featured ? 'btn-primary' : 'btn-ghost'}`}
                  disabled={soldOut}
                  onClick={() => t.openSpots[0] && pickSpot(t.openSpots[0].id, campaignHref)}
                >
                  {soldOut ? 'Sold out' : 'Choose'}
                </button>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
