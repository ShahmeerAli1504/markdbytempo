// ============================================================================
// HARDCODED ATHLETE CONTENT
// Everything about the athlete lives here: profile, photos, campaign, sponsor spots.
// Photos go in /public/athletes/<handle>/ — replace the placeholder files with real
// photos using the SAME file names (or change the paths below).
//
// Only visitor submissions (sponsor pledges, applications, contact) are stored in Supabase.
// Prices are in cents: $150 = 15000.
// ============================================================================

export const hyroxRace = {
  slug: 'hyrox-anaheim-2026',
  name: 'HYROX Anaheim 2026',
  city: 'Anaheim, California',
  venue: 'Anaheim Convention Center',
  starts_on: '2026-12-03',
  ends_on: '2026-12-06',
  url: 'https://hyrox.com/',
  description:
    '8 km of running split by 8 functional fitness workout stations — a true test of strength, endurance and determination.',
};

const IMG = (handle, file) => `/athletes/${handle}/${file}`;

export const athletes = [
  {
    id: 'tempo',
    handle: 'tempo',
    display_name: 'Reno HYROX Athlete', // ← athlete's real name
    tagline: 'Hybrid athlete repping Reno at HYROX Anaheim',
    bio: `Hybrid fitness athlete from Reno, Nevada, training for HYROX Anaheim 2026.

Every run, every sled push and every wall ball is building toward one start line in Anaheim — and I want to bring my community with me.`,
    location: 'Reno, Nevada',
    sport: 'HYROX · Hybrid racing',
    followers: 0, // ← total followers across platforms
    instagram: null, // ← e.g. '@handle'
    tiktok: null,
    website: null,
    founding_member: true,
    avatar_url: IMG('tempo', 'avatar.jpg'),
    cover_url: IMG('tempo', 'cover.jpg'),
    // Training photos shown on the athlete and campaign pages
    gallery: [
      { src: IMG('tempo', 'gallery-1.jpg'), alt: 'Training run in Reno' },
      { src: IMG('tempo', 'gallery-2.jpg'), alt: 'Sled push training session' },
      { src: IMG('tempo', 'gallery-3.jpg'), alt: 'Wall ball training session' },
      { src: IMG('tempo', 'gallery-4.jpg'), alt: 'Strength training for HYROX' },
    ],
    created_at: '2026-10-30T00:00:00Z',
    campaigns: [
      {
        id: 'road-to-hyrox-anaheim-2026',
        slug: 'road-to-hyrox-anaheim-2026',
        title: 'Road to HYROX Anaheim 2026',
        status: 'live', // live | closed | completed
        goal_cents: 150000,
        sponsor_by: '2026-11-20',
        created_at: '2026-10-30T00:00:00Z',
        race: hyroxRace,
        story: `I'm preparing to compete in HYROX Anaheim 2026, and I'm looking for local businesses and brands interested in sponsoring my journey.

WHERE YOUR SUPPORT GOES
Race registration, travel and competition expenses. In return, your brand comes with me — from the first training block to the finish line in Anaheim.

Sponsorships of all sizes are welcome. Let's represent our community and take your brand to HYROX Anaheim!`,
        // `id` is stored with each pledge — don't change it once pledges come in.
        spots: [
          {
            id: 'patch',
            kind: 'patch',
            title: 'Logo patch on my race apparel',
            description:
              'Your business logo printed as a patch on my race-day kit at the Anaheim Convention Center — in every photo, every lap.',
            price_cents: 15000,
            quantity: 6,
          },
          {
            id: 'social',
            kind: 'social',
            title: 'Social media brand exposure',
            description: 'Dedicated posts, story tags and shoutouts for your business throughout my training journey.',
            price_cents: 7500,
            quantity: null,
          },
          {
            id: 'content',
            kind: 'content',
            title: 'Race-day photos & video',
            description: 'Race-day photos and videos featuring your brand, delivered to you to use in your own marketing.',
            price_cents: 10000,
            quantity: 4,
          },
          {
            id: 'supporter',
            kind: 'custom',
            title: 'Community supporter',
            description: 'Any amount helps. You get sponsor recognition throughout my journey and a spot on the sponsor wall.',
            price_cents: 2500,
            quantity: null,
          },
        ],
        // Race-day proof photos — add after the race, e.g.
        // { src: '/athletes/tempo/race-1.jpg', caption: 'Station 4 — sled pull' }
        raceDay: [],
      },
    ],
  },
];
