# Pendientes para producción — Bootcamp Creadores Conscientes

Lista mínima de decisiones y materiales que faltan para publicar la landing.
Casi todo se edita en `src/content/bootcamp.ts`, sin tocar el diseño.

**Importante:** desde esta versión la página no muestra marcas de «pendiente». Esta lista es el único lugar donde queda registrado qué falta aprobar. Mientras `offer.status` sea `"draft"`, la página no se indexa y muestra los datos tal cual. Al pasar a `"approved"`, toda cifra no aprobada se reemplaza por un texto seguro.

---

## 1. Decisiones de oferta

| # | Qué decidir | Estado actual | Dónde se cambia |
|---|---|---|---|
| 1 | **Precio final** (trabajado: USD 36,90) | Se muestra sin marca | `offer.price` → `approved: true` |
| 2 | **Fechas del evento** | «A confirmar» | `offer.logistics` |
| 3 | **Horario y zona horaria** | «A confirmar» | `offer.logistics` |
| 4 | **Plataforma del vivo y si hay grabación** | «A confirmar». El FAQ todavía no lo aclara | `offer.logistics` y `faq` |
| 5 | **Link de Stripe** | El botón del ticket no compra: muestra «Todavía no abrimos las inscripciones» | `offer.checkoutUrl` + `offer.status: "approved"` |
| 6 | **Nombre final** («Creadores Conscientes» es nombre de trabajo; también apareció «Referente») | «Creadores Conscientes» | `hero`, `seo`, `investment.ticket.name` |
| 7 | **Voz del texto**: la promesa dice «voy a ayudarte», pero son dos facilitadores | Como en la fuente | `hero.promise` |
| 8 | **Frase madre**: «Convertí lo que sabés…» o «Aprendé cómo se construyen…» | Sin usar todavía | `hero` |
| 9 | **Política de reembolso** y términos | Texto «pendientes de publicación» en el footer | `footer.legal` |

## 2. Cifras

Aprobadas el 4 de noviembre de 2026, junto con el precio de USD 36,90: `pilarRevenue`, `santiagoMonthly`, `salesTrackRecord`, `millionsInSales` y `revenueFloor`. Quedan en `offer.approvedClaims`.

`oneOnOneRange` (USD 5.000–30.000) sigue fuera de la página por pedido de Santiago.

- [ ] **Permiso escrito de Pilar** para usar su caso, su nombre y su foto en una página de venta.

## 3. Material visual

- [ ] **Retrato de Oriana** (3:4): no hay foto identificada en el material. Hoy se ve un marco con las iniciales «OS». Se carga en `hosts.people`.
- [ ] **Foto de Santiago con Oriana** para el escritorio: hoy `santiago_02.jpg` usa una foto de Santiago solo.
- [ ] **Video de Ismael y Pilar**: la ventana del escritorio dice «Video próximamente». Cuando exista, se reemplaza en `desktop.video`.
- [ ] **Material del caso Pilar**, con permiso: foto de equipo, clips y línea de tiempo. Hoy el expediente solo tiene su retrato (447×447, baja resolución).
- [ ] **Fotos de Santiago en alta**: las actuales miden 400×600.
- [ ] **Confirmar el uso del logo:** ¿el bootcamp se presenta bajo Consciencia MCE?
- [ ] **Bajadas de Santiago y Oriana** en `hosts.people[].label`: las escribí yo como descripción provisoria.
- [ ] **Permisos de testimonios:** los 6 videos y las 6 fotos con clientes. Confirmar que aceptan aparecer en una página de venta paga y que los nombres (tomados de los archivos) son correctos.
- [ ] **Imagen para compartir (OG)**: 1200×630 → `seo.ogImage`.
- [ ] **Dominio final** → `seo.url`.

## 4. Textos propuestos que no salen de la fuente (para aprobar)

- [ ] Nota del escritorio: «Antes de la estrategia, la dirección.» (`desktop.note.sign`).
- [ ] Nota del tablero: «Probaste lo que otros dijeron que funcionaba. ¿Y tu criterio?» (`audience.conflictNote`).
- [ ] «Lo que dejamos sobre la mesa» (`manifesto.sortedTitle`).

## Página de gracias (`/gracias`)

Todo se carga en `src/content/thanks.ts`. Mientras falte el dato, ese control queda apagado y lo dice: nadie llega a un link roto y no se pierde ninguna respuesta.

- [ ] **Destino del formulario del roadmap** → `roadmap.endpoint`. Sin esto no se puede enviar. Falta decidir adónde van las respuestas.
  El destino debe responder 2xx recién después de guardar y no redirigir: esa respuesta es lo que le dice a la persona que su roadmap llegó. Cada envío lleva un `submissionId`, que se repite en los reintentos y sirve para descartar duplicados.
- [ ] **Quién puede ver `/gracias`:** hoy la ve cualquiera que tenga la URL. Al conectar Stripe, verificar la sesión de pago antes de mostrarla.
- [ ] **Cifras en los títulos de los videos:** $64.735/mes, $50.000 al mes y $50-100K/mes salen de los títulos públicos de YouTube, no de las cifras aprobadas de la landing. Confirmar que estén bien en esta página.
- [ ] **Preguntas del roadmap**: las cuatro son propuesta mía. Confirmar cuáles van.
- [ ] **Link del grupo de WhatsApp** → `whatsapp.url`.
- [ ] **Video de venta de la llamada** → `upsell.videoId` (id de YouTube).
- [ ] **Precio de la llamada** → `upsell.price`. No se muestra: el valor de USD 111 no está confirmado.
- [ ] **Checkout de la llamada** → `upsell.url`.
- [ ] **Textos de la página**: son propuesta mía, salvo los títulos de los videos, que salen de YouTube.

## 5. Contenido abierto

- [ ] **Día 2**: el documento original dice que «todavía necesita terminar de definirse». La nota de borrador se quitó de la página, pero el contenido sigue sin cerrar.
- [ ] Confirmar si **Pilar participa en vivo** y si hay **conversación con Ismael**.
- [ ] Confirmar si se menciona la **asociación al 50%**, el **cierre del Club** o **Conscious Capital**. Hoy no están en la página.
- [ ] `LANZAMIENTO 250k.md` y el wireframe no estaban en disco. Si tienen cambios, hay que pasarlos a `bootcamp.ts`.

## 6. Para activar la venta (fuera de esta iteración)

- [ ] Checkout real en Stripe → `offer.checkoutUrl`.
- [ ] Términos, privacidad y política de reembolso: páginas publicadas y enlazadas antes de cobrar.
- [ ] Actualizar `next`: `npm audit` marca 2 vulnerabilidades (1 alta, 1 moderada) en esa dependencia.
- [ ] Definir la URL de `/gracias` como destino después del pago en Stripe.
- [ ] Emails de confirmación y recordatorio, comunidad de WhatsApp.
- [ ] Pixel y analítica. Los eventos ya existen (`hero_cta_click`, `board_open`, `chapter_view`, `pricing_cta_click`), falta conectarlos a un destino.
