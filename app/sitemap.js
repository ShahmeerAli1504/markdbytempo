import { site } from '@/lib/site';
import { getCampaigns, getAthletes } from '@/lib/data';

export const revalidate = 3600;

export default async function sitemap() {
  const now = new Date();
  const staticPages = ['', '/campaigns', '/athletes', '/sponsors', '/races', '/get-sponsored', '/how-it-works', '/about', '/pricing', '/terms', '/privacy'].map(
    (p) => ({
      url: `${site.url}${p}`,
      lastModified: now,
      changeFrequency: p === '' || p === '/campaigns' ? 'daily' : 'weekly',
      priority: p === '' ? 1 : p === '/campaigns' || p === '/get-sponsored' || p === '/sponsors' ? 0.9 : 0.6,
    })
  );
  const [campaigns, athletes] = await Promise.all([getCampaigns({ limit: 1000 }), getAthletes({ limit: 1000 })]);
  return [
    ...staticPages,
    ...campaigns.map((c) => ({
      url: `${site.url}/campaigns/${c.slug}`,
      lastModified: new Date(c.updated_at || c.created_at || now),
      changeFrequency: 'daily',
      priority: 0.8,
    })),
    ...athletes.map((a) => ({
      url: `${site.url}/athletes/${a.handle}`,
      lastModified: new Date(a.updated_at || a.created_at || now),
      changeFrequency: 'weekly',
      priority: 0.7,
    })),
  ];
}
