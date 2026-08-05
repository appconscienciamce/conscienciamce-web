'use client';

import { motion } from 'motion/react';

/**
 * "¿Quién es Santiago Gómez?"
 *
 * Built from Aceternity's features-section-demo-3, reduced to the two panels
 * that matter here and with their order swapped: the photo mosaic on the left,
 * the copy on the right. The demo's heading, globe and YouTube panels are not
 * used.
 *
 * The demo rotates each photo by Math.random() during render, which produces
 * different markup on the server and the client and breaks hydration. Fixed
 * angles are used instead.
 */

const TOP_ROW = [
  { src: '/wp-content/uploads/2026/03/img24.webp', rotate: -7 },
  { src: '/wp-content/uploads/2026/03/img7.webp', rotate: 5 },
  { src: '/wp-content/uploads/2026/03/img10.webp', rotate: -3 },
  { src: '/wp-content/uploads/2026/03/img2.webp', rotate: 8 },
];

const BOTTOM_ROW = [
  { src: '/wp-content/uploads/2026/03/img9.webp', rotate: 6 },
  { src: '/wp-content/uploads/2026/03/img8.webp', rotate: -8 },
  { src: '/wp-content/uploads/2026/03/img5.webp', rotate: 4 },
  { src: '/wp-content/uploads/2026/03/img6.webp', rotate: -6 },
];

/** Emphasis is marked with `**` and rendered as the page's `remarcado`. */
const PARAGRAPHS = [
  'Tengo la visión de cambiar el mundo creando una red de emprendedores y líderes conscientes.',
  'Durante los últimos 2 años me dediqué a crear proyectos educativos junto a grandes referentes, impactando en miles de alumnos y en millones de personas a través de su contenido.',
  'He ayudado a creadores a monetizar **meses de $100K, $150K y hasta $250K**, expandiendo marcas personales con propósito que hoy influyen en millones de vidas.',
  'En el proceso de trabajar con más de 30 creadores, entendí algo clave: **el negocio siempre es un reflejo de la identidad del CEO o founder.** Y ese es, casi siempre, el verdadero cuello de botella.',
  'Por eso hoy me dedico a ayudar a líderes y empresarios a **trascender sus bloqueos invisibles** y crear una nueva realidad donde sus vidas y sus negocios sean prósperos y sostenibles.',
];

function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <span className="remarcado" key={index}>
            {part.slice(2, -2)}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

const imageVariants = {
  whileHover: { scale: 1.1, rotate: 0, zIndex: 100 },
  whileTap: { scale: 1.1, rotate: 0, zIndex: 100 },
};

function PhotoRow({
  photos,
  offset,
}: {
  photos: typeof TOP_ROW;
  offset?: boolean;
}) {
  return (
    <div className={`flex flex-row ${offset ? '-ml-20' : ''}`}>
      {photos.map((photo, idx) => (
        <motion.div
          key={photo.src + idx}
          variants={imageVariants}
          style={{ rotate: photo.rotate }}
          whileHover="whileHover"
          whileTap="whileTap"
          className="mt-4 -mr-4 shrink-0 overflow-hidden rounded-xl border border-neutral-700 bg-neutral-800 p-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt=""
            width="500"
            height="500"
            loading="lazy"
            className="h-20 w-20 shrink-0 rounded-lg object-cover md:h-40 md:w-40"
          />
        </motion.div>
      ))}
    </div>
  );
}

export function About() {
  return (
    <div className="mce-about" data-element_type="container">
      <div className="mce-about-grid">
        {/* The two panels arrive from the side they sit on. */}
        <div className="mce-about-panel mce-about-panel--photos scroll-left">
          <div className="relative flex h-full flex-col items-start justify-center gap-8 overflow-hidden py-8">
            <PhotoRow photos={TOP_ROW} offset />
            <PhotoRow photos={BOTTOM_ROW} />

            <div className="pointer-events-none absolute inset-y-0 left-0 z-[100] h-full w-20 bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-[100] h-full w-20 bg-gradient-to-l from-black to-transparent" />
          </div>
        </div>

        <div className="mce-about-panel mce-about-panel--copy scroll-right">
          <h3 className="mce-section-title">
            <span className="titulo-premium">¿Quién es Santiago Gómez?</span>
          </h3>

          {PARAGRAPHS.map((paragraph) => (
            <p className="mce-about-text" key={paragraph}>
              <Emphasised text={paragraph} />
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
