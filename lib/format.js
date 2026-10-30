export function money(cents, { compact = false } = {}) {
  const v = (cents || 0) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: v % 1 === 0 ? 0 : 2,
    notation: compact && v >= 10000 ? 'compact' : 'standard',
  }).format(v);
}

export function compactNumber(n) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n || 0);
}

export function dateRange(start, end) {
  if (!start) return '';
  const s = new Date(`${start}T12:00:00Z`);
  const opts = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  if (!end || end === start) return s.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
  const e = new Date(`${end}T12:00:00Z`);
  const sameMonth = s.getUTCMonth() === e.getUTCMonth();
  return `${s.toLocaleDateString('en-US', opts)}–${e.toLocaleDateString('en-US', sameMonth ? { day: 'numeric', timeZone: 'UTC' } : opts)}, ${e.getUTCFullYear()}`;
}

export function shortDate(d) {
  if (!d) return '';
  const dt = new Date(d.length === 10 ? `${d}T12:00:00Z` : d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function daysUntil(d) {
  if (!d) return null;
  const target = new Date(`${d}T00:00:00Z`).getTime();
  return Math.ceil((target - Date.now()) / 86400000);
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'M';
}

export function slugify(s = '') {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function externalUrl(v) {
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export function igUrl(v) {
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://instagram.com/${v.replace(/^@/, '')}`;
}
