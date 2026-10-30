-- ============================================================================
-- Markd by Tempo — Supabase schema
-- Run once in Supabase → SQL Editor → New query → paste → Run.
--
-- The athlete, campaign, sponsor spots and photos are HARDCODED in the website
-- (lib/athletes.js + public/athletes/). Supabase only stores what visitors send:
--   • sponsorships          — sponsor pledges from campaign pages
--   • athlete_applications  — "Get sponsored" form
--   • contact_messages      — About page form
-- There are no logins. The public can only insert into these tables and read the
-- public views below. You manage rows in Supabase → Table Editor.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- SPONSORSHIPS
-- campaign_slug / spot_key match the `slug` and spot `id` values in lib/athletes.js.
-- Change status in the Table Editor:
--   pending → accepted → paid → proof_posted → completed   (or declined / cancelled)
-- From "accepted" onward the sponsor shows on the public sponsor wall and counts toward the goal.
-- ---------------------------------------------------------------------------
create table if not exists public.sponsorships (
  id uuid primary key default gen_random_uuid(),
  campaign_slug text not null,
  spot_key text,
  business_name text not null,
  contact_name text,
  email text not null,
  phone text,
  website text,
  instagram text,
  facebook text,
  location text,
  logo_url text,
  amount_cents integer not null check (amount_cents >= 100),
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'paid', 'proof_posted', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sponsorships_campaign_idx on public.sponsorships (campaign_slug);

-- ---------------------------------------------------------------------------
-- ATHLETE APPLICATIONS ("Get sponsored" form)
-- ---------------------------------------------------------------------------
create table if not exists public.athlete_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  instagram text,
  followers integer,
  location text,
  sport text,
  race_name text,
  race_date date,
  goal_cents integer,
  story text,
  photo_url text,
  status text not null default 'new' check (status in ('new', 'contacted', 'approved', 'declined')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- CONTACT (About page form)
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text,
  body text not null,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists sponsorships_touch on public.sponsorships;
create trigger sponsorships_touch before update on public.sponsorships for each row execute function public.touch_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY — the public can only submit forms (never read emails/phones)
-- ============================================================================
alter table public.sponsorships enable row level security;
alter table public.athlete_applications enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "anyone can pledge" on public.sponsorships;
create policy "anyone can pledge" on public.sponsorships for insert to anon, authenticated
  with check (status = 'pending');

drop policy if exists "anyone can apply" on public.athlete_applications;
create policy "anyone can apply" on public.athlete_applications for insert to anon, authenticated
  with check (status = 'new');

drop policy if exists "anyone can contact" on public.contact_messages;
create policy "anyone can contact" on public.contact_messages for insert to anon, authenticated with check (true);

-- ============================================================================
-- PUBLIC VIEWS (no emails or phone numbers)
-- ============================================================================
create or replace view public.sponsor_wall as
select id, campaign_slug, spot_key, business_name, website, instagram, facebook,
       location as sponsor_location, logo_url, amount_cents, status, created_at
from public.sponsorships
where status in ('accepted', 'paid', 'proof_posted', 'completed');

create or replace view public.campaign_totals as
select campaign_slug,
       coalesce(sum(amount_cents), 0)::int as raised_cents,
       count(*)::int as sponsor_count
from public.sponsorships
where status in ('accepted', 'paid', 'proof_posted', 'completed')
group by campaign_slug;

-- Pending pledges also hold a spot so limited spots (e.g. 6 patches) can't be oversold.
create or replace view public.spot_claims as
select campaign_slug, spot_key, count(*)::int as claimed
from public.sponsorships
where spot_key is not null and status in ('pending', 'accepted', 'paid', 'proof_posted', 'completed')
group by campaign_slug, spot_key;

create or replace view public.platform_stats as
select coalesce(sum(amount_cents), 0)::int as raised_cents,
       count(distinct lower(business_name))::int as sponsors
from public.sponsorships
where status in ('accepted', 'paid', 'proof_posted', 'completed');

grant select on public.sponsor_wall, public.campaign_totals, public.spot_claims, public.platform_stats to anon, authenticated;

-- ============================================================================
-- STORAGE — public "media" bucket for files uploaded through the forms
--   sponsor-logos/  (pledge form)    applications/  (Get sponsored form)
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'])
on conflict (id) do nothing;

drop policy if exists "media is public" on storage.objects;
create policy "media is public" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "public uploads to form folders" on storage.objects;
create policy "public uploads to form folders" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] in ('sponsor-logos', 'applications'));
