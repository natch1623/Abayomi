export interface TimelineEvent {
  id: string
  date: string
  shortDate: string
  year: string
  title: string
  description: string
  color: string
  isLast?: boolean
}

export const timeline: TimelineEvent[] = [
  {
    id: "01",
    date: "5 de septiembre, 2024",
    shortDate: "5 SEP",
    year: "2024",
    title: "El día que te hablé",
    description:
      "El primer día que te hablé. Mientras una parte de mí estaba llena de nervios, la otra estaba llena de emoción. Me trababa al hablar, pero estaba feliz de hablarte por primera vez.",
    color: "#6b9fe0",
  },
  {
    id: "02",
    date: "21 de octubre, 2024",
    shortDate: "21 OCT",
    year: "2024",
    title: "Tu abrigo",
    description:
      "El día que olvidé por unos minutos el calor de La Chorrera. Ese día que me prestaste tu abrigo y luego me lo quedé como por un mes. Un recuerdo muy bonito.",
    color: "#7aaae8",
  },
  {
    id: "03",
    date: "11 de noviembre, 2024",
    shortDate: "11 NOV",
    year: "2024",
    title: "El día que me salvaste",
    description:
      "Recuerdo ese día que básicamente hiciste que pasara Dibujo Lineal con el proyecto. Sin ti no lo habría podido hacer bien. Aún conservo la A que me diste.",
    color: "#89b4e8",
  },
  {
    id: "04",
    date: "5 de diciembre, 2024",
    shortDate: "5 DIC",
    year: "2024",
    title: "Carter",
    description:
      "El día que te entregué la primera carta. El día que Carter se unió a la historia. El primer día que te extrañé.",
    color: "#a0c4ec",
  },
  {
    id: "05",
    date: "Diciembre, 2024",
    shortDate: "DICIEMBRE",
    year: "2024",
    title: "Noches de juego",
    description:
      "Las noches que pasamos jugando Plato y hablando de películas de la infancia.",
    color: "#9bb8e4",
  },
  {
    id: "06",
    date: "3 de enero, 2025",
    shortDate: "3 ENE",
    year: "2025",
    title: "Tu cumpleaños",
    description: "La primera vez que me enviaste una foto tuya.",
    color: "#82a8e0",
  },
  {
    id: "07",
    date: "1 de abril, 2025",
    shortDate: "1 ABR",
    year: "2025",
    title: "Te volví a ver",
    description:
      "El primer día de segundo año en que me encontré contigo.",
    color: "#6d9ad8",
  },
  {
    id: "08",
    date: "14 de abril, 2025",
    shortDate: "14 ABR",
    year: "2025",
    title: "El día que dije lo que sentía",
    description:
      "Los nervios de ese momento y el no saber ni qué decir. Siempre lo recordaré.",
    color: "#7896cc",
  },
  {
    id: "09",
    date: "28 de febrero, 2026",
    shortDate: "28 FEB",
    year: "2026",
    title: "El McFlurry",
    description:
      "Se podría considerar que fue la primera salida que tuve contigo. Un día del que no recuerdo bien los detalles, pero las cosas que recuerdo fueron lindas.",
    color: "#6880c0",
  },
  {
    id: "10",
    date: "29 de julio, 2026",
    shortDate: "29 JUL",
    year: "2026",
    title: "Primera cita",
    description:
      "La primera vez que oficialmente te invité a salir. Un día con recuerdos muy bonitos. Incluso Carter estuvo allí.",
    color: "#f0a850",
    isLast: true,
  },
]
