import type { BootcampContent } from "./types";

/**
 * Single source of truth for the landing copy and editorial controls.
 *
 * Copy source: "LANZAMIENTO 250k.md" (sections 1–7 + draft notes) and the working
 * draft shared for V4. Lists such as outcomes, fit/not-fit and FAQ answers are
 * condensed from those documents, not invented. Photos and testimonial videos come
 * from the Consciencia MCE site. Paintings are public domain (Wikimedia Commons).
 * Open items: PENDIENTES_SANTIAGO.md.
 */
export const bootcamp: BootcampContent = {
  offer: {
    status: "approved",
    approvedClaims: ["salesTrackRecord", "millionsInSales", "pilarRevenue", "revenueFloor", "santiagoMonthly"],
    price: { currency: "USD", amount: 36.9, label: "USD 36,9", approved: true },
    logistics: [
      { label: "Formato", value: "2 días en vivo", approved: true },
      { label: "Fechas", value: "17 y 18 de noviembre", approved: true },
      { label: "Horario", value: "Te lo enviamos por mail", approved: true },
      { label: "Plataforma", value: "Zoom", approved: true },
      { label: "Grabación", value: "Queda grabado", approved: true },
    ],
    checkoutUrl: "https://buy.stripe.com/4gMbJ24iOgfQ5AH6htgA901",
    eventDates: { start: "2026-11-17", end: "2026-11-18" },
  },

  seo: {
    title: "Creadores Conscientes — Bootcamp de marketing creativo y auténtico",
    description:
      "Dos días en vivo con Santiago Gómez y Oriana Safenreider para convertir tu conocimiento, experiencia y resultados en una posición que el mercado entienda, valore y quiera comprar.",
    siteName: "Creadores Conscientes",
    url: "https://bootcamp.conscienciamce.com",
    ogImage: null,
    locale: "es_AR",
  },

  claims: {
    salesTrackRecord: {
      text: "millones de dólares en ventas",
      fallback: "negocios que venden",
      needs: "Confirmar la cifra agregada de ventas de los proyectos acompañados.",
    },
    millionsInSales: {
      text: "marcas que generan millones de dólares con consciencia",
      fallback: "marcas que crecen con consciencia",
      needs: "Confirmar qué marcas y qué cifra agregada respaldan «millones de dólares».",
    },
    pilarRevenue: {
      text: "USD 650.000",
      fallback: "Un ecosistema real",
      needs: "Cifra, período, qué incluye (ventas brutas / netas) y permiso escrito de Pilar.",
    },
    oneOnOneRange: {
      text: "Las personas invierten entre USD 5.000 y USD 30.000 para trabajar 1 a 1 conmigo.",
      fallback: "Es el mismo criterio con el que trabajamos en nuestros acompañamientos 1 a 1.",
      needs: "Confirmar rango vigente de los programas 1 a 1.",
    },
    revenueFloor: {
      text: "Idealmente, ya generás al menos USD 2.000–3.000 al mes.",
      fallback: "Necesitás un negocio activo y experiencia real.",
      needs: "Sale del borrador de comunicación: confirmar si el piso de facturación va en la página.",
    },
    santiagoMonthly: {
      text: "Con una audiencia de alrededor de 17.000 seguidores, la marca de Santiago generó un promedio mensual superior a USD 50.000 durante lo que va de 2026.",
      fallback: "Con una audiencia pequeña, la marca de Santiago sostiene un negocio sin depender de una comunidad masiva.",
      needs: "Seguidores actuales y promedio mensual 2026 con evidencia (la fuente también menciona 70K en octubre).",
    },
  },

  chapters: [
    { id: "inicio", number: "00", label: "Inicio" },
    { id: "para-quien", number: "01", label: "Para quién" },
    { id: "manifiesto", number: "02", label: "Manifiesto" },
    { id: "caso-pilar", number: "03", label: "Caso Pilar" },
    { id: "dos-dias", number: "04", label: "Dos días" },
    { id: "que-te-llevas", number: "05", label: "Qué te llevás" },
    { id: "quienes", number: "06", label: "Santiago y Oriana" },
    { id: "inscripcion", number: "07", label: "Inscripción" },
  ],

  brand: {
    name: "Consciencia MCE",
    mark: { src: "/media/brand/atlas-mark.webp", alt: "Consciencia MCE", width: 96, height: 94 },
    wordmark: { src: "/media/brand/logo.webp", alt: "Consciencia MCE", width: 398, height: 55 },
  },

  cta: {
    label: "Quiero participar",
    shortLabel: "Inscribirme",
    pendingNoticeTitle: "Inscripciones próximamente",
    pendingNoticeBody:
      "Todavía no abrimos las inscripciones. Fechas, horario y acceso se anuncian en este mismo lugar.",
  },

  hero: {
    eyebrow: "Bootcamp — Creadores Conscientes",
    kicker: "Bootcamp · Entrenamiento en vivo",
    dateLine: "17 y 18 de noviembre · 15:00 ARG · Online",
    programName: "Creadores Conscientes",
    title: { before: "Marketing creativo ", italic: "y", after: " auténtico" },
    promise:
      "Durante 2 días voy a ayudarte a convertir tu conocimiento, experiencia y resultados en una posición que el mercado entienda, valore y quiera comprar.",
    promiseHighlight: "entienda, valore y quiera comprar.",
    format: "2 días en vivo",
    hosts: "Con Santiago Gómez y Oriana Safenreider",
    audience: "Para creadores, estrategas y emprendedores con experiencia y un negocio activo.",
    notBeginners: "No es para principiantes.",
    secondaryCta: "Abrir el mapa",
  },

  os: {
    nav: [
      { label: "Inicio", href: "#inicio" },
      { label: "Mapa", href: "#mapa", chapters: true },
      {
        label: "Experiencia",
        href: "#dos-dias",
        items: [
          { label: "Día 1", href: "#dos-dias" },
          { label: "Día 2", href: "#dia-2" },
          { label: "Caso Pilar", href: "#caso-pilar" },
          { label: "Testimonios", href: "#testimonios" },
          { label: "Preguntas", href: "#preguntas" },
        ],
      },
      { label: "Inscripción", href: "#inscripcion" },
    ],
    navLabel: "Principal",
    sound: {
      label: "Música",
      track: "Interstellar",
      play: "Reproducir",
      pause: "Pausar",
      playing: "Reproduciendo",
      paused: "En pausa",
      volume: "Volumen",
    },
    liveBadge: "2 días en vivo",
    countdown: {
      dates: "17 y 18 nov",
      left: "Faltan",
      leftOne: "Falta",
      unit: "días",
      unitOne: "día",
      today: "Hoy en vivo",
      day: "Día",
    },
    windowTitle: "Mapa de creación / Creadores Conscientes",
    openMap: "Abrir el mapa",
    resume: "Continuar en el capítulo",
    close: "Cerrar el mapa y volver al escritorio",
    minimize: "Minimizar el mapa",
    maximize: "Ampliar la ventana",
    restore: "Restaurar la ventana",
    guided: "Recorrido",
    explore: "Explorar",
    backToTour: "Volver al recorrido",
    continueFrom: "Continuar desde el capítulo",
    exploreHint: "Arrastrá el fondo para moverte. Ctrl + rueda para acercarte.",
    chapter: "Capítulo",
    prev: "Parada anterior",
    next: "Seguir leyendo",
    index: "Índice de ideas",
    hideIndex: "Ocultar el índice",
    minimap: "Mapa",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    zoomReset: "Volver al 100%",
    fit: "Ajustar",
    closeMap: "Volver a la lectura",
    back: "Volver",
    readHere: "Leer",
    readHereLabel: "Leer este capítulo",
    mapHint: "Deslizá hacia arriba para avanzar. Tocá dos veces o pellizcá para acercarte.",
    chaptersLabel: "Capítulos",
    phone: {
      heroWindow: "lideres-y-creadores.txt",
      next: "Seguir con",
      apps: {
        para: "Para quién",
        manifesto: "Manifiesto",
        pilar: "Caso Pilar",
        file: "Expediente",
        days: "Dos días",
        outcomes: "Qué te llevás",
        hosts: "Nosotros",
        testimonials: "Testimonios",
        enroll: "Inscripción",
      },
    },
    mapCard: {
      title: "Explorá el mapa",
      text: "Recorré el bootcamp como un tablero.",
      cta: "Abrir el mapa",
      full: "Ver el mapa completo",
    },
    skip: "Saltar al contenido",
    closeWindow: "Cerrar ventana",
  },

  board: {
    path: ["identidad", "criterio", "posicionamiento", "caso real", "aplicación", "experiencia", "compra"],
  },

  desktop: {
    pilarFolder: "Archivo / Pilar",
    daysFolder: "Dos días",
    enrollFolder: "Inscripción",
    boardPhoto: {
      title: "pizarra_01.jpg",
      image: {
        src: "/media/santiago/img13.webp",
        alt: "Santiago Gómez de pie frente a una pizarra, explicando con una tablet en la mano",
        width: 400,
        height: 600,
      },
    },
    video: { title: "ismael_y_pilar.mov", label: "Ismael y Pilar", status: "Video próximamente" },
    note: { title: "criterio.txt", lines: ["Criterio, visión", "y perspectiva."], sign: "Antes de la estrategia, la dirección." },
    secondPhoto: {
      title: "santiago_02.jpg",
      image: {
        src: "/media/santiago/img8.webp",
        alt: "Santiago Gómez de pie frente a una pirámide de Egipto",
        width: 400,
        height: 600,
      },
    },
    stamp: "Marketing creativo y auténtico · ",
    logo: { src: "/media/brand/atlas-sticker.webp", alt: "Consciencia MCE", width: 560, height: 549 },
    scrollHint: "Scrolleá para entrar al mapa",
  },

  outcomes: {
    title: "Lo que te llevás",
    intro: "Dos días en vivo para salir con claridad.",
    items: [
      { numeral: "I", text: "Qué tenés para aportar y cuál es tu diferencial, sin inventarte un personaje." },
      {
        numeral: "II",
        text: "Cómo construir una posición que el mercado entienda, valore y quiera comprar, para dejar de perseguir atención.",
      },
      { numeral: "III", text: "Criterio propio para decidir qué estrategias tienen sentido para tu negocio y cuáles no." },
      {
        numeral: "IV",
        text: "Cómo se conectan posicionamiento, mensaje, contenido, oferta y monetización, en un caso real abierto de punta a punta.",
      },
      { numeral: "V", text: "Qué decir, qué crear, qué vender y qué construir a continuación." },
    ],
    photo: {
      src: "/media/santiago/img20.webp",
      alt: "Sesión de trabajo por videollamada de Santiago Gómez con un grupo",
      width: 400,
      height: 600,
    },
  },

  audience: {
    crumpleLabel: "Nota de papel",
    title: "No funciona para todos lo mismo.",
    question:
      "¿Esto tiene sentido para mí, para mi marca, para mi mercado y para la vida que quiero construir?",
    intro:
      "Creamos este bootcamp para personas que ya tienen experiencia, resultados y un negocio activo, pero sienten que lo que están construyendo todavía no representa todo lo que tienen para aportar.",
    fitTitle: "Es para vos si",
    fit: [
      "Sos una persona creativa, sensible y multipasional, y sentís que reducirte a una sola cosa ya no representa todo lo que sos capaz de construir.",
      "Escalás marcas o sos creador, experto, estratega o fundador con experiencia y resultados de verdad.",
      "Querés convertirte en referente en tu industria y que tu nombre tenga peso, no solo alcance.",
      "Querés construir algo serio y real a largo plazo, crecer económicamente sin perder el alma, el cuerpo, la familia o tu propósito.",
    ],
    notFitTitle: "No es para vos si",
    notFit: [
      "Sos principiante o querés empezar algo desde cero.",
      "Buscás una fórmula exacta, un funnel secreto o una estrategia para copiar, y que alguien te diga exactamente qué hacer sin desarrollar criterio y pensamiento original.",
      "Todavía no entendiste que tu negocio, tu marca y tus resultados son una extensión de quién sos.",
      "Tu única prioridad es crecer, facturar o conseguir atención, sin importar qué terminás construyendo ni en quién te convertís durante el proceso.",
    ],
    floor: "revenueFloor",
    conflict: ["Experiencia real", "Fórmulas ajenas", "Criterio propio"],
    conflictNote: "Probaste lo que otros dijeron que funcionaba. ¿Y tu criterio?",
  },

  manifesto: {
    title: "Marketing creativo y auténtico",
    thesis: { before: "Hoy es más fácil ", highlight: "parecer", after: " una autoridad que serlo." },
    counter: "Pero nunca vas a ocupar una posición que no te permitas ocupar internamente.",
    strikes: [
      "Enicharte porque sí",
      "Copiar estructuras",
      "Perseguir tendencias",
      "Construir personajes",
      "Crear contenido sin criterio",
      "Confundir atención con autoridad",
      "Confundir facturación con posicionamiento",
      "Confundir marketing con identidad",
    ],
    sortLabel: "Ordenar las ideas",
    unsortLabel: "Volver al ruido",
    sortedTitle: "Lo que dejamos sobre la mesa",
    opening: "Después de trabajar con decenas de marcas, me cansé de ver…",
    tiredOf: [
      "Personas con muchísimo valor sintiéndose «confusas» solo porque no entran en un nicho fácil de explicar.",
      "Expertos reales comunicándose igual que personas que no construyeron nada todavía. Copiando funnels, hooks y formatos que nunca nacieron de ellos.",
      "Gente persiguiendo atención cuando lo que realmente le falta es posición. Marcas llenas de contenido, pero vacías de una idea propia.",
      "Negocios creciendo mientras la persona detrás se desconecta cada vez más de quién es.",
    ],
    paragraph:
      "Por eso trabajamos desde la identidad, la experiencia y la visión de cada persona. Desde lo que la mueve a crear y lo que tiene para aportar, construimos su posicionamiento, su mensaje y el negocio alrededor.",
    closing:
      "Durante estos dos días vamos a revisar muchas de las reglas que aprendiste para recuperar criterio propio, dejar de reaccionar al mercado y empezar a construir desde tu capacidad de crear.",
  },

  casePilar: {
    title: "Vamos a abrir el caso de Pilar",
    kicker: "Caso real · Proceso completo",
    figure: "pilarRevenue",
    figureCaption: "Ecosistema construido junto a Pilar",
    lead: {
      withClaim: "Cómo construimos junto a Pilar un ecosistema que generó más de USD 650.000.",
      fallback: "Cómo construimos junto a Pilar un ecosistema de marca, contenido, producto y monetización.",
    },
    intro:
      "Vamos a mostrarte el proceso detrás de ese resultado: qué vimos en su experiencia, cómo trabajamos su posicionamiento y su mensaje, y cómo conectamos el contenido, YouTube, la oferta, el producto y la monetización.",
    layers: ["Experiencia", "Posicionamiento", "Mensaje", "Contenido", "YouTube", "Oferta", "Producto", "Monetización"],
    review: ["Qué funcionó", "Qué no", "Qué decisiones fuimos tomando"],
    closing:
      "Vas a conocer cómo pensamos una marca real desde adentro y qué principios podés llevarte a tu propio negocio.",
    image: {
      src: "/media/pilar/pilar.webp",
      alt: "Retrato de Pilar",
      width: 447,
      height: 447,
    },
    folderLabel: "Archivo / Pilar",
    folderName: "Pilar",
    folderResultLabel: "Resultado",
    folderScopeLabel: "Proceso",
    folderScope: "8 capas",
    stamp: "Caso real · Proceso completo · ",
    folderCta: "Abrir expediente",
    fileTitle: "Expediente",
    reviewTitle: "Lo que vamos a revisar",
  },

  twoDays: {
    title: "Dos días",
    intro:
      "Durante los próximos dos días quiero que temporalmente suspendas todo lo que creés saber sobre marketing.",
    image: {
      src: "/media/santiago/img4.webp",
      alt: "Santiago Gómez hablando con micrófono frente a un grupo, en un evento en vivo",
      width: 400,
      height: 600,
    },
    imageLabel: { title: "Santiago Gómez", meta: "En vivo" },
    days: [
      {
        number: "Día 1",
        title: "Desarmar el juego",
        summary:
          "Recuperar criterio, dejar de reaccionar al mercado y reconocer desde dónde querés construir.",
        items: [
          [
            { strong: "Vaciarse." },
            " Desarmar las ideas que instaló la industria: enicharte porque sí, construir personajes, perseguir tendencias y copiar estructuras.",
          ],
          ["Por qué algunas marcas generan atención pero no autoridad, y otras venden con audiencias pequeñas."],
          ["La relación entre la posición que te permitís ocupar internamente y la que construís en el mercado."],
          [{ strong: "Volver a la fuente." }, " Qué te mueve, qué querés transformar y qué no podés evitar crear."],
          ["Qué parte de tu experiencia puede convertirse en la base de algo propio."],
        ],
      },
      {
        number: "Día 2",
        title: "Posicionamiento, comunicación y negocio",
        summary:
          "Darle forma a esa dirección: tu diferencial, tu posición y cómo se expresa en tu mensaje, tu contenido y tu oferta.",
        items: [
          ["Cómo reconocer tu diferencial y construir una posición que el mercado comprenda."],
          ["Cómo expresarla en tu mensaje, tu contenido y tu oferta."],
          [
            { strong: "Caso Pilar: posicionamiento y mensaje." },
            " Qué reconocimos en ella y qué elegimos poner en el centro de su comunicación.",
          ],
          [
            { strong: "Caso Pilar: oferta, producto y monetización." },
            " Cómo convertimos ese conocimiento en una propuesta que las personas pudieran comprar.",
          ],
          ["Qué funcionó, qué no y qué principios podés llevarte a tu propio negocio."],
        ],
      },
    ],
    decisionsTitle: "Para salir sabiendo",
    decisions: ["Qué decir", "Cómo posicionarte", "Qué crear", "Qué vender", "Qué construir a continuación"],
  },

  proof: {
    title: "Quienes ya trabajaron con Santiago",
    intro: "Testimonios de personas que trabajaron con Santiago en Consciencia MCE.",
    videos: [
      { name: "Lucas", videoId: "4KqPW5kEa-s" },
      { name: "Gonzalo", videoId: "ElEjtQWUoM4" },
      { name: "Nicolás", videoId: "DFetk1jh2Ac" },
      { name: "Denise", videoId: "Z9HtD4_jbUc" },
      { name: "Laureano", videoId: "8u1wb35RSbA" },
      { name: "Daniel", videoId: "2XxkjfUsiwE" },
    ],
    galleryTitle: "Trabajo cercano, 1 a 1",
    gallery: [
      { image: { src: "/media/clients/santiago-daniel.webp", alt: "Santiago Gómez junto a Daniel", width: 350, height: 600 }, caption: "Con Daniel" },
      { image: { src: "/media/clients/santiago-lucas.webp", alt: "Santiago Gómez junto a Lucas", width: 350, height: 600 }, caption: "Con Lucas" },
      { image: { src: "/media/clients/santi-aida.webp", alt: "Videollamada de trabajo de Santiago Gómez con Aida", width: 1000, height: 1333 }, caption: "Con Aida" },
      { image: { src: "/media/clients/santiago-cris.webp", alt: "Santiago Gómez junto a Cris", width: 350, height: 600 }, caption: "Con Cris" },
      { image: { src: "/media/clients/santiago-yasmari.webp", alt: "Santiago Gómez junto a Yasmari", width: 350, height: 600 }, caption: "Con Yasmari" },
      { image: { src: "/media/clients/santi-daniviola.webp", alt: "Santiago Gómez junto a Dani Viola", width: 1000, height: 1778 }, caption: "Con Dani Viola" },
    ],
  },

  hosts: {
    title: "Somos Santiago Gómez y Oriana Safenreider",
    trackRecord: {
      before:
        "Durante años estuvimos detrás de marcas, creadores y negocios digitales, ayudando a transformar conocimiento en marcas, audiencias y ",
      claim: "salesTrackRecord",
      after: ".",
    },
    paragraphs: [
      "Trabajamos cerca de las personas, comprendiendo su visión y participando en las decisiones que dan vida a sus proyectos.",
      "Nuestra forma de construir integra consciencia, identidad y negocio. Nos importa qué quiere expresar esa persona, el impacto que quiere generar y la vida que está construyendo mientras desarrolla su empresa.",
    ],
    ownBrandLead: "También lo aplicamos a nuestra propia marca.",
    ownBrandClaim: "santiagoMonthly",
    ownBrandAfter:
      "En este bootcamp vamos a compartir tanto esa experiencia como lo que aprendimos construyendo detrás de otras marcas.",
    people: [
      {
        name: "Santiago Gómez",
        label: "Estrategia, posicionamiento y negocio",
        image: {
          src: "/media/santiago/img16.webp",
          alt: "Santiago Gómez sentado en un set de grabación",
          width: 400,
          height: 600,
        },
      },
      {
        name: "Oriana Safenreider",
        label: "Construcción detrás de marcas",
        image: {
          src: "/media/hosts/santiago-oriana.webp",
          alt: "Santiago Gómez y Oriana Safenreider en un ascensor, con una bebé en brazos",
          width: 400,
          height: 600,
        },
      },
    ],
    authority: {
      title: "Lo que logramos",
      items: [
        { value: "USD 2,6M", text: "de cash collected generados con creadores espirituales y vendiendo algo intangible" },
        {
          value: "4 negocios",
          text: "de infoproductos escalados a +100K/mes, con poco equipo y alto margen",
          faces: [
            { name: "Daniel", image: { src: "/media/clients/face-daniel.webp", alt: "Daniel", width: 168, height: 168 } },
            { name: "Luzland", image: { src: "/media/clients/face-luzland.webp", alt: "Luzland", width: 168, height: 168 } },
            { name: "Aida", image: { src: "/media/clients/face-aida.webp", alt: "Aida", width: 168, height: 168 } },
            { name: "Pilar", image: { src: "/media/pilar/pilar.webp", alt: "Pilar", width: 447, height: 447 } },
          ],
        },
        { value: "+30", text: "emprendedores arriba de 10K/mes" },
        { value: "Millones", text: "de personas impactadas con contenido" },
        { value: "Miles", text: "de alumnos en movimientos educativos" },
        { value: "+USD 500K", text: "de profit en 2026, 100% para nosotros, con menos de 20K followers" },
      ],
    },
    album: [
      { src: "/media/hosts/noche.webp", alt: "Santiago y Oriana de noche, con una bebé en brazos", width: 400, height: 600 },
      { src: "/media/hosts/lago.webp", alt: "Santiago con una bebé en brazos, frente a un lago", width: 540, height: 720 },
      { src: "/media/hosts/bosque.webp", alt: "Santiago junto a una camioneta, en el bosque", width: 400, height: 600 },
    ],
  },

  investment: {
    title: "Dos días para acceder a nuestro criterio, visión y perspectiva",
    paragraphs: [
      "Durante estos dos días vamos a compartir el criterio con el que trabajamos en nuestros procesos 1 a 1, abriendo un caso real y las decisiones que hubo detrás de su construcción.",
    ],
    selectionTitle: "También queremos conocer qué estás construyendo.",
    selection: [
      "Elegimos pocos proyectos para involucrarnos de forma cercana, poniendo nuestra visión, tiempo y recursos en trabajar junto a la persona. Entre quienes participen puede haber proyectos con los que tenga sentido seguir construyendo después del bootcamp.",
    ],
    ticket: {
      name: "Creadores Conscientes",
      detail: "Bootcamp · 2 días en vivo con Santiago Gómez y Oriana Safenreider.",
      priceLabel: "Inversión única",
      pricePending: "Inversión por confirmar",
      stub: "Entrada",
    },
    format: "2 días en vivo",
  },

  faq: {
    title: "Preguntas",
    items: [
      {
        q: "¿Para quién es?",
        a: "Para personas con recorrido real y algo construido: expertos, creadores y quienes trabajan detrás de marcas en estrategia, contenido, oferta o lanzamientos. No es para alguien que quiere empezar una marca personal.",
      },
      {
        q: "¿Por qué tiene un costo?",
        a: "Porque buscamos personas que decidan involucrarse. El precio funciona como filtro de intención y compromiso: esta experiencia no está pensada para todo el mundo.",
      },
      {
        q: "¿Es en vivo? ¿Queda grabado?",
        a: "Son 2 días en vivo por Zoom con Santiago y Oriana, y queda grabado.",
      },
      {
        q: "¿Qué pasa después del bootcamp?",
        a: "Elegimos pocos proyectos para involucrarnos de forma cercana. Entre quienes participen puede haber proyectos con los que tenga sentido seguir construyendo.",
      },
    ],
  },

  editorial: {
    navResults: "Resultados",
    pilarName: "Pilar Sousa",
    pilarRole: "Creadora y experta en metafísica.",
    pilarLead: "Trabajando 1 a 1, pasó de 5K a generar",
    pilarPeriod: "en los últimos 7 meses",
    pilarPromise: "Voy a mostrarte cómo reprogramamos su identidad y construimos todo su ecosistema de negocio.",
    pilarFile: {
      intro:
        "Vamos a revelarte cómo vivimos todo el proceso entero, no para que copies y pegues, sino para que aprendas a pensar.",
      layers: ["Su expertise", "Mensaje y narrativa", "Posicionamiento", "Contenido", "Lanzamiento", "Oferta", "Producto, entrega y servicio", "Monetización"],
      share: "Voy a compartirte todo lo que funcionó, lo que no, qué decisiones tomamos y cómo pensamos cada paso en el proceso.",
    },
    home: { hint: "Deslizá para ver más", pilar: "+650K", lock: "Archivo con candado", hostsIcon: "/media/hosts/nosotros-icono.webp" },
    authority: {
      title: "Somos Santiago y Oriana",
      intro: [
        "Más adelante te contamos quiénes somos. Pero esto es lo que logramos después de más de 3 años detrás de las marcas personales más grandes:",
      ],
      photos: [
        { name: "santiago.jpg", image: { src: "/media/santiago/santiago.webp", alt: "Santiago Gómez sentado frente a una computadora, con las manos juntas, pensando", width: 1120, height: 1400 } },
        { name: "oriana.jpg", image: { src: "/media/hosts/oriana.webp", alt: "Oriana Safenreider de pie junto a una pizarra, en un taller", width: 560, height: 700 } },
      ],
    },
    audience: {
      headline: { before: "No funciona para ", italic: "todos", after: " lo mismo." },
    },
    manifesto: {
      /** Provisional, from Santiago's audio: his exact copy replaces it. */
      newWorld: { lead: "El mercado está cambiando muy rápido.", text: "Ya no alcanza con tener views, seguidores o la mejor estrategia." },
      /** Santiago's copy for the opening of the manifesto, in the order it is read. */
      market: {
        lead: "El mercado está cambiando muy rápido.",
        beats: ["La gente siente más.", "Percibe más.", "Cuestiona más."],
        text: "Ya no alcanza con tener views, seguidores o la mejor estrategia.",
        contrasts: [
          ["Cada vez se vuelve más evidente quién habla desde la experiencia…", "y quién desde la teoría."],
          ["Quién construye solamente para alimentar su ego…", "y quién está construyendo algo que lo trasciende."],
        ],
        thesisPre: "El problema es que",
        thesis: { before: "Hoy es más fácil ", highlight: "parecer", after: " una autoridad que serlo." },
        counter: "Porque una cosa es llamar la atención. Otra muy distinta es que te respeten por construir algo verdadero y único.",
        promise: "Por eso te vamos a compartir una nueva forma de crear riqueza, impacto y marca personal.",
        lines: ["Una donde no tenés que vender tu alma por los números.", "Una donde no adaptás quién sos a lo que funciona."],
        close: ["Porque cuando hay suficiente claridad, identidad y coherencia…", "vos te convertís en la estrategia."],
      },
      thesis: {
        name: "parecer.jpg",
        image: { src: "/media/items/1.webp", alt: "Collage de una cabeza de mármol partida, con nubes dentro", width: 410, height: 643 },
      },
      /** Beside the marble head, so the masculine and the feminine sit together. */
      balance: {
        name: "equilibrio.jpg",
        image: { src: "/media/items/equilibrio.webp", alt: "Pintura de una columna de mármol rodeada de ángeles y figuras femeninas", width: 756, height: 1344 },
      },
    },
    days: {
      title: { before: "Dos", italic: "días" },
      question: "¿Qué vas a aprender en estos dos días?",
      intro:
        "Durante este entrenamiento vas a vaciarte de todo el ruido, el caos y la confusión que hay entre tantas cosas que se dicen en nombre del marketing, para recuperar tu criterio, tu autenticidad y crear algo imposible de copiar.",
      zones: [
        { flag: "ar", time: "15:00", place: "Argentina" },
        { flag: "co", time: "13:00", place: "Colombia" },
        { flag: "es", time: "19:00", place: "España" },
      ],
      more: "Qué vemos este día",
      dates: [
        {
          day: "17",
          month: "/11",
          label: "Martes 17 de noviembre",
          focus: "Trabajo interno",
          photo: { name: "dia-1.jpg", image: { src: "/media/santiago/dia-1.webp", alt: "Santiago Gómez con los brazos abiertos, en medio de una ronda de personas de pie", width: 1500, height: 1161 } },
        },
        {
          day: "18",
          month: "/11",
          label: "Miércoles 18 de noviembre",
          focus: "Trabajo externo",
          reveal: { before: "Te voy a revelar todo lo que aprendí después de invertir más de", figure: "USD 100.000", after: "en mentorías e infoproductos." },
          photo: { name: "dia-2.jpg", image: { src: "/media/santiago/img4.webp", alt: "Santiago Gómez hablando con micrófono frente a un grupo, en un evento en vivo", width: 400, height: 600 } },
        },
      ],
    },
    kit: {
      cards: [
        { tag: "Zoom · 17 y 18 de noviembre", title: "2 días en directo", text: "Trabajo interno el primer día y un trabajo en lo externo el segundo." },
        {
          tag: "Personalizado",
          title: "Roadmap + mapa de tu alma",
          text: "Al acceder, respondés unas preguntas para que, al terminar la experiencia, te entreguemos un PDF personalizado con tu diseño único de jugador, para ganar claridad estratégica sobre tu juego.",
        },
        { tag: "Caso real", title: "El expediente de Pilar", text: "El proceso completo, de punta a punta: qué funcionó, qué no y qué decisiones se tomaron." },
        { tag: "Zoom", title: "La grabación", text: "Los dos días quedan grabados." },
      ],
    },
    /** Which of the outcomes the phone shows, to keep the page short. */
    gainsShown: [0, 1, 4],
    gains: [
      { src: "/media/items/1.webp", alt: "", width: 410, height: 643 },
      { src: "/media/items/2.webp", alt: "", width: 403, height: 643 },
      { src: "/media/items/3.webp", alt: "", width: 394, height: 643 },
      { src: "/media/items/4.webp", alt: "", width: 404, height: 643 },
      { src: "/media/items/5.webp", alt: "", width: 396, height: 643 },
    ],
    hosts: {
      philosophy: [
        "Creemos en una nueva manera de vivir y de hacer negocios en la que no tengamos que sacrificar las relaciones, la salud, la paz y el propósito.",
        "Nuestro éxito es integral y refleja la coherencia y la excelencia que hace más de 3 años encarnamos en nuestro proceso interno.",
        "Todo lo que hacemos está ligado a una visión: vivir en un mundo que unifique el espíritu y la materia.",
        "Por eso usamos los negocios como un vehículo para evolucionar nuestra consciencia.",
      ],
      lead: { name: "santiago-y-oriana.jpg", image: { src: "/media/hosts/santiago-y-oriana.webp", alt: "Santiago Gómez y Oriana Safenreider en una sala de madera, delante de una pizarra", width: 1500, height: 1602 } },
    },
    vip: {
      kicker: "Experiencia VIP",
      title: "El Bootcamp te muestra cómo pensamos. En el VIP llevamos esa forma de pensar a tu caso particular.",
      paragraphs: [
        "Vas a tener 3 horas de consultoría en vivo con nosotros para traer tus preguntas, decisiones, bloqueos y próximos movimientos. Vamos a trabajar sobre casos reales de las personas que estén dentro.",
        "Si querés acceder más de cerca a nuestro criterio, experiencia y frecuencia, podés sumarte al VIP y vivir una experiencia mucho más profunda y aplicada del evento.",
      ],
      label: "Experiencia VIP",
      stepTitle: "Sumate al VIP",
      stepText: "Opcional: 3 horas de consultoría en vivo con nosotros, aparte de tu entrada.",
      rows: [
        { label: "Formato", value: "3 horas en vivo" },
        { label: "Con", value: "Santiago y Oriana" },
      ],
      admit: "Acceso VIP",
      priceLabel: "Extra, aparte de tu entrada",
      price: "USD 111",
      cta: "Quiero el VIP",
      url: "https://buy.stripe.com/5kQbJ27v0gfQ5AHfS3gA902",
    },
    enroll: {
      seats: "300",
      seatsText: "lugares disponibles",
      rows: [
        { label: "Fechas", value: "17 y 18 de noviembre" },
        { label: "Horario", value: "15:00 ARG · 13:00 COL · 19:00 ESP" },
        { label: "Lugares", value: "300" },
        { label: "Plataforma", value: "Zoom" },
      ],
      /** The FAQ here leaves out the question about choosing projects. */
      faqItems: 3,
      moreFaq: [
        { q: "¿Cuántos lugares hay?", a: "300 lugares." },
        { q: "¿En qué horario es?", a: "Los dos días a las 15:00 de Argentina, 13:00 de Colombia y 19:00 de España." },
      ],
    },
  },

  footer: {
    line: "Creadores Conscientes · Marketing creativo y auténtico",
    copyright: "Consciencia MCE. Todos los derechos reservados.",
  },
};
