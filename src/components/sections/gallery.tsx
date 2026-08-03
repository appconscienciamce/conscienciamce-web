/**
 * Rotating photo carousel beneath the hero.
 *
 * Rewritten from the ported Elementor markup: the container scaffolding is
 * gone, leaving the gb-scene / gb-a3d / gb-card structure the ported
 * stylesheet animates. The rotation is pure CSS, driven by two custom
 * properties: --n on the stage (how many cards) and --i per card (its place
 * in the ring). Both have to stay.
 */

const PHOTOS = [
  'santiago-daniel.webp',
  'img10.webp',
  'img5.webp',
  'img2.webp',
  'img8.webp',
  'img20.webp',
  'img21.webp',
  'img24.webp',
  'img4.webp',
  'img6.webp',
  'img13.webp',
  'img7.webp',
  'img22.webp',
  'img16.webp',
  'img-23.jpg',
  'img9.webp',
];

export function Gallery() {
  return (
    <section className="mce-gallery" aria-hidden="true">
      <div className="gb-scene">
        <div
          className="gb-a3d"
          style={{ ['--n' as string]: PHOTOS.length }}
        >
          {PHOTOS.map((photo, index) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={photo}
              className="gb-card"
              src={`/wp-content/uploads/2026/03/${photo}`}
              style={{ ['--i' as string]: index }}
              alt=""
              width="350"
              height="600"
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
