import { carta, cartaHtml, cartaPages, kindOf } from "./media"

export interface Letter {
  id: string
  title: string
  date?: string
  description?: string
  /** Páginas de la carta, en orden. Vacío = todavía no hay imagen. */
  pages: string[]
  /** Si la carta es un video en lugar de una imagen. */
  isVideo?: boolean
  /** Cartas que son una página HTML completa, incrustada tal cual. */
  html?: string
  envelopeColor: string
  flapColor: string
  accentColor: string
  glowColor: string
}

/** Paletas de sobre, para que cada carta se vea distinta pero de la misma familia. */
const PALETTES = [
  { envelopeColor: "#d4c4a8", flapColor: "#c4b498", accentColor: "#7a4f28", glowColor: "rgba(212,160,80,0.25)" },
  { envelopeColor: "#b8c8d8", flapColor: "#a8b8cc", accentColor: "#3a5a7a", glowColor: "rgba(80,140,200,0.25)" },
  { envelopeColor: "#c8d0b8", flapColor: "#b8c0a8", accentColor: "#3a5a30", glowColor: "rgba(80,140,80,0.25)" },
  { envelopeColor: "#e0c4c0", flapColor: "#d0b4b0", accentColor: "#7a3840", glowColor: "rgba(200,100,120,0.25)" },
  { envelopeColor: "#cec0d8", flapColor: "#beb0c8", accentColor: "#553a70", glowColor: "rgba(150,110,200,0.25)" },
  { envelopeColor: "#dccdb0", flapColor: "#ccbda0", accentColor: "#6a5220", glowColor: "rgba(210,175,90,0.25)" },
]

interface LetterSeed {
  id: string
  title: string
  date?: string
  description?: string
  /** Archivo o archivos dentro de `Cartas/`. */
  files?: string[]
  /** Carpeta dentro de `Cartas/` cuando la carta tiene muchas páginas. */
  folder?: string
  /** Archivo .html dentro de `Cartas/` cuando la carta es una página entera. */
  htmlFile?: string
}

function build(seeds: LetterSeed[], paletteOffset = 0): Letter[] {
  return seeds.map((seed, i) => {
    const pages = seed.folder
      ? cartaPages(seed.folder)
      : (seed.files ?? []).map(carta).filter(Boolean)

    return {
      id: seed.id,
      title: seed.title,
      date: seed.date,
      description: seed.description,
      pages,
      isVideo: pages.length > 0 && kindOf(pages[0]) === "video",
      html: seed.htmlFile ? cartaHtml(seed.htmlFile) || undefined : undefined,
      ...PALETTES[(i + paletteOffset) % PALETTES.length],
    }
  })
}

/**
 * Las cartas del cajón general (`/cartas`), en orden de historia.
 * Las tres que tienen su propia página no se repiten aquí.
 */
export const letters: Letter[] = build([
  {
    id: "carta-5-septiembre",
    title: "5 de septiembre",
    date: "5 de septiembre",
    description: "El día en que empezó todo",
    files: ["5 de septiembre.png"],
  },
  {
    id: "carta-primera-memoria",
    title: "Primera memoria",
    description: "Lo primero que guardé de ti",
    files: ["primera memoria.png"],
  },
  {
    id: "carta-me-gustas",
    title: "Me gustas",
    description: "Escrita en dos partes, porque no cabía en una",
    files: ["me gustas pt1.png", "me gustas pt2.png"],
  },
  {
    id: "carta-21-septiembre",
    title: "21 de septiembre",
    date: "21 de septiembre",
    files: ["21 de septiembre.png"],
  },
  {
    id: "carta-notita",
    title: "Notita",
    description: "Corta, pero de las que se releen",
    files: ["notita.png"],
  },
  {
    id: "carta-escrito-secreto",
    title: "Escrito secreto",
    description: "Algo que no había dicho en voz alta",
    files: ["escrito secreto.png"],
  },
  {
    id: "carta-la-suerte",
    title: "La suerte de que seas tú",
    files: ["la suerte de que seas tu.png"],
  },
  {
    id: "carta-silueta",
    title: "Tienes un brillo que va más allá de las estrellas",
    files: ["nicole iluminar de amarrillo su silueta.svg"],
  },
  {
    id: "carta-recuerdos-color",
    title: "Recuerdos llenos de color",
    files: ["Recuerdos llenos de color.png"],
  },
  {
    id: "carta-cumpleanos",
    title: "Cumpleaños de Nicole",
    description: "Para tu día",
    files: ["cumpleaños nicole.png"],
  },
  {
    id: "carta-san-valentin",
    title: "Feliz San Valentín",
    date: "14 de febrero",
    description: "Una página entera, hecha para ese día",
    htmlFile: "san_valentin_pacnito.html",
  },
  {
    id: "carta-buena-suerte",
    title: "Buena suerte",
    description: "Esta te la dije en video",
    files: ["buena suerte.mp4"],
  },
  {
    id: "carta-starry-skies",
    title: "The true starry skies",
    files: ["The true starry skies.png"],
  },
  {
    id: "carta-susurros",
    title: "Susurros entre las estrellas y la noche",
    description: "La larga: veintidós páginas",
    folder: "Susurros entre las estrellas y la noche",
  },
  {
    id: "carta-nicole-sobre",
    title: "Nicole",
    description: "Tu nombre, que ya es mi palabra favorita",
    files: ["Nicole.png"],
  },
  {
    id: "carta-la-de-civil",
    title: "La de civil",
    files: ["La de civil.png"],
  },
  {
    id: "carta-abayomi-sobre",
    title: "Abayomi",
    description: "Un rincón solo tuyo",
    files: ["abayomi.png"],
  },
  {
    id: "carta-pancito-sobre",
    title: "Pancito",
    files: ["Pancito.png"],
  },
])

/** Las cartas que viven dentro de su propia sección del hub. */
const pageLetters = build(
  [
    {
      id: "carta-nicole",
      title: "Nicole",
      description: "Algo escrito solo para ti",
      files: ["Nicole  Algo escrito solo para ti.png"],
    },
    {
      id: "carta-abayomi",
      title: "Abayomi",
      description: "Un rincón guardado para ti",
      files: ["Abayomi Un rincón guardado para ti.png"],
    },
    {
      id: "carta-pancito",
      title: "Pancito",
      description: "Cositas lindas que veo en ti",
      files: ["Pancito cositas lindas que veo en ti.png"],
    },
  ],
  3,
)

export const nicoleLetter: Letter = pageLetters[0]
export const abayomiLetter: Letter = pageLetters[1]
export const pancitoLetter: Letter = pageLetters[2]
