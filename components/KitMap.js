'use client';

import { useState } from 'react';
import Image from 'next/image';
import { pickSpot } from './pickSpot';

const VIEWS = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'side', label: 'Side' },
];

const fmt = (c) => `$${(c / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

// Front / back / side kit photos with a numbered pin on every sponsor placement.
// Hovering a pin highlights its row in the list (and the reverse); clicking picks
// that placement in the sponsor form (or jumps to the campaign page to do it).
export default function KitMap({ photos = {}, spots = [], name, campaignHref }) {
  const [active, setActive] = useState(null);
  const [view, setView] = useState('front');
  const numbered = spots.map((s, i) => ({ ...s, n: i + 1, soldOut: !!(s.quantity && (s.claimed || 0) >= s.quantity) }));
  const views = VIEWS.filter((v) => photos[v.id]);
  if (!views.length || !numbered.length) return null;
  const open = numbered.filter((s) => !s.soldOut).length;

  const choose = (s) => {
    if (s.soldOut) return;
    pickSpot(s.id, campaignHref);
  };

  return (
    <section className="kit" aria-labelledby="kit-title">
      <div className="kit-head">
        <div>
          <span className="eyebrow">The race kit</span>
          <h2 id="kit-title">Where your logo goes</h2>
        </div>
        <p className="muted small kit-count mono">
          {open} of {numbered.length} placements open
        </p>
      </div>

      <div className="kit-tabs" role="tablist" aria-label="Kit view">
        {views.map((v) => (
          <button key={v.id} type="button" role="tab" aria-selected={view === v.id} className={view === v.id ? 'is-on' : ''} onClick={() => setView(v.id)}>
            {v.label}
          </button>
        ))}
      </div>

      <div className="kit-views">
        {views.map((v) => (
          <figure key={v.id} className={`kit-view ${view === v.id ? 'is-shown' : ''}`}>
            <div className="kit-photo">
              <Image src={photos[v.id]} alt={`${name} race kit — ${v.label.toLowerCase()} view`} fill sizes="(max-width: 700px) 100vw, 260px" />
              {numbered.flatMap((s) =>
                (s.pins || [])
                  .filter((p) => p.view === v.id)
                  .map((p) => (
                    <button
                      key={`${s.id}-${v.id}`}
                      type="button"
                      className={`kit-pin ${active === s.id ? 'is-active' : ''} ${s.soldOut ? 'is-out' : ''} ${s.tier === 'main' ? 'is-main' : ''}`}
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      onMouseEnter={() => setActive(s.id)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(s.id)}
                      onBlur={() => setActive(null)}
                      onClick={() => choose(s)}
                      aria-label={`${s.n}. ${s.title} — ${fmt(s.price_cents)}${s.soldOut ? ', taken' : ''}`}
                    >
                      {s.n}
                    </button>
                  ))
              )}
            </div>
            <figcaption className="mono">{v.label}</figcaption>
          </figure>
        ))}
      </div>

      <ol className="kit-list">
        {numbered.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`kit-row ${active === s.id ? 'is-active' : ''} ${s.soldOut ? 'is-out' : ''}`}
              onMouseEnter={() => setActive(s.id)}
              onMouseLeave={() => setActive(null)}
              onClick={() => choose(s)}
              disabled={s.soldOut}
            >
              <span className="kit-n mono">{String(s.n).padStart(2, '0')}</span>
              <span className="kit-name">{s.title}</span>
              <span className="kit-price">{s.soldOut ? 'Taken' : fmt(s.price_cents)}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="muted small kit-note">Tap any placement to claim it. Left and right are {name?.split(' ')[0] || 'the athlete'}’s left and right.</p>
    </section>
  );
}
