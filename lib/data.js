import { publicClient } from './supabase/public';
import { athletes as ATHLETES } from './athletes';

// Athletes, campaigns, spots and photos are hardcoded in lib/athletes.js.
// Supabase only adds live sponsorship data (pledge totals, sold spots, sponsor wall).

const LIVE = ['live', 'closed', 'completed'];

const athleteOnly = ({ campaigns, gallery, ...a }) => ({ ...a, gallery: gallery || [] });

function allCampaigns() {
  return ATHLETES.flatMap((a) =>
    (a.campaigns || [])
      .filter((c) => LIVE.includes(c.status))
      .map((c) => ({
        ...c,
        athlete: athleteOnly(a),
        spots: (c.spots || []).map((s, i) => ({ sort: i, ...s, claimed: 0 })),
        proofs: (c.raceDay || []).map((p, i) => ({ id: `${c.slug}-proof-${i}`, media_url: p.src, caption: p.caption || null })),
        raised_cents: 0,
        sponsor_count: 0,
      }))
  );
}

async function safe(query) {
  try {
    const { data, error } = await query;
    if (error) {
      console.error(error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function withLiveData(campaigns, { includeClaims = false } = {}) {
  const sb = publicClient();
  if (!sb || !campaigns.length) return campaigns;
  const slugs = campaigns.map((c) => c.slug);
  const [totals, claims] = await Promise.all([
    safe(sb.from('campaign_totals').select('*').in('campaign_slug', slugs)),
    includeClaims ? safe(sb.from('spot_claims').select('*').in('campaign_slug', slugs)) : Promise.resolve([]),
  ]);
  return campaigns.map((c) => {
    const t = totals.find((x) => x.campaign_slug === c.slug);
    return {
      ...c,
      raised_cents: t?.raised_cents || 0,
      sponsor_count: t?.sponsor_count || 0,
      spots: c.spots.map((s) => ({
        ...s,
        claimed: claims.find((x) => x.campaign_slug === c.slug && x.spot_key === s.id)?.claimed || 0,
      })),
    };
  });
}

// Add athlete / race / spot names to sponsor wall rows coming from Supabase.
function enrichSponsor(row) {
  const c = allCampaigns().find((x) => x.slug === row.campaign_slug);
  if (!c) return null;
  const spot = c.spots.find((s) => s.id === row.spot_key);
  return {
    ...row,
    campaign_title: c.title,
    athlete_name: c.athlete.display_name,
    athlete_handle: c.athlete.handle,
    race_name: c.race?.name,
    spot_title: spot?.title || null,
  };
}

export async function getCampaigns() {
  return withLiveData(allCampaigns());
}

export async function getCampaign(slug) {
  const c = allCampaigns().find((x) => x.slug === slug);
  if (!c) return null;
  const [full] = await withLiveData([c], { includeClaims: true });
  const sb = publicClient();
  const sponsors = sb
    ? (await safe(sb.from('sponsor_wall').select('*').eq('campaign_slug', slug).order('created_at', { ascending: false })))
        .map(enrichSponsor)
        .filter(Boolean)
    : [];
  return { ...full, sponsors };
}

export async function getAthletes() {
  return ATHLETES.map(athleteOnly);
}

export async function getAthlete(handle) {
  const a = ATHLETES.find((x) => x.handle === handle);
  if (!a) return null;
  const campaigns = await withLiveData(allCampaigns().filter((c) => c.athlete.handle === handle), { includeClaims: true });
  return { athlete: athleteOnly(a), campaigns };
}

export async function getSponsorWall({ limit = 60 } = {}) {
  const sb = publicClient();
  if (!sb) return [];
  const rows = await safe(sb.from('sponsor_wall').select('*').order('created_at', { ascending: false }).limit(limit));
  return rows.map(enrichSponsor).filter(Boolean);
}

export async function getRaces() {
  const map = new Map();
  for (const c of allCampaigns()) {
    if (!c.race) continue;
    const r = map.get(c.race.slug) || { ...c.race, id: c.race.slug, campaign_count: 0 };
    r.campaign_count += 1;
    map.set(c.race.slug, r);
  }
  return [...map.values()].sort((a, b) => String(a.starts_on).localeCompare(String(b.starts_on)));
}

export async function getStats() {
  const base = {
    athletes: ATHLETES.length,
    audience: ATHLETES.reduce((s, a) => s + (a.followers || 0), 0),
    raised_cents: 0,
    sponsors: 0,
  };
  const sb = publicClient();
  if (!sb) return base;
  const [row] = await safe(sb.from('platform_stats').select('*'));
  return { ...base, raised_cents: row?.raised_cents || 0, sponsors: row?.sponsors || 0 };
}

// Used by the pledge form to validate a submitted spot.
export function findSpot(campaignSlug, spotId) {
  const c = allCampaigns().find((x) => x.slug === campaignSlug);
  return { campaign: c || null, spot: c?.spots.find((s) => s.id === spotId) || null };
}
