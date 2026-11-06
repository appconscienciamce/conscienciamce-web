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
    url: null as string | null,
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

/** What the page at `/evento/gracias` does differently. */
export const thanksEvento = {
  file: { name: "mi-roadmap.txt", open: "Abrir", close: "Cerrar", hint: "Dos partes, cuatro preguntas cada una" },
  next: "Seguir",
  back: "Volver",
  partOne: "Parte 1 de 2",
  partTwo: "Parte 2 de 2",
  hook: "Ya está la base. Con estas cuatro respuestas llegamos con tu caso mucho más claro.",
  /** Optional, and they travel inside `goal`: the endpoint stores four fields. */
  more: [
    { name: "strength", label: "¿Qué hacés mejor que la mayoría?", rows: 2, maxLength: 600 },
    { name: "revenue", label: "¿Cuánto genera tu negocio por mes hoy?", rows: 1, maxLength: 600 },
    { name: "tried", label: "¿Qué probaste que no te funcionó?", rows: 2, maxLength: 600 },
    { name: "future", label: "Si en 12 meses todo sale bien, ¿qué cambió?", rows: 2, maxLength: 600 },
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
