import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';
import { brandDataUrl } from '@/lib/og';

export const alt = `${site.name} — Sponsor an athlete. Get your brand to race day.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  const logo = await brandDataUrl('markd-logo-black.png');
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#ecfae9', color: '#0a0a0a', padding: 64, fontFamily: 'sans-serif' }}>
        {logo ? <img src={logo} width={520} height={96} alt="" /> : <div style={{ fontSize: 64, fontWeight: 900 }}>MARKD</div>}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 108, fontWeight: 900, lineHeight: 0.95, letterSpacing: -2, textTransform: 'uppercase', transform: 'skewX(-8deg)' }}>Your logo.</div>
          <div style={{ fontSize: 108, fontWeight: 900, lineHeight: 0.95, letterSpacing: -2, textTransform: 'uppercase', transform: 'skewX(-8deg)', display: 'flex' }}>
            <span style={{ background: '#0a0a0a', color: '#a6f598', padding: '4px 18px' }}>Their finish line.</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#3d4a3a' }}>
          <span>{site.tagline}</span>
          <span>Sponsor an athlete →</span>
        </div>
      </div>
    ),
    size
  );
}
