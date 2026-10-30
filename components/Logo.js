// MARKD by tempo wordmark. `tone="light"` (white) for dark backgrounds, `tone="dark"` (black) for light ones.
export default function Logo({ tone = 'light', height, priority = false }) {
  const src = tone === 'light' ? '/brand/markd-logo-white.png' : '/brand/markd-logo-black.png';
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="MARKD by tempo"
      width={1206}
      height={223}
      className="logo-img"
      style={height ? { height } : undefined}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
}
