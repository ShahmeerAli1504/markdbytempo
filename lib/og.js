import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' };

// Loads a file from /public (e.g. '/athletes/tempo/avatar.jpg') as a data URL for next/og ImageResponse.
export async function publicDataUrl(publicPath) {
  if (!publicPath || /^https?:/.test(publicPath)) return publicPath || null;
  try {
    const buf = await readFile(join(process.cwd(), 'public', publicPath.replace(/^\//, '')));
    const ext = publicPath.split('.').pop().toLowerCase();
    return `data:${TYPES[ext] || 'image/png'};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

export function brandDataUrl(file) {
  return publicDataUrl(`/brand/${file}`);
}
