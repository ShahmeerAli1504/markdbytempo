import Image from 'next/image';

export default function Gallery({ photos = [], title = 'Training', name }) {
  if (!photos.length) return null;
  return (
    <section aria-label={title}>
      <h2 style={{ fontSize: '2.2rem' }}>{title}</h2>
      <div className="gallery">
        {photos.map((p, i) => (
          <figure key={p.src}>
            <Image
              src={p.src}
              alt={p.alt || (name ? `${name} training photo ${i + 1}` : `Photo ${i + 1}`)}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 33vw"
            />
            {p.caption && <figcaption>{p.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}
