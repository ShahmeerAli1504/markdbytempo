# Markd by Tempo — athlete sponsorship platform

Next.js 15 (App Router) frontend for **Vercel**, with **Supabase** for the database and file storage.
Athletes apply for a free page; you publish their race campaign with sponsor spots. Businesses browse campaigns, pledge with their logo (no account needed), and appear on the sponsor wall once accepted.

## How it works
- **The athlete is hardcoded.** Profile, campaign, sponsor spots, prices and the training/race-day photo lists are in `lib/athletes.js`. The photos themselves are in `public/athletes/<handle>/`. To change any of it, edit those files and push to GitHub, and Vercel redeploys.
- **There are no logins.** Visitors browse and submit three forms, which are stored in Supabase:
  - **Sponsor pledge** (on the campaign page) → `sponsorships`
  - **Get sponsored** athlete application → `athlete_applications`
  - **Contact** (About page) → `contact_messages`
- **Live numbers come from Supabase.** The sponsor wall, the "raised" progress bar and sold-out spots are built from the `sponsorships` rows you accept.

## Features
- **Public pages:** home, campaigns, campaign detail (live countdown, progress bar, sponsor spots and a pledge form), athletes and athlete profiles, sponsor wall, races, how it works, pricing + refunds + FAQ, about + contact form, terms, privacy, custom 404
- **Sponsor pledge:** pick a spot (patch / social / content / race cost / custom), amount (minimum enforced), business info and logo upload. Sold-out spots lock automatically.
- **Invite tools:** share by text, email, WhatsApp, the native share sheet or copy link
- **SEO:** per-page titles, descriptions and canonicals; Open Graph and Twitter tags; generated OG images (site-wide plus one per campaign); `sitemap.xml`; `robots.txt`; web manifest; JSON-LD (Organization, WebSite, SportsEvent with Offers, ProfilePage/Person, FAQPage, HowTo, BreadcrumbList); ISR caching (pages refresh every 60s); security headers
- **Responsive:** tested at 390px and 1440px widths

## 1. Supabase setup
1. Create a project at https://supabase.com.
2. **SQL Editor → New query →** paste all of `supabase/schema.sql` **→ Run.** This creates the 3 form tables, the security policies, the public views and the `media` storage bucket used for uploaded logos and application photos.
3. **Project Settings → API:** copy the Project URL and the `anon` public key. (No auth setup needed.)

## 2. Local development
```bash
cp .env.example .env.local   # fill in the 3 values
npm install
npm run dev
```

## 3. Deploy on Vercel
1. Push this folder to GitHub and import it in Vercel. Vercel detects Next.js automatically.
2. Add these environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SITE_URL` (your final domain, with no trailing slash).
3. Deploy, then add your custom domain.

## 4. Running the site
**Athlete content (in code):**
| To… | Edit |
|---|---|
| Name, bio, tagline, follower count, Instagram | `lib/athletes.js` |
| Photos | Replace the files in `public/athletes/jaffet-corona/` and keep the same names (`avatar.jpg`, `cover.jpg`, `kit-front.jpg`, `kit-back.jpg`, `kit-side.jpg`, `gallery-1.jpg` to `gallery-4.jpg`). See the README.txt in that folder. |
| Goal, story, sponsor-by date, campaign status | the `campaigns` entry in `lib/athletes.js` (`goal_cents` is in cents, so $1,500 = `150000`) |
| Sponsor spots and prices | `spots` in `lib/athletes.js`. Don't change a spot's `id` once pledges exist. |
| Race-day photos after the race | Add the files to the folder and list them under `raceDay` in `lib/athletes.js`. |
| Add another athlete | Copy the athlete object in `lib/athletes.js` and give it a new `handle`, a new photo folder and its own campaign. |

**Pledges (Supabase → Table Editor → `sponsorships`):**
- New pledges arrive as `pending`. Email the sponsor payment details, then set `status` to `accepted`. They then appear on the sponsor wall and count toward the goal.
- Then move them along: `paid` → `proof_posted` → `completed`. Set `declined` to reject one.
- Pending pledges also reserve limited spots (for example the 6 patches), so set unwanted ones to `declined` to free the spot up.
- Applications are in `athlete_applications` and messages in `contact_messages`.
- Tip: Supabase → Database → Webhooks can email you whenever a new row comes in.

Changes in Supabase show on the site within about a minute.

## Payments
Sponsors pay after you accept their pledge — you email them a payment link, Zelle or an invoice. To add card payments held in escrow, the next step is Stripe Connect: Checkout on acceptance and a transfer when the sponsorship is completed.

## Customizing
- Brand name, tagline, email, Instagram, region and the HYROX template: `lib/site.js`
- Colors and type: the top of `app/globals.css`
- Logo: `components/Logo.js` and `app/icon.svg`
