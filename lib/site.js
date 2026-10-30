// Central brand + content config. Edit here and it updates everywhere (meta tags, footer, JSON-LD).

export const site = {
  name: 'Markd by Tempo',
  shortName: 'Markd',
  tagline: 'Get Seen. Get Sponsored. Get Markd.',
  mission: 'To empower every athlete to turn their passion into opportunity.',
  description:
    'Markd by Tempo connects athletes with local businesses. Sponsor an athlete’s race — logo patches, social shoutouts and race-day content — or apply for a free page and get sponsored.',
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
  ).replace(/\/$/, ''),
  email: 'hello@markdbytempo.com',
  instagram: 'https://www.instagram.com/',
  locale: 'en_US',
  region: 'Reno, Nevada',
  keywords: [
    'athlete sponsorship',
    'sponsor an athlete',
    'HYROX sponsorship',
    'HYROX Anaheim 2026',
    'local business sponsorship',
    'Reno Nevada athletes',
    'race sponsorship',
    'fitness sponsorship',
    'get sponsored',
  ],
};

export const SPOT_KINDS = {
  patch: { label: 'Logo patch', icon: '◎', blurb: 'Your logo printed as a patch on race apparel.' },
  social: { label: 'Social shoutouts', icon: '◉', blurb: 'Posts, stories and tags through training.' },
  content: { label: 'Race-day content', icon: '▣', blurb: 'Photos and video featuring your brand.' },
  race_cost: { label: 'Race costs', icon: '◆', blurb: 'Cover registration, travel or gear.' },
  custom: { label: 'Supporter', icon: '✦', blurb: 'Any amount. Every bit counts.' },
};

// The athlete, campaign, spots and photos are hardcoded in lib/athletes.js.
export { hyroxRace } from './athletes';
