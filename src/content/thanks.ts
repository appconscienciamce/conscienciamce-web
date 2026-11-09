/**
 * Copy and links of the thank-you page. Anything set to `null` is not available
 * yet: its control stays off and says so, so nobody is sent to a dead link and
 * no answer is lost. Open items: PENDIENTES_SANTIAGO.md.
 */
export const thanks = {
  seo: { title: "Gracias — Creadores Conscientes" },
  windowTitle: "Primeros pasos",

  hero: {
    eyebrow: "Bootcamp — Creadores Conscientes",
    title: "Ya estás adentro.",
    lead: "Gracias por sumarte. Hacé estos pasos antes de que empecemos, así llegás con todo listo.",
  },

  checklist: { title: "Antes de empezar", optional: "Opcional" },

  roadmap: {
    id: "roadmap",
    label: "Tu roadmap",
    title: "Completá tu roadmap",
    text: "Contanos dónde estás hoy para llegar a los dos días con un punto de partida claro.",
    /** Where answers go: the Consciencia MCE backend. Without one the form cannot be sent. */
    endpoint: "https://api.conscienciamce.com/api/bootcamp/roadmap" as string | null,
    fields: {
      name: "Nombre y apellido",
      email: "Email",
      project: "¿Qué estás construyendo hoy?",
      goal: "¿Qué querés resolver en estos dos días?",
    },
    submit: "Enviar mi roadmap",
    sending: "Enviando…",
    sent: "Listo, recibimos tu roadmap.",
    failed: "No pudimos enviarlo. Tus respuestas siguen acá: probá de nuevo en un momento.",
    unavailable: "El formulario todavía no está disponible. Volvé a esta página para completarlo.",
  },

  whatsapp: {
    id: "whatsapp",
    label: "Grupo de WhatsApp",
    title: "Entrá al grupo de WhatsApp",
    text: "Es por donde vamos a compartir las novedades del bootcamp.",
    url: "https://chat.whatsapp.com/FlDQEduq4BYJSULFhXNDTr" as string | null,
    cta: "Entrar al grupo",
    unavailable: "El link del grupo todavía no está disponible. Va a aparecer en esta misma página.",
  },

  videos: {
    id: "videos",
    label: "Videos para llegar listo",
    title: "Mirá estos videos antes de empezar",
    text: "Tres videos de Santiago para llegar al bootcamp con las ideas de base.",
    items: [
      { videoId: "3OrfRs_pk_Y", title: "Así genero $64.735/mes con marketing creativo" },
      { videoId: "8KtuBhCM42A", title: "Cómo gano $50.000 al mes utilizando tecnología espiritual" },
      { videoId: "gxEd5FQq7kk", title: "Reprogramá así tu identidad para generar $50-100K/mes" },
    ],
  },

  upsell: {
    id: "llamada",
    label: "Llamada 1 a 1",
    title: "Sumá una llamada 1 a 1",
    text: "Si querés bajar lo del bootcamp a tu negocio en una llamada 1 a 1, mirá este video.",
    videoTitle: "Llamada 1 a 1",
    /** YouTube id of the sales video. */
    videoId: null as string | null,
    videoPending: "Video próximamente",
    price: null as string | null,
    url: null as string | null,
    cta: "Quiero mi llamada",
    unavailable: "Las llamadas todavía no están abiertas. Se van a poder pedir desde esta misma página.",
  },
};

/** What a visitor sees on a thank-you page without a recorded purchase. */
export const thanksLocked = {
  missing: {
    eyebrow: "Bootcamp — Creadores Conscientes",
    title: "Esta página es para quienes ya compraron.",
    lead: "Si ya compraste, revisá tu mail: ahí tenés todos los pasos para empezar.",
    cta: "Ver el bootcamp",
    href: "/",
  },
  pending: {
    eyebrow: "Bootcamp — Creadores Conscientes",
    title: "Estamos confirmando tu pago.",
    lead: "Tarda unos segundos. No cierres esta página.",
    late: "Tu pago se está confirmando. En unos minutos te llega un mail con todos los pasos. Si no te llega, escribinos.",
    cta: "Escribir por WhatsApp",
    href: "https://wa.me/5492284733054?text=" + encodeURIComponent("Hola, compré el bootcamp Creadores Conscientes y todavía no me llegó el mail."),
  },
};

/** The roadmap on its own page, to share by WhatsApp with whoever did not complete it. */
export const roadmapPage = {
  seo: { title: "Tu roadmap — Creadores Conscientes" },
  eyebrow: "Bootcamp — Creadores Conscientes",
  title: "Completá tu roadmap.",
  lead: "Con tus respuestas creamos tu roadmap estratégico y el mapa de tu alma para que puedas diseñar tus próximos movimientos. Te lo entregamos después del bootcamp.",
};

/** The page the VIP payment link sends to: no upsell, the VIP already bought. */
export const thanksVip = {
  seo: { title: "VIP confirmado — Creadores Conscientes" },
  hero: {
    eyebrow: "Experiencia VIP — Creadores Conscientes",
    title: "Ya sos parte del VIP.",
    lead: "Tus 3 horas extra de consultoría en vivo quedaron confirmadas: es en grupo, solo con quienes accedieron al VIP, y vamos caso por caso. Te queda un solo paso.",
  },
  contact: {
    id: "whatsapp-santi",
    label: "WhatsApp de Santiago",
    title: "Escribile a Santiago por WhatsApp",
    text: "Mandale un mensaje para confirmar tu lugar en el VIP. Por ahí te pasamos la fecha y el acceso a la sesión en grupo.",
    url: "https://wa.me/5492284733054?text=Hola%20Santiago%2C%20me%20sum%C3%A9%20al%20VIP%20de%20Creadores%20Conscientes.",
    cta: "Hablar con Santiago",
  },
  confirmed: "Confirmado",
};

/** What the current thank-you page does differently from the one kept at `/evento/gracias`. */
export const thanksCurrent = {
  file: { name: "mi-roadmap.txt", open: "Abrir", close: "Cerrar", hint: "Dos partes · unos 5 minutos" },
  whatsappText: "Entrá primero a la comunidad: ahí compartimos el link de Zoom y toda la información del evento.",
  text: "Al completar esto, te creamos tu roadmap estratégico y el mapa de tu alma para que puedas diseñar tus próximos movimientos. Te lo entregamos después del bootcamp.",
  fields: {
    name: "Nombre y apellido",
    email: "Email",
    project: "¿Quién sos, qué hacés actualmente y qué estás construyendo?",
    projectHint: "Contanos brevemente qué vendés, a quién ayudás, cuál es tu rol y en qué etapa está hoy tu marca o negocio.",
    goal: "¿Cuál es hoy tu principal fuente de ingresos y en qué nivel de facturación mensual estás?",
    goalHint: "Podés responder con un rango si preferís.",
  },
  next: "Seguir",
  back: "Volver",
  partOne: "Parte 1 de 2",
  partTwo: "Parte 2 de 2",
  hook: "Ya está la base. Con estas respuestas creamos tu roadmap y el mapa de tu alma.",
  /**
   * They travel inside `goal`: the endpoint stores four fields of up to 5000 characters,
   * so the limits below keep the whole answer under that.
   */
  more: [
    { name: "birthDate", part: 1, type: "date", label: "Tu fecha de nacimiento", required: true, rows: 1, maxLength: 10 },
    { name: "birthTime", part: 1, type: "time", label: "Tu hora de nacimiento", hint: "La necesitamos para tu mapa. Si no la sabés exacta, poné la más cercana.", required: true, rows: 1, maxLength: 5 },
    { name: "birthPlace", part: 1, label: "Tu lugar de nacimiento", hint: "Ciudad y país.", required: true, rows: 1, maxLength: 120 },
    { name: "represent", part: 2, label: "¿Qué querés que tu nombre represente en los próximos años y qué sentís que hoy tu marca todavía no logra transmitir correctamente sobre vos?", rows: 3, maxLength: 500 },
    { name: "bottleneck", part: 2, label: "¿Cuál sentís que es hoy tu mayor cuello de botella para llegar a tu próximo nivel?", hint: "¿Qué es lo que más te está frenando, confundiendo o postergando?", rows: 3, maxLength: 500 },
    { name: "ninety", part: 2, label: "¿Qué querés haber transformado en tu marca o negocio durante los próximos 90 días?", hint: "¿Qué tendría que cambiar para que sintieras que realmente avanzaste?", rows: 3, maxLength: 500 },
    { name: "clarity", part: 2, label: "Si estos dos días fueran extremadamente valiosos para vos, ¿con qué claridad, decisión o respuesta te gustaría salir?", rows: 3, maxLength: 500 },
    { name: "why", part: 2, label: "¿Qué fue lo que hizo que decidieras comprar tu entrada?", hint: "¿Qué idea, problema, deseo o parte de nuestra comunicación hizo que pensaras: «quiero estar ahí»?", rows: 3, maxLength: 500 },
    { name: "question", part: 2, label: "¿Qué pregunta te gustaría que respondiéramos sí o sí durante estos dos días?", rows: 2, maxLength: 500 },
  ],
  videos: {
    label: "Video para llegar listo",
    title: "Mirá este video antes de empezar",
    text: "Para llegar al bootcamp con las ideas de base.",
    /** Santiago keeps only the marketing one. */
    count: 1,
  },
};

export type ThanksStep = "roadmap" | "whatsapp" | "videos" | "upsell";
