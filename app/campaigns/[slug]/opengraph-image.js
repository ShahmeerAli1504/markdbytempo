import { ImageResponse } from 'next/og';
import { getCampaign } from '@/lib/data';
import { dateRange } from '@/lib/format';
import { brandDataUrl, publicDataUrl } from '@/lib/og';

export const alt = 'Sponsor this athlete on MARKD by tempo';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { slug } = await params;
  const [c, logo] = await Promise.all([getCampaign(slug), brandDataUrl('markd-logo-white.png')]);
  const photo = await publicDataUrl(c?.athlete?.avatar_url);
  const name = c?.athlete?.display_name || 'Markd athlete';
  const race = c?.race;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#0a0a0a', padding: 48, fontFamily: 'sans-serif' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ecfae9', color: '#0a0a0a', borderRadius: 28, padding: 44 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, fontWeight: 700 }}>
            <span>{(race?.name || 'OPEN CAMPAIGN').toUpperCase()}</span>
            <span>{race?.starts_on ? dateRange(race.starts_on, race.ends_on).toUpperCase() : ''}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 38, fontWeight: 800, color: '#1f7a2c' }}>SPONSOR</div>
            <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: -3, transform: 'skewX(-8deg)', maxWidth: 760 }}>{name}</div>
            <div style={{ fontSize: 32, marginTop: 14, color: '#3d4a3a', maxWidth: 700 }}>{c?.title || ''}</div>
          </div>
          <div style={{ display: 'flex', borderTop: '3px solid #0a0a0a', paddingTop: 18, fontSize: 26 }}>
            <span>{race?.venue || race?.city || ''}</span>
          </div>
          {photo ? (
            <img src={photo} width={210} height={210} alt="" style={{ position: 'absolute', right: 92, top: 150, borderRadius: 999, objectFit: 'cover', border: '6px solid #0a0a0a' }} />
          ) : null}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 20 }}>
          {logo ? <img src={logo} width={300} height={56} alt="" /> : <span style={{ color: '#fff', fontSize: 32, fontWeight: 900 }}>MARKD by tempo</span>}
        </div>
      </div>
    ),
    size
  );
}
