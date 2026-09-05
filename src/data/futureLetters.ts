import { asset } from "./media"

/** Cada carta lleva un marco distinto; la clave elige cuál se dibuja. */
export type FrameKind =
  | "flourish"   // doble filete con volutas en las esquinas
  | "arrows"     // trazo discontinuo con flechas al costado
  | "dissolve"   // los bordes se desvanecen en las esquinas
  | "brackets"   // esquinas de fotografía, sin marco continuo
  | "geometric"  // ángulos rectos con rombos arriba y abajo
  | "envelope"   // solapa de sobre y lacre

export interface FutureEnvelope {
  icon: string
  /** Identificador interno; no se muestra, el plan se adivina por la pista. */
  name: string
  hint: string[]
}

export interface FutureReveal {
  label: string
  /** Nombre del archivo dentro de `assets/` */
  image: string
  phrase: string
}

export interface FutureLetter {
  id: string
  title: string
  icon: string
  color: string
  frame: FrameKind
  paragraphs: string[]
  /** Última línea, destacada como cierre. */
  closing?: string
  reveal?: FutureReveal
  envelopes?: FutureEnvelope[]
}

export const futureLetters: FutureLetter[] = [
  {
    id: "f-camino",
    title: "El camino a entenderte",
    icon: "~",
    color: "#f0a8c0",
    frame: "flourish",
    paragraphs: [
      "A lo largo del tiempo, conociéndote poco a poco, he aprendido cómo eres, la forma en que ves el mundo, aquellas cosas que te gustan y esas que no tanto. Y, a pesar de todo lo que ya conozco de ti, sé que todavía me queda mucho por descubrir para llegar a entender del todo tu forma de ser.",
      "Soy de las personas que consideran que cada quien tiene una manera de actuar basada en lo que piensa y en las experiencias que ha vivido. También creo que ninguna persona es mala por naturaleza; muchas simplemente prefieren atacar antes de arriesgarse a ser heridas.",
      "Me dijiste que, hasta cierto punto, crees que esa parte del cariño está rota dentro de ti. Yo no sé si realmente sea así. Quizás no está rota; quizás simplemente aprendiste a poner ciertas barreras para protegerte. Al final, mientras más intensos son los sentimientos, más pueden doler cuando las cosas terminan.",
      "Y tal vez me equivoque. Hablo desde lo que yo he aprendido observando a las personas y desde mi propia forma de entenderlas. Precisamente por eso quiero conocerte.",
      "No tengo prisa. Tal vez tome semanas, meses y, quién sabe, quizás nunca llegue a entenderte por completo. Pero quiero intentarlo porque te quiero. Ese es mi porqué.",
      "Si actualmente no sabes cómo manejar algunas de estas cosas, o si en algún momento puede parecer que quedarme a tu lado es una causa perdida, yo no necesariamente lo veo así. Para mí, simplemente estoy siendo fiel a mí mismo y a los principios que sigo. No quiero llegar algún día a preguntarme qué habría pasado si me hubiera tomado el tiempo de conocerte de verdad.",
      "Y quiero que sepas que puedes confiar en mí. No importa para qué sea; mientras esté dentro de mis posibilidades, buscaré la forma de apoyarte.",
      "Estoy seguro de que, al final, entenderte también me ayudará a entenderme un poco más a mí mismo.",
    ],
    closing:
      "Todas las decisiones se toman en la oscuridad; solo cuando decidimos algo podemos descubrir si fue lo correcto o no…",
  },
  {
    id: "f-paso",
    title: "El siguiente paso",
    icon: "→",
    color: "#c4b8f0",
    frame: "arrows",
    paragraphs: [
      "Para hacer un resumen: no hay un siguiente paso.",
      "Y para la versión extensa…",
      "No veo mis interacciones contigo como un mapa que me lleve del punto A al punto B. Si así fuese, creo que todo sería más sencillo y, al mismo tiempo, bastante más aburrido.",
      "Por eso no puedo decirte exactamente cuál será el siguiente paso. Tal vez sea algo completamente inesperado, como regalarte una iguana y hacerte drama si no la aceptas como mascota. Aunque sería bastante triste si Ben decidiera comérsela pensando que le llevaste un aperitivo exótico.",
      "No lo sé.",
      "Suelo hacer planes a futuro, pero nunca he creado una ruta completamente directa para llegar a ellos. A veces simplemente tengo ideas de cosas que quiero hacer y espero encontrar la manera de organizarlas. Otras veces varias ideas chocan entre sí y terminan creando algo que originalmente ni siquiera había pensado.",
      "Así que no tengo demasiado planeados los próximos días.",
      "Hasta ahora, el único plan que sí puedo decirte con seguridad que quiero intentar cumplir es tener otra cita contigo al final del semestre. Eso no significa que antes de eso no vaya a aparecer con planes random de cosas que podemos hacer; simplemente ese es uno de los que ya tengo algunas ideas pensadas.",
      "Incluso tengo algunos lugares que me gustaría conocer contigo.",
      "Y si descubres el código del próximo plan, quizás encuentres alguna pista sobre ellos.",
      "Así que, de ahora en adelante, puedes esperar cualquier cosa.",
      "Y sí, lo de llevarte a Chiriquí es un plan en serio. Para ese solo necesitamos organizarnos… si en algún momento aceptas.",
      "No sé si para ti tenemos mucha conexión. Aun así, cada encuentro contigo se siente especial para mí.",
    ],
    closing: "Y espero que, al igual que yo, tú también me consideres una persona especial.",
  },
  {
    id: "f-incierto",
    title: "El futuro incierto",
    icon: "…",
    color: "#d8c0f0",
    frame: "dissolve",
    paragraphs: [
      "Es curioso. Siempre escribo sobre lo que creo que puede llegar a pasar más adelante y, cuando finalmente llega ese momento, muchas veces termino sorprendiéndome: algunas cosas ocurren como las imaginé y otras toman caminos completamente diferentes.",
      "Por eso digo que el futuro es incierto, y mucho más cuando se trata de nosotros.",
      "Pero hay algo que sí tengo claro: quiero pasar más tiempo contigo durante este semestre.",
      "Quiero estar contigo, hablar, compartir tiempo y aprovechar esos momentos siempre que sea posible. Por eso quiero invitarte a pasar los jueves juntos y, más adelante, me gustaría que pudiéramos crear una pequeña tradición entre nosotros; algo sencillo que quede como una de esas cosas que solo nosotros entendemos.",
      "Después tendré que ver hacia dónde nos lleva el futuro.",
      "Espero que el próximo año pueda seguir en Chorrera, porque eso haría mucho más fácil verte. Aunque también quiero aprovechar el verano para hacer algunas cosas fuera de la presión de la universidad y simplemente disfrutar un poco más.",
      "En fin, no sé qué pasará con nosotros más adelante.",
      "Pero al menos quiero que sepas algo:",
      "Siempre que elijas buscarme con cariño, sabrás dónde encontrarme.",
      "Y si alguna vez necesitas ayuda con algo, sabes que podrás contar conmigo. Haré lo que esté a mi alcance.",
      "No sé si las cosas terminarán exactamente como las imaginamos, pero creo que eso también forma parte de lo bonito de todo esto.",
      "Al final, mientras podamos, disfrutemos el proceso y mantengamos una actitud positiva… Siempre hay que recordar que:",
      "Los sentimientos deben decirse para que se entiendan.",
    ],
    reveal: {
      label: "Y por eso…",
      image: "futuro incierto.jpeg",
      phrase: "Por eso siempre te diré lo mucho que te quiero, Pancito…",
    },
  },
  {
    id: "f-recuerdos",
    title: "Más recuerdos",
    icon: "✦",
    color: "#f0d8a8",
    frame: "brackets",
    paragraphs: [
      "Este semestre tengo la oportunidad de pasar más tiempo contigo, así que quiero aprovecharlo para crear más recuerdos.",
      "Una vez al mes quiero presentarte al menos una cosa que me gustaría hacer contigo. Serán cosas pequeñas que podamos hacer un jueves mientras esperas tu siguiente clase, o algún día después de salir de la universidad.",
      "No serán planes demasiado complejos ni necesariamente algo extraordinario.",
      "Solo quiero que sean momentos que, con el tiempo, podamos recordar con cariño.",
      "Quizás ese también sea un buen camino para que conozcas un poco más de mí. Porque, aunque dices que contigo me cohíbo, no es del todo verdad.",
      "Hay partes de mí que solo tú conoces.",
      "Hay facetas de mi personalidad que no suelo mostrarle a otras personas, y creo que eso también dice algo sobre la confianza que hemos construido.",
      "Así que el próximo jueves intentaré presentarte el primer recuerdito.",
      "Espero que sea de tu agrado.",
      "Y si no lo es, siempre puedes darme sugerencias para el siguiente.",
      "Después de todo, no quiero que estos recuerdos sean solamente ideas mías; me gustaría que poco a poco también se conviertan en cosas que podamos disfrutar los dos.",
    ],
    closing:
      "Así, un día cualquiera, uno de esos recuerdos nos permita sacar un tema de conversación y crear nuevos recuerdos.",
  },
  {
    id: "f-metas",
    title: "Metas",
    icon: "△",
    color: "#a8e8c8",
    frame: "geometric",
    paragraphs: [
      "Quizás sea extraño que una carta llamada «Metas» empiece diciendo que no tengo ninguna.",
      "Pero es justamente eso.",
      "No quiero establecer una serie de objetivos que quiera cumplir para que todo.",
      "No quiero que este semestre tenga que seguir una ruta específica.",
      "Mi única meta, si realmente tengo que elegir una, es disfrutar del tiempo que pueda pasar contigo.",
      "Disfrutar tu compañía cada vez que sea posible, conocerte un poco más y hacerte sonreír siempre que pueda.",
      "Eso no significa que todos los días vayan a ser tranquilos ni que todo vaya a salir como lo imagine. Seguramente habrá momentos extraños, planes que no funcionen, días en los que simplemente no sepamos qué hacer y quién sabe cuántas otras cosas.",
      "Y está bien.",
      "Porque conocer a alguien no debería sentirse como completar una lista de objetivos.",
      "Solo quiero dar lo mejor de mí y vivir esto de una manera que, cuando mire hacia atrás, pueda decir que fui sincero con lo que sentía y que aproveché las oportunidades que tuve para compartir contigo.",
      "No sé dónde terminará todo esto.",
      "Pero por ahora, no necesito saberlo.",
    ],
    closing: "Me basta con saber que quiero estar aquí y disfrutar el camino.",
  },
  {
    id: "f-plan",
    title: "El próximo plan",
    icon: "◎",
    color: "#a8d8f0",
    frame: "envelope",
    paragraphs: [
      "Aquí habrá tres sobres.",
      "Cada uno guarda un pequeño plan.",
      "Cuando abras cualquiera de ellos encontrarás una pequeña pista, pero la información completa todavía no estará disponible.",
    ],
    envelopes: [
      {
        icon: "🍿",
        name: "Palomitas de maíz",
        hint: [
          "No suelo repetir planes, así que este probablemente no sea tan obvio como crees.",
          "Solo diré que incluye una de tus cosas favoritas.",
        ],
      },
      {
        icon: "🌲",
        name: "Un bosque",
        hint: [
          "Hay lugares bonitos para conectar con la naturaleza y tengo tres lugares que me gustaría visitar contigo.",
        ],
      },
      {
        icon: "🏛️",
        name: "Un museo",
        hint: [
          "Una aventura un poco diferente.",
          "Esta vez no se trata solamente de compartir tiempo, sino también de descubrir algo juntos.",
        ],
      },
    ],
  },
]

/** URL de la imagen que revela una carta, si tiene. */
export function revealImage(letter: FutureLetter): string {
  return letter.reveal ? asset(letter.reveal.image) : ""
}
