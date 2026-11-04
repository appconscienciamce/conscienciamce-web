# Pendientes para producción — Bootcamp Creadores Conscientes

Lista mínima de decisiones y materiales que faltan para publicar la landing.
Todo lo de esta lista se edita en `src/content/bootcamp.ts`: no hace falta tocar el diseño.

Mientras `offer.status` sea `"draft"`, la página muestra un aviso de borrador y marca en rojo
cada dato pendiente. Además, no se indexa en buscadores. Al pasar a `"approved"`, todo dato
no aprobado se oculta o se reemplaza por un texto seguro.

---

## 1. Decisiones de oferta

| # | Qué decidir | Estado actual en la landing | Dónde se cambia |
|---|---|---|---|
| 1 | **Precio final** (trabajado: USD 36,90) | Se muestra marcado «Pendiente» | `offer.price` → `approved: true` |
| 2 | **Fechas del evento** (la fuente sugiere después de la serie que termina ~10/11; no hay fecha confirmada) | «Se anuncian próximamente» / «A confirmar» | `offer.logistics` |
| 3 | **Horario y zona horaria** | «A confirmar» | `offer.logistics` |
| 4 | **Plataforma del vivo y si hay grabación** | «A confirmar». También falta en el FAQ | `offer.logistics` y `faq` |
| 5 | **Nombre final** del evento («Bootcamp — Creadores Conscientes» es nombre de trabajo; en la fuente también aparece «Referente») | «Creadores Conscientes» | `hero.wordmark`, `seo`, `investment.ticket.name` |
| 6 | **Voz del texto**: la promesa está en singular («voy a ayudarte») pero son dos facilitadores | Se dejó como en la fuente | `hero.promise` |
| 7 | **Política de reembolso** y términos | Texto «pendientes de publicación» en el footer | `footer.legal` |

## 2. Cifras que necesitan evidencia y aprobación

Cada una está en `claims` con su texto alternativo. Para publicarla, agregá su id a `offer.approvedClaims`.

| Id | Afirmación | Qué hace falta |
|---|---|---|
| `pilarRevenue` | Más de USD 650.000 con Pilar | Cifra exacta, período, si son ventas brutas o netas, y **permiso escrito de Pilar** para usar su caso y su nombre |
| `santiagoMonthly` | ~17.000 seguidores y +USD 50.000/mes promedio en 2026 | Números actualizados con evidencia (la fuente también dice «70K en octubre»: definir cuál se usa) |
| `oneOnOneRange` | 1 a 1 entre USD 5.000 y USD 30.000 | Confirmar el rango vigente |
| `millionsInSales` | «Marcas que generan millones de dólares» (hero) | Confirmar la cifra agregada que lo respalda |
| `salesTrackRecord` | «Millones de dólares en ventas» (bio) | Ídem |

## 3. Material visual

**Ya en la landing** (sacado de `conscienciamce-web`, nada descargado de Cáscara):
sello y wordmark de Consciencia MCE, fotos de Santiago y fotos con clientes.

- [ ] **Foto de Santiago en alta resolución para el hero.** La actual (`img13.webp`) mide 400×600 y se nota blanda en pantallas retina. Ideal: vertical 2:3, 1200×1800 o más.
- [ ] **Retrato de Oriana** (2:3): no hay ninguna foto identificada de Oriana en el material. Hoy se ve un marco «Imagen pendiente».
- [ ] **Material del caso Pilar**, con permiso: fotos o escenas verticales.
- [ ] **Confirmar el uso del logo:** ¿el bootcamp se presenta bajo Consciencia MCE? La fuente habla de cerrar el Club y abrir Conscious Capital. Si cambia la marca, se reemplaza en `brand`.
- [ ] **Bajadas de Santiago y Oriana** en `hosts.people[].label`: las escribí como descripción provisoria, no salen de la fuente.
- [ ] **Permisos de testimonios:** los 6 videos son unlisted y están en el sitio de MCE; las 6 fotos con clientes llevan el nombre de la persona (Daniel, Lucas, Aida, Cris, Yasmari, Dani Viola). Confirmar que aceptan aparecer en una página de venta paga. Los nombres salen del nombre de cada archivo: verificarlos.
- [ ] **Imagen para compartir (OG)**: 1200×630 → `seo.ogImage`.
- [ ] **Dominio final** → `seo.url`.

**Pinturas:** Rafael, Michelangelo y Tiepolo, dominio público vía Wikimedia Commons. La Creación de Adán está recortada a las manos a propósito: evita el desnudo completo en una página que recibe tráfico de Meta.

## 3 bis. Textos del concepto «La Restauración» (para aprobar)

La idea de la landing y estos textos no están en la fuente: los propuse yo. Están en `bootcamp.ts`.

- [ ] Hero: «Del ruido a la posición», «No copies la forma. Encontrá la fuente.» y los cuatro principios (`restoration-hero.tsx`).
- [ ] Prueba de autenticidad: dictámenes «Auténtico», «Todavía no», «Faltan datos» (`audience.test`).
- [ ] Nombres de pigmentos de la estratigrafía del caso Pilar (`stratigraphy.tsx`): son un recurso visual, no datos del caso.

## 4. Contenido abierto en la fuente

- [ ] **Día 2**: el documento dice que «todavía necesita terminar de definirse». En borrador se muestra una nota.
- [ ] Confirmar si **Pilar participa en vivo** y si hay **conversación con Ismael**. La fuente lo menciona como idea. Hoy no está en la landing.
- [ ] Confirmar si se nombra el **cierre del Club** o **Conscious Capital** en la landing (están en la narrativa del lanzamiento, no en el copy de las 7 secciones).
- [ ] Los archivos del paquete `02_Copy_y_Wireframe_Landing.md`, `03_Pagina_de_Gracias.md`, `04_Funnel_Integraciones_y_Checklist.md`, `README.md` y la carpeta `referencias_usuario/` **no estaban en disco**. El copy sale de las secciones 1–7 de `LANZAMIENTO 250k.md`. Si el 02 tiene cambios, hay que pasarlos a `bootcamp.ts`.

## 5. Para activar la venta (fuera de esta iteración)

- [ ] Checkout real (Stripe u otro) → `offer.checkoutUrl`. Todos los CTA pasan a apuntar ahí solo si además `offer.status` es `"approved"`.
- [ ] Página de gracias y upsell de la llamada 1:1 (USD 111): definidos en la fuente, no implementados.
- [ ] Emails de confirmación y recordatorio, comunidad de WhatsApp, pixel y analítica.
