/**
 * Carga automática de los archivos reales que viven en `Cartas/` y `Fotos/`.
 *
 * Vite resuelve estos globs contra la raíz del proyecto, así que basta con
 * dejar un archivo nuevo en la carpeta para que aparezca en la web: no hay
 * ninguna lista que mantener a mano.
 */

// Nota: Vite exige que el patrón sea un literal, no una variable.
const cartaFiles = import.meta.glob("/Cartas/**/*.{png,jpg,jpeg,webp,gif,svg,mp4,webm,mov}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>

const fotoFiles = import.meta.glob("/Fotos/**/*.{png,jpg,jpeg,webp,gif,svg,mp4,webm,mov}", {
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

/** Ordena "2.png" antes que "10.png" (el orden alfabético no lo haría). */
function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, "es", { numeric: true, sensitivity: "base" })
}

/**
 * URL de un archivo suelto dentro de `Cartas/`.
 * Devuelve "" si el archivo todavía no existe, para que la interfaz pueda
 * mostrar su marcador de posición en lugar de romperse.
 */
export function carta(fileName: string): string {
  return cartaFiles[`/Cartas/${fileName}`] ?? ""
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
  const prefix = `/Cartas/${folderName}/`
  return Object.keys(cartaFiles)
    .filter(path => path.startsWith(prefix))
    .sort(naturalCompare)
    .map(path => cartaFiles[path])
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

function toMediaItems(files: Record<string, string>): MediaItem[] {
  return Object.keys(files)
    .sort(naturalCompare)
    .map(path => {
      const fileName = path.slice(path.lastIndexOf("/") + 1)
      return {
        id: path,
        src: files[path],
        kind: kindOf(path),
        name: fileName.replace(/\.[^.]+$/, ""),
        date: dateFromFileName(fileName),
      }
    })
}

/** Todas las fotos y videos de `Fotos/`, en orden estable. */
export const fotos: MediaItem[] = toMediaItems(fotoFiles)

/** Baraja Fisher-Yates. Devuelve una copia; no toca el arreglo original. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
