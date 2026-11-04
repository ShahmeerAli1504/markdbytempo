'use client';

import { useActionState, useEffect, useState } from 'react';
import { SubmitButton } from './ActionForm';
import { SPOT_KINDS } from '@/lib/site';
import { PICK_EVENT } from './pickSpot';

const fmt = (c) => `$${(c / 100).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export default function SponsorForm({ action, campaignId, spots = [], athleteName, initialSpot }) {
  const [state, formAction] = useActionState(action, null);
  const available = spots.filter((s) => !(s.quantity && (s.claimed || 0) >= s.quantity));
  const first = spots.find((s) => s.id === initialSpot) || available[0];
  const [spotId, setSpotId] = useState(first?.id || '');
  const [amount, setAmount] = useState(first ? String(first.price_cents / 100) : '50');
  const current = spots.find((s) => s.id === spotId);

  // Kit map / package buttons (or a ?spot= link) can pre-select a placement.
  useEffect(() => {
    const select = (id) => {
      const s = spots.find((x) => x.id === id && !(x.quantity && (x.claimed || 0) >= x.quantity));
      if (!s) return;
      setSpotId(s.id);
      setAmount(String(s.price_cents / 100));
    };
    const fromUrl = new URLSearchParams(window.location.search).get('spot');
    if (fromUrl) select(fromUrl);
    const onPick = (e) => select(e.detail);
    window.addEventListener(PICK_EVENT, onPick);
    return () => window.removeEventListener(PICK_EVENT, onPick);
  }, [spots]);

  if (state?.ok) {
    return (
      <div className="pledge-done" role="status">
        <div className="pledge-check" aria-hidden="true">✓</div>
        <h3>You’re on the start list.</h3>
        <p>{state.message}</p>
        <p className="muted small">Nothing is charged now — we’ll confirm with {athleteName} and email you payment details.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="form sponsor-form">
      <input type="hidden" name="campaign_id" value={campaignId} />
      <input type="hidden" name="spot_id" value={spotId} />
      <div className="hp" aria-hidden="true">
        <label>Company URL<input name="company_url" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset className={`spot-picker ${spots.length > 6 ? 'is-compact' : ''}`}>
        <legend>1 · Pick your spot</legend>
        {spots.map((s) => {
          const soldOut = s.quantity && (s.claimed || 0) >= s.quantity;
          const left = s.quantity ? s.quantity - (s.claimed || 0) : null;
          return (
            <label key={s.id} className={`spot-option ${spotId === s.id ? 'is-on' : ''} ${soldOut ? 'is-out' : ''}`}>
              <input
                type="radio"
                name="spot_choice"
                value={s.id}
                checked={spotId === s.id}
                disabled={soldOut}
                onChange={() => {
                  setSpotId(s.id);
                  setAmount(String(s.price_cents / 100));
                }}
              />
              <span className="spot-icon" aria-hidden="true">{SPOT_KINDS[s.kind]?.icon || '✦'}</span>
              <span className="spot-text">
                <strong>{s.title}</strong>
                {s.description && <span>{s.description}</span>}
              </span>
              <span className="spot-price">
                <strong>{fmt(s.price_cents)}+</strong>
                <span>{soldOut ? 'Sold out' : left !== null ? `${left} left` : 'Open'}</span>
              </span>
            </label>
          );
        })}
        <label className={`spot-option ${spotId === '' ? 'is-on' : ''}`}>
          <input type="radio" name="spot_choice" value="" checked={spotId === ''} onChange={() => setSpotId('')} />
          <span className="spot-icon" aria-hidden="true">＋</span>
          <span className="spot-text">
            <strong>Custom sponsorship</strong>
            <span>Any amount — tell the athlete what you have in mind.</span>
          </span>
          <span className="spot-price"><strong>Any</strong><span>Open</span></span>
        </label>
      </fieldset>

      <fieldset>
        <legend>2 · Your amount</legend>
        <label className="field field-money">
          <span>Amount (USD)</span>
          <div className="money-input">
            <span aria-hidden="true">$</span>
            <input
              name="amount"
              type="number"
              inputMode="decimal"
              min={current ? current.price_cents / 100 : 1}
              step="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {current && <small>Minimum for this spot: {fmt(current.price_cents)}. Going higher is welcome.</small>}
        </label>
      </fieldset>

      <fieldset>
        <legend>3 · Your business</legend>
        <div className="grid-2">
          <label className="field"><span>Business / brand name *</span><input name="business_name" required maxLength={120} autoComplete="organization" /></label>
          <label className="field"><span>Your name</span><input name="contact_name" maxLength={120} autoComplete="name" /></label>
          <label className="field"><span>Email *</span><input name="email" type="email" required autoComplete="email" /></label>
          <label className="field"><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
          <label className="field"><span>Website</span><input name="website" placeholder="yourbusiness.com" /></label>
          <label className="field"><span>Instagram</span><input name="instagram" placeholder="@yourbusiness" /></label>
          <label className="field"><span>City</span><input name="location" placeholder="Reno, NV" autoComplete="address-level2" /></label>
        </div>
        <label className="field">
          <span>Logo (PNG, JPG, SVG · max 5 MB)</span>
          <input name="logo" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" />
        </label>
        <label className="field">
          <span>Note to the athlete</span>
          <textarea name="message" rows={3} maxLength={2000} placeholder="Tell them about your business and what you’d love to see." />
        </label>
      </fieldset>

      {state?.error && <p className="form-msg is-error" role="alert">{state.error}</p>}
      <SubmitButton label={`Pledge $${amount || 0} sponsorship`} pendingLabel="Sending pledge…" className="btn btn-primary btn-lg btn-block" />
      <p className="muted small center">No account needed and no payment today. You only pay once your sponsorship is confirmed.</p>
    </form>
  );
}
