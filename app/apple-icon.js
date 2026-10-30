import { ImageResponse } from 'next/og';
import { brandDataUrl } from '@/lib/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
  const runner = await brandDataUrl('markd-runner-black.png');
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ecfae9' }}>
        {runner ? <img src={runner} width={150} height={76} alt="" /> : <div style={{ fontSize: 90, fontWeight: 900 }}>M</div>}
      </div>
    ),
    size
  );
}
