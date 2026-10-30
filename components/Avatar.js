import { initials } from '@/lib/format';

export default function Avatar({ src, name, size = 48, className = '' }) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.38) };
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name ? `${name}` : ''} width={size} height={size} className={`avatar ${className}`} style={style} loading="lazy" />;
  }
  return (
    <span className={`avatar avatar-fallback ${className}`} style={style} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
