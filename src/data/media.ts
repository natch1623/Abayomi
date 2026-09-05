/**
 * Carga automática de los archivos reales que viven en `Cartas/` y `Fotos/`.
 *
 * Vite resuelve estos globs contra la raíz del proyecto, así que basta con
 * dejar un archivo nuevo en la carpeta para que aparezca en la web: no hay
 * ninguna lista que mantener a mano.
 */

/**
 * Aquí NO se piden las imágenes originales.
 *
 * `import.meta.glob` importa todo lo que encaja con el patrón, así que pedir
 * los PNG de Cartas/ metía sus cientos de megas en la compilación aunque en
 * pantalla solo se usaran las versiones ligeras. Las imágenes salen de web/
 * (ver más abajo) y los originales quedan como material de partida para
 * `scripts/optimizar-imagenes.mjs`.
 *
 * Sí se piden los formatos que no tienen versión ligera: el video, el SVG y
 * los videos de la galería.
 *
 * Nota: Vite exige que el patrón sea un literal, no una variable.
 */
const cartaFiles = import.meta.glob("/Cartas/**/*.{svg,mp4,webm,mov}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

const fotoFiles = import.meta.glob("/Fotos/**/*.{mp4,webm,mov}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

// Algunas cartas son una página HTML entera y autocontenida. Se cargan como
// texto (`?raw`) porque Vite trataría un .html suelto como punto de entrada.
const cartaHtmlFiles = import.meta.glob("/Cartas/*.html", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

// Imágenes sueltas de assets/ que se usan dentro de alguna página.
const assetFiles = import.meta.glob("/assets/*.{png,jpg,jpeg,webp,gif,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

// Música de fondo, una pista por área.
const songFiles = import.meta.glob("/song/*.mp3", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

/** Ordena "2.png" antes que "10.png" (el orden alfabético no lo haría). */
function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, "es", { numeric: true, sensitivity: "base" })
}

/**
 * Versiones ligeras generadas por `scripts/optimizar-imagenes.mjs`. Espejan la
 * estructura de Cartas/ y Fotos/ dentro de web/, en formato .webp.
 */
const webFiles = import.meta.glob("/web/**/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

/**
 * Índice único de medios, para que la web funcione tanto con los originales
 * como sin ellos.
 *
 * La clave es la ruta sin extensión ("/Cartas/Nicole"), así que original y
 * versión ligera caen en la misma entrada. Si existen las dos gana la ligera;
 * si solo hay una, se usa esa. Por eso una copia del repositorio, que solo
 * lleva web/, sigue mostrando las cartas.
 */
interface Medio {
  /** Lo que se sirve al navegador. */
  url: string
  /** Nombre del archivo del que salió, para deducir tipo y fecha. */
  fileName: string
}

function sinExtension(ruta: string): string {
  return ruta.replace(/\.[^./]+$/, "")
}

function nombreDe(ruta: string): string {
  return ruta.slice(ruta.lastIndexOf("/") + 1)
}

const medios = new Map<string, Medio>()

// Primero los originales…
for (const [ruta, url] of Object.entries({ ...cartaFiles, ...fotoFiles })) {
  medios.set(sinExtension(ruta), { url, fileName: nombreDe(ruta) })
}
// …y encima las ligeras, que tienen preferencia. Si el original no está,
// la ligera crea la entrada ella sola.
for (const [ruta, url] of Object.entries(webFiles)) {
  const clave = sinExtension(ruta.replace(/^\/web/, ""))
  const previo = medios.get(clave)
  medios.set(clave, { url, fileName: previo?.fileName ?? nombreDe(ruta) })
}

/** Claves del índice bajo un prefijo, en orden natural. */
function clavesBajo(prefijo: string): string[] {
  return [...medios.keys()].filter(k => k.startsWith(prefijo)).sort(naturalCompare)
}

export type MediaKind = "image" | "video"

export interface MediaItem {
  id: string
  src: string
  kind: MediaKind
  /** Nombre del archivo, sin extensión */
  name: string
  /** Fecha legible deducida del nombre del archivo, si la tiene */
  date?: string
}

export function kindOf(path: string): MediaKind {
  return /\.(mp4|webm|mov)$/i.test(path) ? "video" : "image"
}

/**
 * URL de un archivo suelto dentro de `Cartas/`.
 * Devuelve "" si el archivo todavía no existe, para que la interfaz pueda
 * mostrar su marcador de posición en lugar de romperse.
 */
export function carta(fileName: string): string {
  return medios.get(sinExtension(`/Cartas/${fileName}`))?.url ?? ""
}

/** URL de una pista de `song/`. "" si no existe. */
export function cancion(fileName: string): string {
  return songFiles[`/song/${fileName}`] ?? ""
}

/** URL de un archivo de `assets/`. "" si no existe. */
export function asset(fileName: string): string {
  return assetFiles[`/assets/${fileName}`] ?? ""
}


/** Código de una carta que es una página HTML completa. "" si no existe. */
export function cartaHtml(fileName: string): string {
  return cartaHtmlFiles[`/Cartas/${fileName}`] ?? ""
}

/** Todas las páginas de una carta que ocupa una subcarpeta, en orden numérico. */
export function cartaPages(folderName: string): string[] {
  return clavesBajo(`/Cartas/${folderName}/`).map(k => medios.get(k)!.url)
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

/**
 * Muchas fotos vienen de la cámara o de WhatsApp con la fecha en el nombre
 * (20250917_124411.jpg, IMG-20250214-WA0077.jpg). La aprovechamos.
 */
function dateFromFileName(fileName: string): string | undefined {
  const match = fileName.match(/(?:^|[^0-9])(20\d{2})(\d{2})(\d{2})(?:[^0-9]|$)/)
  if (!match) return undefined

  const [, year, rawMonth, rawDay] = match
  const month = Number(rawMonth)
  const day = Number(rawDay)
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined

  return `${day} de ${MESES[month - 1]}, ${year}`
}

/** Todas las fotos y videos de `Fotos/`, en orden estable. */
export const fotos: MediaItem[] = clavesBajo("/Fotos/").map(clave => {
  const medio = medios.get(clave)!
  return {
    id: clave,
    src: medio.url,
    kind: kindOf(medio.fileName),
    name: sinExtension(medio.fileName),
    date: dateFromFileName(medio.fileName),
  }
})

/** Baraja Fisher-Yates. Devuelve una copia; no toca el arreglo original. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
