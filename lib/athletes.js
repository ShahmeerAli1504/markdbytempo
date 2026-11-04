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
const H = 'jaffet-corona';

// ----------------------------------------------------------------------------
// SPONSOR PACKAGES — each tier includes everything in the tier below it.
// `perks` lists only what that tier ADDS; the site stacks them automatically.
// ----------------------------------------------------------------------------
const tiers = [
  {
    id: 'calf',
    name: 'Calf Sponsor',
    price_cents: 5000,
    placement: 'Logo on one calf.',
    perks: ['Tagged Instagram story announcing your support', 'Mention in the post-race sponsor thank-you'],
  },
  {
    id: 'bicep',
    name: 'Bicep Sponsor',
    price_cents: 10000,
    placement: 'Logo on one bicep.',
    perks: ['Tagged mention in a training update'],
  },
  {
    id: 'glute',
    name: 'Back of Shorts Sponsor',
    price_cents: 15000,
    placement: 'Logo on one glute area of the shorts.',
    perks: ['Race-day photos featuring your logo, available for your brand to repost'],
  },
  {
    id: 'thigh',
    name: 'Thigh Sponsor',
    price_cents: 17500,
    placement: 'Logo on one front thigh of the shorts.',
    perks: ['An additional dedicated Instagram story featuring your brand'],
  },
  {
    id: 'chest',
    name: 'Chest Sponsor',
    price_cents: 20000,
    placement: 'Logo on the left or right chest.',
    perks: ['Your brand tagged and recognized in my race-week feed post'],
  },
  {
    id: 'stomach',
    name: 'Stomach Sponsor',
    price_cents: 30000,
    placement: 'Logo across the stomach area of the shirt.',
    perks: ['A dedicated Instagram story sharing what your business offers and linking to your page'],
  },
  {
    id: 'upper-back',
    name: 'Upper Back Sponsor',
    price_cents: 35000,
    placement: 'Large logo on the upper back of the shirt.',
    perks: ['A dedicated training reel featuring your brand, with a tag in the caption'],
  },
  {
    id: 'main',
    name: 'Main Sponsor',
    price_cents: 50000,
    placement: 'Largest logo, placed at center chest.',
    perks: [
      'A dedicated Instagram feed post introducing your brand as my main sponsor',
      'A verbal thank-you in my race recap video',
    ],
    featured: true,
  },
];

// ----------------------------------------------------------------------------
// KIT PLACEMENTS — one sponsor per placement (quantity: 1).
// `pins` place the numbered markers on the front / back / side kit photos.
// x / y are percentages of the photo (0–100, from the top-left corner).
// "Left" / "right" are Jaffet's left and right — on the FRONT photo his left
// side appears on the viewer's right. Nudge the numbers once real photos are in.
// `id` is stored with each pledge — don't change it once pledges come in.
// ----------------------------------------------------------------------------
const placements = [
  { id: 'center-chest', tier: 'main', title: 'Center chest — main sponsor', pins: [{ view: 'front', x: 50, y: 34 }] },
  { id: 'upper-back', tier: 'upper-back', title: 'Upper back — shirt', pins: [{ view: 'back', x: 50, y: 29 }] },
  { id: 'stomach', tier: 'stomach', title: 'Stomach — front of shirt', pins: [{ view: 'front', x: 50, y: 45 }] },
  { id: 'left-chest', tier: 'chest', title: 'Left chest', pins: [{ view: 'front', x: 60, y: 24 }] },
  { id: 'right-chest', tier: 'chest', title: 'Right chest', pins: [{ view: 'front', x: 40, y: 24 }, { view: 'side', x: 55, y: 25 }] },
  { id: 'left-thigh', tier: 'thigh', title: 'Left thigh — front of shorts', pins: [{ view: 'front', x: 56, y: 61 }] },
  { id: 'right-thigh', tier: 'thigh', title: 'Right thigh — front of shorts', pins: [{ view: 'front', x: 44, y: 61 }, { view: 'side', x: 56, y: 61 }] },
  { id: 'left-glute', tier: 'glute', title: 'Left glute — back of shorts', pins: [{ view: 'back', x: 44.5, y: 54 }] },
  { id: 'right-glute', tier: 'glute', title: 'Right glute — back of shorts', pins: [{ view: 'back', x: 55.5, y: 54 }, { view: 'side', x: 44, y: 54 }] },
  { id: 'left-bicep', tier: 'bicep', title: 'Left bicep', pins: [{ view: 'front', x: 70, y: 33 }] },
  { id: 'right-bicep', tier: 'bicep', title: 'Right bicep', pins: [{ view: 'front', x: 30, y: 33 }, { view: 'side', x: 49, y: 33 }] },
  { id: 'left-calf', tier: 'calf', title: 'Left calf', pins: [{ view: 'back', x: 44, y: 81 }] },
  { id: 'right-calf', tier: 'calf', title: 'Right calf', pins: [{ view: 'back', x: 56, y: 81 }, { view: 'side', x: 46, y: 81 }] },
];

const tierById = Object.fromEntries(tiers.map((t) => [t.id, t]));

export const athletes = [
  {
    id: 'jaffet-corona',
    handle: H,
    display_name: 'Jaffet Corona',
    tagline: 'Former college soccer player turned hybrid athlete — racing HYROX Anaheim for Reno.',
    // Short bio used on cards, meta tags and search results.
    bio: `My name is Jaffet Corona, and I’m an athlete from Reno, Nevada. Sports have always been a big part of my life, from playing competitive soccer to now challenging myself through running and HYROX.`,
    // Full "About me" — shown as sections on the athlete page.
    profile: [
      {
        id: 'about',
        title: 'About me',
        body: `My name is Jaffet Corona, and I’m an athlete from Reno, Nevada. Sports have always been a big part of my life, from playing competitive soccer to now challenging myself through running and HYROX.`,
      },
      {
        id: 'why',
        title: 'Why I’m running this race',
        body: `I’m competing in HYROX Anaheim because I want to see how far I can push myself. I’ve always enjoyed competition and having a goal to work toward. HYROX challenges my strength, endurance, and mindset, and I’m excited to put my training to the test.`,
      },
      {
        id: 'motivation',
        title: 'My motivation',
        body: `I’m motivated by progress—getting faster, getting stronger, and doing things I couldn’t do before. Having a race ahead gives my training a purpose. I want to show up prepared, give everything I have, and represent Reno.`,
        pull: 'Show up prepared, give everything I have, and represent Reno.',
      },
      {
        id: 'journey',
        title: 'My fitness journey',
        body: `My background is in soccer. I played in college and with Battle Born FC, which taught me discipline, teamwork, and how to compete. Since then, I’ve shifted more of my focus toward running and strength training. HYROX has given me a new goal and a reason to keep developing as an athlete.`,
      },
      {
        id: 'sponsors',
        title: 'Why I’m looking for sponsors',
        body: `Sponsorship would help cover registration, travel, and competition expenses for HYROX Anaheim. In return, I’d proudly represent your brand through logo placement on my race apparel, training updates, social media recognition, and race-day photos and videos. I want to build a relationship where you’re part of my journey and I’m bringing visibility to your brand along the way.`,
      },
    ],
    // Quick-glance facts on the athlete page
    facts: [
      { label: 'Hometown', value: 'Reno, Nevada' },
      { label: 'Background', value: 'College soccer · Battle Born FC' },
      { label: 'Now training', value: 'Running · Strength · HYROX' },
      { label: 'Next race', value: 'HYROX Anaheim · Dec 2026' },
    ],
    location: 'Reno, Nevada',
    sport: 'HYROX · Running · Strength',
    followers: 0, // ← total followers across platforms (shows a chip when > 0)
    instagram: '@_jayfetti11',
    tiktok: null,
    website: null,
    founding_member: true,
    avatar_url: IMG(H, 'avatar.jpg'),
    cover_url: IMG(H, 'cover.jpg'),
    // Race kit photos — where sponsor logos go. Same framing for all three works best.
    kit_photos: {
      front: IMG(H, 'kit-front.jpg'),
      back: IMG(H, 'kit-back.jpg'),
      side: IMG(H, 'kit-side.jpg'),
    },
    // Training photos shown on the athlete and campaign pages
    gallery: [
      { src: IMG(H, 'gallery-1.jpg'), alt: 'Jaffet Corona on a training run in Reno' },
      { src: IMG(H, 'gallery-2.jpg'), alt: 'Jaffet Corona sled push training' },
      { src: IMG(H, 'gallery-3.jpg'), alt: 'Jaffet Corona wall ball training' },
      { src: IMG(H, 'gallery-4.jpg'), alt: 'Jaffet Corona strength training for HYROX' },
    ],
    created_at: '2026-11-04T00:00:00Z',
    campaigns: [
      {
        id: 'road-to-hyrox-anaheim-2026',
        slug: 'road-to-hyrox-anaheim-2026',
        title: 'Road to HYROX Anaheim 2026',
        status: 'live', // live | closed | completed
        goal_cents: 250000, // all 13 placements = $2,500
        sponsor_by: '2026-11-20',
        created_at: '2026-11-04T00:00:00Z',
        race: hyroxRace,
        story: `WHY I’M RUNNING THIS RACE
I’m competing in HYROX Anaheim because I want to see how far I can push myself. I’ve always enjoyed competition and having a goal to work toward. HYROX challenges my strength, endurance, and mindset, and I’m excited to put my training to the test.

WHERE YOUR SUPPORT GOES
Sponsorship would help cover registration, travel, and competition expenses for HYROX Anaheim. In return, I’d proudly represent your brand through logo placement on my race apparel, training updates, social media recognition, and race-day photos and videos.

A REAL PARTNERSHIP
I want to build a relationship where you’re part of my journey and I’m bringing visibility to your brand along the way.`,
        tiers,
        spots: placements.map((p) => {
          const t = tierById[p.tier];
          return {
            id: p.id,
            kind: 'patch',
            tier: p.tier,
            title: p.title,
            description: `${t.name} package`,
            price_cents: t.price_cents,
            quantity: 1,
            pins: p.pins,
          };
        }),
        // Race-day proof photos — add after the race, e.g.
        // { src: '/athletes/jaffet-corona/race-1.jpg', caption: 'Station 4 — sled pull' }
        raceDay: [],
      },
    ],
  },
];
