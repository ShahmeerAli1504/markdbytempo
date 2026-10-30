'use client';

import { useEffect, useState } from 'react';

function parts(target) {
  const diff = Math.max(0, target - Date.now());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ date, label = 'Race day in' }) {
  // Race start at 8am Pacific (16:00 UTC)
  const target = new Date(`${date}T16:00:00Z`).getTime();
  const [t, setT] = useState(null);
  useEffect(() => {
    setT(parts(target));
    const id = setInterval(() => setT(parts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  const v = t || { d: '--', h: '--', m: '--', s: '--' };
  const pad = (n) => (typeof n === 'number' ? String(n).padStart(2, '0') : n);
  return (
    <div className="countdown" aria-label={`${label} ${v.d} days`}>
      <span className="countdown-label">{label}</span>
      <div className="countdown-cells">
        <div><strong>{v.d}</strong><span>days</span></div>
        <div><strong>{pad(v.h)}</strong><span>hrs</span></div>
        <div><strong>{pad(v.m)}</strong><span>min</span></div>
        <div><strong>{pad(v.s)}</strong><span>sec</span></div>
      </div>
    </div>
  );
}
