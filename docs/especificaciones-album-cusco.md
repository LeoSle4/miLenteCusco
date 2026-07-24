# 📋 Especificaciones — "Álbum de Viaje: Cusco"

**Tipo de proyecto:** Web app responsive, mobile-first
**Objetivo:** Que una amiga suba fotos durante su viaje a Cusco, cumpla retos fotográficos por día, y al final se genere automáticamente un álbum del viaje.
**Destino final:** Este documento se usará como prompt/contexto para desarrollar con Claude Code.

---

## 1. Visión general

Una web sencilla, íntima y bonita (no una "app de turistas" genérica) donde una sola persona (la amiga) sube fotos día por día durante su viaje a Cusco. Cada día tiene "retos" fotográficos sugeridos (ej. "foto a un puesto de comida típica", "un plato de comida", "un rincón con vista a las montañas"). Al terminar el viaje (o al finalizar cada día), la web genera automáticamente un álbum/galería visual con todas las fotos organizadas por día.

No requiere que la amiga "diseñe" nada: ella solo abre el link desde su celular, ve el reto del día, y sube la foto. Toda la magia visual (diseño, orden, álbum final) la hace la web.

---

## 2. Usuarios y accesos

- **Un solo usuario "subidor"**: la amiga, durante el viaje.
- **Un usuario "espectador"**: tú (y posiblemente otras personas), viendo el álbum en tiempo real o al final.
- **Acceso definido:** link privado + **PIN de 4 dígitos** (sin cuentas, sin contraseñas complejas). El PIN se guarda una vez en el navegador del celular (localStorage/IndexedDB) para no pedirlo cada vez que abra la web durante el viaje.

---

## 3. Funcionalidades principales

### 3.1 Subida de fotos
- Subida desde celular (cámara o galería), con **preview antes de confirmar**.
- Compresión de imagen en el navegador antes de subir (para no gastar datos móviles ni espacio de almacenamiento gratuito).
- Cada foto se asocia a: **día del viaje**, **lugar/reto** (si aplica), fecha/hora automática, y un campo de **nota corta + "mood"**.
  - **Mood definido:** en vez de emojis clásicos de teclado (😀😍), se usará un set pequeño de **iconos/stickers ilustrados a medida** (5-6 estados: ej. "encantada", "con sueño", "sorprendida", "acogedor/cosy", "con hambre", "enamorada del paisaje") dibujados en el mismo estilo kawaii/rosa de la web, no emojis de mensajería. Puedo diseñarlos como SVG originales a juego con la mascota del sitio.
- **Prioridad alta (definida):** tolerancia a mala señal — si falla la subida (o no hay internet), la foto se **guarda en cola local automáticamente** y se reintenta sola cuando vuelva la conexión, sin que la amiga tenga que hacer nada manual. Esto es crítico porque varias zonas de Cusco tienen señal irregular.

### 3.2 Retos por día (con tono no-obligatorio)
- Cada día del itinerario tiene una lista corta de **sugerencias** fotográficas (máx. 3) + **1 espacio libre** ("una foto que te haga feliz hoy, sin reto"). Ver el detalle completo en la sección 8.
- Se presentan como invitaciones cálidas, no como checklist: nada de contadores tipo "3 de 5 completados" ni indicadores de "pendiente".
- Subir una foto asociada a una sugerencia es completamente opcional — no bloquea nada ni se marca como "incompleto" si no se hace.
- El espacio libre diario es el corazón del concepto (inspirado en la idea de una cámara para capturar momentos felices, sin reglas): siempre visible, sin lugar ni tema asignado.

### 3.3 Galería / línea de tiempo en vivo
- Mientras el viaje ocurre, se puede ver una **galería cronológica** organizada por día.
- Sin contadores ni indicadores de "completado" — coherente con el tono no-obligatorio de la sección 3.2.

### 3.4 Álbum final generado automáticamente
- Al finalizar (manual: botón "cerrar viaje", o automático: última fecha del itinerario), se genera una **vista de álbum final**: portada, fotos agrupadas por día con sus notas, mini "resumen del viaje".
- **Formato definido:** el álbum vive como **página web compartible** (un link bonito, tipo scroll con secciones por día, animaciones suaves al hacer scroll) — es la forma más rica visualmente y no depende de generar un archivo pesado.
  - Como **plus de fase posterior** (no bloqueante para el desarrollo inicial): botón "Descargar como PDF/imagen" usando `html2canvas`/`jsPDF`, útil para guardarlo o imprimirlo, pero la experiencia principal es la web.
- **Música definida:** widget embebido de Spotify con la playlist que armará Brandon, con un botón de play visible en el álbum (no autoplay forzado — los navegadores lo bloquean igual, así que siempre requiere un clic).
- **Estructura visual:** portada (espacio de mascota + nombre del viaje + duración) → una sección por día en scroll continuo, con cada foto en formato **scrapbook**: la foto centrada con un leve giro, un pequeño espacio reservado de la mascota asomándose desde una esquina (como si la mirara), y la nota que ella escribió a mano al lado, en el margen, en la fuente manuscrita → widget de Spotify al final. Todo en una sola página, sin pestañas — pensado para recorrerse de principio a fin como quien hojea un álbum físico.

---

## 4. Diseño / dirección de arte

**Paleta:** pensada para combinar directo con una mascota en tonos **rosa, blanco y gris cálido**, con una capa extra de calidez tipo "tarde de manta":

| Uso | Color |
|---|---|
| Rosa principal | `#F3AFC7` — acentos, botones, título del día |
| Rosa suave (fondo de tarjetas) | `#FDF1F5` |
| Crema tostado (fondo general) | `#FFF3E4` *(reemplaza al blanco puro para dar más calidez)* |
| Terracota (acento cosy) | `#D98B6B` — etiquetas, detalles, chips |
| Gris cálido (texto secundario, detalles) | `#A79CA0` |
| Rosa oscuro (texto de énfasis) | `#8A4A61` |

**Detalles cosy adicionales (versión elegante):**
- Miniaturas de fotos con **marco tipo Polaroid fino** (borde delgado, 0.5px, casi sin rotación — solo un leve giro de 1° en alguna foto, no en todas) para que se sienta cuidado, no infantil.
- **Líneas divisoras finas** (un hairline con degradado sutil hacia los extremos) entre secciones, en vez de puntos gruesos tipo costura.
- **Tipografía en 3 niveles:** títulos de día en una serif elegante ("Cormorant Garamond", Google Fonts) en vez de la fuente redondeada; cuerpo de texto en una sans limpia (Nunito); y las notas/citas de cada foto en manuscrita suave ("Caveat") para el toque personal — así conviven la calidez y la elegancia sin verse infantil.
- Etiquetas y tags con **borde fino en vez de relleno sólido de color** (texto en cursiva/itálica para las notas del espacio libre), manteniendo el color como acento y no como bloque.

**Estilo:** kawaii, suave, "acogedor", tipografía redondeada, mucho espacio en blanco, microanimaciones sutiles (una hoja o pétalo cayendo, transiciones suaves tipo "flotar").

**Mascota:** el diseño deja un **espacio reservado** para una mascota que tú vas a colocar después (imagen propia). Para que encaje bien en los componentes, se recomienda:
- Formato **PNG con fondo transparente** (o SVG si la tienes vectorizada).
- Tamaño base recomendado: **≈400×400 px**, cuadrada, con la figura centrada y algo de margen alrededor (para que no se vea recortada al escalar en distintos tamaños de pantalla).
- Se reservan **3 usos principales** en la interfaz: pantalla de bienvenida/PIN (tamaño grande), estado "aún no hay fotos hoy" (tamaño mediano), y portada del álbum final (tamaño grande). Si más adelante tienes distintas poses (saludando, durmiendo, con cámara), cada una puede ir en el slot que más le quede.
- El componente de la web simplemente reserva el espacio y hace `<img src="mascota.png" />` (o el archivo que tú pongas) — no depende de ningún desarrollo adicional de nuestro lado.

**Iconografía:** para toda la UI funcional (no la mascota) se usan íconos de línea de **Tabler Icons** (gratis, consistentes, minimalistas) — cámara, montaña, nube, huella, destello para el "espacio libre", etc.


> - El resto de la web (paleta, tipografía, iconos) sí puede tomar la esencia rosa/cosy libremente, ya que eso no es un personaje protegido.

**Librerías/bancos de iconos "kawaii" con licencia libre/comercial para revisar:**
- [Flaticon – Kawaii](https://www.flaticon.com/free-icons/kawaii) — enorme variedad, revisa licencia por autor.
- [IconScout – Kawaii](https://iconscout.com/icon-packs/kawaii) — packs SVG/PNG, uso comercial.
- [Freepik – Kawaii icons](https://www.freepik.com/icons/kawaii) — icono + ilustraciones, atribución según plan.
- [Figma Community – "Cute Basic Icons Kawaii Style"](https://www.figma.com/community/file/1546942186490871515/cute-48-basic-icons-kawaii-style-free) — gratis, útil si diseñan mockups en Figma primero.
- **Lucide / Phosphor Icons** (línea, minimalista) para los iconos funcionales (subir, día, check, compartir) combinados con acentos kawaii solo en ilustraciones grandes — mantiene la UI limpia y rápida de cargar sin saturar de "cute" cada botón.

---

## 4.1 Estructura de navegación

1. **Ingreso** — link privado + PIN de 4 dígitos (se guarda en el navegador tras el primer ingreso).
2. **Bienvenida** — espacio de mascota + mensaje corto de intro al viaje.
3. **Día actual** — pantalla principal durante el viaje: sugerencias suaves del día + espacio libre + botón de subir foto.
4. **Galería** — todas las fotos organizadas por día, con chips de filtro por día.
5. **Álbum final** — reemplaza la navegación anterior al cerrar el viaje: portada, secciones por día, widget de Spotify.

Navegación simple de 2 pestañas ("Hoy" / "Galería") en una barra inferior fija durante el viaje — mobile-first, una sola columna, botones grandes para el pulgar. En pantallas más grandes, el mismo contenido se centra con más espacio en blanco, sin reflow adicional.

## 5. Stack tecnológico recomendado

| Capa | Recomendación | Por qué |
|---|---|---|
| Frontend | **React + Vite + TailwindCSS** | Rápido de desarrollar con Claude Code, responsive fácil con Tailwind, ligero. |
| Backend / datos | **Supabase** (Postgres + Storage, plan gratuito) | Free tier generoso, base de datos + almacenamiento de imágenes + API lista sin escribir backend propio. Alternativa: Firebase (Firestore + Storage). |
| Hosting frontend | **Vercel** o **Netlify** (plan gratuito) | Deploy automático desde GitHub, dominio gratis tipo `album-cusco.vercel.app`, HTTPS incluido. |
| Compresión de imágenes | **browser-image-compression** (JS, cliente) | Reduce peso antes de subir — clave para no gastar datos móviles y no llenar el storage gratuito. |
| Cola offline | **IndexedDB** (o localForage) | Guarda fotos pendientes si no hay señal y reintenta subir automáticamente. |
| Generación de álbum final | Componente propio en React + **html2canvas / jsPDF** (opcional, para exportar) | Genera la vista álbum en la propia web; exportar a imagen/PDF es opcional. |

**¿Por qué esta combinación y no otra?**
- Todo tiene **capa gratuita suficiente** para un viaje de pocos días y pocas fotos (cientos, no miles).
- Supabase evita que tengas que programar y mantener un servidor propio (menos puntos de falla durante el viaje).
- Vite + Tailwind = desarrollo muy rápido con Claude Code, ideal para iterar el diseño ahora y dejar el itinerario para después.

---

## 6. Arquitectura (resumen)

```
[Celular de la amiga] 
      │  (PWA / web responsive)
      ▼
[Frontend React/Vite] ── compresión de imagen en cliente
      │
      ├── (con señal) ──► [Supabase Storage + DB] ──► genera álbum
      │
      └── (sin señal) ──► Cola local (IndexedDB) ──► reintenta al volver la señal
```

- **Sin backend propio que mantener** durante el viaje → menor riesgo de caídas.
- Al ser un **PWA (Progressive Web App)**, se puede "instalar" en la pantalla de inicio del celular como si fuera una app nativa, sin pasar por tiendas de apps.
- Diseño **mobile-first**: se construye primero para celular y se expande a escritorio (para que tú puedas ver el álbum cómodo desde la laptop).

---

## 7. Roadmap de desarrollo sugerido

1. **Fase 1 (ahora):** Diseño del sistema visual (colores, tipografía, mascota/ilustraciones, componentes: botón subir, tarjeta de reto, galería).
2. **Fase 2 (ahora):** Funcionalidad base: subida de fotos, cola offline, estructura de días/retos con datos de ejemplo (placeholders).
3. **Fase 3 (pendiente):** Agregar el itinerario real (lugares + retos por día) — *ver sección 8*.
4. **Fase 4:** Vista de álbum final + opción de compartir/exportar.
5. **Fase 5:** Deploy a Vercel/Netlify + pruebas desde celular real antes del viaje.

---

## 8. 🗓️ Itinerario y retos por día

**Concepto detrás de los retos:** la idea nació de un dorama que vieron juntos ("En tu mejor momento"), donde a la protagonista le regalan una cámara para capturar momentos que la hagan feliz — no es una lista de tareas que cumplir, es una invitación a mirar el viaje con esos ojos. Por eso los retos no se redactan como solicitudes ("toma una foto de..."), sino como pequeñas escenas o sensaciones que ella puede reconocer y guardar si quiere.

- **Máximo 3 retos guiados por día** (ligados a los lugares del itinerario, escritos en tono descriptivo/emotivo) + **1 espacio libre siempre abierto**, marcado con un ícono de destello (no corazón), para "algo que la haga feliz, sin reto, solo porque sí".
- En la interfaz, se evita cualquier palabra tipo "misión", "tarea" o "pendiente" — el lenguaje es cálido y en segunda persona, como si alguien le estuviera señalando algo bonito, no pidiéndole que lo haga.
- No hay contador de "completados/faltantes" ni presión visual de checklist — los retos del día simplemente aparecen como frases suaves, y se pueden subir 0, 1 o muchas fotos sin ninguna restricción.

---

### 📍 Día 1 — Llegada a Cusco: Plaza de Armas, Qorikancha, San Blas
*Día de aclimatación, ritmo tranquilo.*
- La Plaza de Armas justo cuando la luz cambia de una forma que te guste.
- Una piedra inca en Qorikancha que parezca guardar siglos enteros.
- Una calle de San Blas que se sienta como de otro tiempo.
- 💫 Libre: algo que te hizo sonreír sin razón, hoy.

### 📍 Día 2 — Valle Sagrado: Chinchero, Moray, Salineras de Maras, Urubamba, Ollantaytambo, Pisac
*Día largo, mucho paisaje — nada de esto es obligatorio, solo si se cruza en tu camino.*
- Moray desde arriba, como un secreto en espiral.
- El blanco y el rosa de las Salineras bajo el sol.
- Un puesto de Pisac con un olor que no vas a olvidar.
- 💫 Libre: un paisaje que te dejó sin palabras.

### 📍 Día 3 — Montaña: Laguna Humantay o Montaña de 7 Colores (Vinicunca) *(según cuál elijan)*
*Día físicamente más exigente — aquí los retos celebran el esfuerzo, no solo la foto perfecta.*
- La montaña o la laguna mostrando todos sus colores, solo para ti.
- Tus propios pasos en el camino — el esfuerzo que valió la pena.
- Ese momento en que por fin ves todo desde arriba.
- 💫 Libre: cómo te sientes al llegar a la cima, sin reglas.

### 📍 Día 4 — City Tour: Sacsayhuamán, Q'enqo, Puca Pucara, Tambomachay, Cristo Blanco
- Las piedras de Sacsayhuamán, tan grandes que dan un poco de risa nerviosa.
- Cusco entero a tus pies, desde el Cristo Blanco.
- Un rincón curioso de Q'enqo, Puca Pucara o Tambomachay.
- 💫 Libre: una foto tuya, tal cual, sin poses.

### 📍 Día 5 — Mercado San Pedro, Piedra de los 12 Ángulos, Acueducto de Sapantiana, compras, regreso
*Último día — cierre del viaje.*
- Los colores del Mercado San Pedro, un caos hermoso.
- La Piedra de los 12 Ángulos, de cerca, como merece.
- Algo pequeño que decidiste llevarte de recuerdo.
- 💫 Libre: la última mirada a Cusco, antes de irte.

---

**Sobre la cantidad de fotos:** con 3 retos guiados + 1 libre por día × 5 días, hay unas **20 sugerencias suaves** en total — pero la web no limita nada: ella puede subir todas las fotos que quiera además de esas, los retos son solo un empujoncito para no perderse esos momentos, no un límite ni una obligación.

---

## 9. ✅ Decisiones ya definidas

- **Álbum final:** página web compartible (PDF descargable como plus de fase posterior).
- **Acceso:** link privado + PIN de 4 dígitos.
- **Modo offline:** prioridad alta — cola automática que reintenta subir sola al volver la señal.
- **Notas de cada foto:** texto + mood, con iconos/stickers ilustrados a medida (estilo cosy, no emojis clásicos).
- **Música:** widget de Spotify embebido con playlist propia, botón de play (sin autoplay).
- **Duración estimada del viaje:** 5 a 7 días.
- **Contador "día X de Y":** no se implementará.
- **Comentarios/reacciones de otras personas:** no habrá — solo modo de visualización para quien vea el álbum (sin interacción de terceros).

**Único punto aún abierto:** cuántas fotos aproximadamente subirá por día (para dimensionar el almacenamiento gratuito) — se puede estimar sobre la marcha una vez empiece el viaje, no bloquea el desarrollo.

