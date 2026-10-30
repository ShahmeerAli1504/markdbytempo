'use server';

import { publicClient } from '@/lib/supabase/public';
import { findSpot } from '@/lib/data';

// No accounts on this site: these three public forms are the only writes.
// The athlete, campaign and photos are hardcoded in lib/athletes.js; you accept pledges in the Supabase Table Editor.

const NOT_CONFIGURED = { error: 'The database isn’t connected yet. Add your Supabase keys to enable this form.' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const str = (fd, k, max = 500) => {
  const v = fd.get(k);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
};
const cents = (v) => {
  const n = Math.round(parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')) * 100);
  return Number.isFinite(n) ? n : 0;
};

async function upload(sb, folder, file) {
  if (!file || typeof file === 'string' || !file.size) return null;
  if (file.size > 5 * 1024 * 1024) throw new Error('Images must be under 5 MB.');
  if (!/^image\//.test(file.type)) throw new Error('Please upload an image file.');
  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from('media').upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error('Image upload failed — try a smaller PNG or JPG.');
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
}

// ---------------------------------------------------------------------------
// SPONSOR PLEDGE
// ---------------------------------------------------------------------------
export async function pledgeSponsorship(_prev, fd) {
  const sb = publicClient();
  if (!sb) return NOT_CONFIGURED;
  if (str(fd, 'company_url')) return { ok: true, message: 'Thanks!' }; // honeypot

  const campaign_slug = str(fd, 'campaign_id', 100);
  const spot_key = str(fd, 'spot_id', 60) || null;
  const business_name = str(fd, 'business_name', 120);
  const email = str(fd, 'email', 200).toLowerCase();
  const amount_cents = cents(fd.get('amount'));

  const { campaign, spot } = findSpot(campaign_slug, spot_key);
  if (!campaign || campaign.status !== 'live') return { error: 'This campaign isn’t taking sponsors right now.' };
  if (!business_name) return { error: 'Add your business or brand name.' };
  if (!EMAIL_RE.test(email)) return { error: 'Enter a valid email so we can reach you.' };
  if (amount_cents < 100) return { error: 'Minimum sponsorship is $1.' };

  if (spot_key) {
    if (!spot) return { error: 'That spot no longer exists.' };
    if (amount_cents < spot.price_cents) return { error: `This spot starts at $${(spot.price_cents / 100).toFixed(0)}.` };
    if (spot.quantity) {
      const { data: claim } = await sb
        .from('spot_claims')
        .select('claimed')
        .eq('campaign_slug', campaign_slug)
        .eq('spot_key', spot_key)
        .maybeSingle();
      if ((claim?.claimed || 0) >= spot.quantity) return { error: 'That spot just sold out — pick another one.' };
    }
  }

  let logo_url = null;
  try {
    logo_url = await upload(sb, 'sponsor-logos', fd.get('logo'));
  } catch (e) {
    return { error: e.message };
  }

  const { error } = await sb.from('sponsorships').insert({
    campaign_slug,
    spot_key,
    business_name,
    contact_name: str(fd, 'contact_name', 120) || null,
    email,
    phone: str(fd, 'phone', 40) || null,
    website: str(fd, 'website', 200) || null,
    instagram: str(fd, 'instagram', 100) || null,
    location: str(fd, 'location', 100) || null,
    logo_url,
    amount_cents,
    message: str(fd, 'message', 2000) || null,
  });
  if (error) return { error: 'Something went wrong saving your pledge. Please try again.' };
  return {
    ok: true,
    message: 'Pledge sent! We’ll confirm by email with payment details. Your brand goes on the sponsor wall once it’s accepted.',
  };
}

// ---------------------------------------------------------------------------
// ATHLETE APPLICATION ("Get sponsored")
// ---------------------------------------------------------------------------
export async function submitApplication(_prev, fd) {
  const sb = publicClient();
  if (!sb) return NOT_CONFIGURED;
  if (str(fd, 'company_url')) return { ok: true, message: 'Thanks!' };

  const name = str(fd, 'name', 120);
  const email = str(fd, 'email', 200).toLowerCase();
  if (!name) return { error: 'Tell us your name.' };
  if (!EMAIL_RE.test(email)) return { error: 'Enter a valid email address.' };

  let photo_url = null;
  try {
    photo_url = await upload(sb, 'applications', fd.get('photo'));
  } catch (e) {
    return { error: e.message };
  }

  const followers = parseInt(str(fd, 'followers', 12).replace(/[^0-9]/g, ''), 10);
  const race_date = str(fd, 'race_date', 10);
  const { error } = await sb.from('athlete_applications').insert({
    name,
    email,
    phone: str(fd, 'phone', 40) || null,
    instagram: str(fd, 'instagram', 100) || null,
    followers: Number.isFinite(followers) ? followers : null,
    location: str(fd, 'location', 100) || null,
    sport: str(fd, 'sport', 80) || null,
    race_name: str(fd, 'race_name', 160) || null,
    race_date: /^\d{4}-\d{2}-\d{2}$/.test(race_date) ? race_date : null,
    goal_cents: cents(fd.get('goal')) || null,
    story: str(fd, 'story', 4000) || null,
    photo_url,
  });
  if (error) return { error: 'Couldn’t send your application — please try again.' };
  return { ok: true, message: 'Application received! We’ll review it and email you within 48 hours to set up your page.', reset: true };
}

// ---------------------------------------------------------------------------
// CONTACT
// ---------------------------------------------------------------------------
export async function sendContact(_prev, fd) {
  const sb = publicClient();
  if (!sb) return NOT_CONFIGURED;
  if (str(fd, 'company_url')) return { ok: true, message: 'Thanks!' };
  const name = str(fd, 'name', 120);
  const email = str(fd, 'email', 200);
  const body = str(fd, 'body', 4000);
  if (!name || !EMAIL_RE.test(email) || !body) return { error: 'Please fill in your name, email and message.' };
  const { error } = await sb.from('contact_messages').insert({ name, email, body, topic: str(fd, 'topic', 60) || null });
  if (error) return { error: 'Couldn’t send — please email us instead.' };
  return { ok: true, message: 'Thanks — we’ll get back to you within a day.', reset: true };
}
