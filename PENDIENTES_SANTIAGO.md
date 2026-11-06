# Pendientes para producción — Bootcamp Creadores Conscientes

Lista mínima de decisiones y materiales que faltan para publicar la landing.
Casi todo se edita en `src/content/bootcamp.ts`, sin tocar el diseño.

**Importante:** desde esta versión la página no muestra marcas de «pendiente». Esta lista es el único lugar donde queda registrado qué falta aprobar. `offer.status` está en `"approved"` desde el 6 de noviembre de 2026: la página se indexa, los botones van a Stripe, toda cifra no aprobada se reemplaza por un texto seguro y las filas sin dato no se muestran.

---

## 1. Decisiones de oferta

| # | Qué decidir | Estado actual | Dónde se cambia |
|---|---|---|---|
| 1 | **Precio final** | Aprobado: USD 36,90 | `offer.price` |
| 2 | **Fechas del evento** | Sin dato. La página dice «Te las enviamos por mail», y el mail de confirmación promete mandarlas antes de empezar | `offer.logistics` |
| 3 | **Horario y zona horaria** | Sin dato. La página dice «Te lo enviamos por mail» | `offer.logistics` |
| 4 | **Plataforma y grabación** | Resuelto: Zoom, queda grabado | `offer.logistics` y `faq` |
| 5 | **Link de Stripe** | Resuelto: los botones llevan al Payment Link | `offer.checkoutUrl` |
| 6 | **Nombre final** («Creadores Conscientes» es nombre de trabajo; también apareció «Referente») | «Creadores Conscientes» | `hero`, `seo`, `investment.ticket.name` |
| 7 | **Voz del texto**: la promesa dice «voy a ayudarte», pero son dos facilitadores | Como en la fuente | `hero.promise` |
| 8 | **Frase madre**: «Convertí lo que sabés…» o «Aprendé cómo se construyen…» | Sin usar todavía | `hero` |
| 9 | **Política de reembolso** y términos | Texto «pendientes de publicación» en el footer | `footer.legal` |
| 10 | **Cierre de la inscripción** (fecha y hora reales). La barra de arriba cuenta hacia esa fecha, en mobile y en PC. Para ver cómo queda antes de decidirla: `/?cierre=2026-11-20T23:59` (solo en borrador) | Sin fecha: la barra muestra el reloj, como siempre | `offer.registrationCloses`: `at: "2026-11-20T23:59:00-03:00"` y `approved: true` |
| 11 | **Cupo de 300 plazas.** La barra de arriba muestra «Quedan X plazas». **Hoy el número es simulado, no son inscripciones reales:** baja solo desde 300, irregular (unos 7–8 segundos por plaza en promedio, con tramos rápidos, lentos y alguna pausa; a veces dos de golpe o tres seguidas), hasta ~100 (entre 80 y 106); descansa un par de minutos y, cada ~31 minutos, vuelve a 300. Es el mismo número para todos y al recargar nunca sube (cada navegador recuerda el último número que mostró). El ritmo se ajusta en `src/lib/seats-drift.ts`. Sacando `drift` vuelve a ser el conteo real (`total` − `taken`) | Aprobado y visible en producción (simulado) | `offer.seats`: `drift: { low: 100 }`, `taken` y `approved: true` |

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

- [x] **Destino del formulario del roadmap**: `POST https://api.conscienciamce.com/api/bootcamp/roadmap`, en el backend de MCE 2.0. Guarda en `bootcamp_roadmaps` y avisa al equipo por mail. Necesita la migración `0090` aplicada.
  El destino responde 2xx recién después de guardar y no redirige: esa respuesta es lo que le dice a la persona que su roadmap llegó. Cada envío lleva un `submissionId`, que se repite en los reintentos y sirve para descartar duplicados.
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

- [x] Checkout real en Stripe → `offer.checkoutUrl`.
- [ ] Términos, privacidad y política de reembolso: quedaron afuera por decisión del 6 de noviembre de 2026. Stripe pide el link de privacidad para mandar sus recibos automáticos.
- [ ] Actualizar `next`: `npm audit` marca 2 vulnerabilidades (1 alta, 1 moderada) en esa dependencia.
- [ ] Confirmar que el Payment Link redirige a `/gracias` después del pago.
- [x] Email de confirmación: lo manda el backend de MCE 2.0 por Resend al recibir el webhook.
- [ ] Webhook de Stripe: crearlo apuntando a `https://api.conscienciamce.com/api/webhooks/stripe-bootcamp` con el evento `checkout.session.completed`, y cargar en Vercel `BOOTCAMP_STRIPE_WEBHOOK_SECRET` y `BOOTCAMP_PAYMENT_LINK_ID`.
- [ ] Email con fechas, horario y link de Zoom, y recordatorios: necesitan esos datos. Comunidad de WhatsApp.
- [ ] Pixel y analítica. Los eventos ya existen (`hero_cta_click`, `board_open`, `chapter_view`, `pricing_cta_click`), falta conectarlos a un destino.
