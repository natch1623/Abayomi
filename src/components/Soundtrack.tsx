import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { cancion } from "../data/media"
import { cargarSonido, guardarSonido } from "../data/progress"

/**
 * Una pista por área, encadenadas con suavidad.
 *
 * Entre áreas normales las dos pistas se cruzan: la nueva entra mientras la
 * anterior se apaga. La excepción es el planeta final: allí la anterior se
 * apaga del todo ANTES de que empiece «the universe is and we are», para que
 * esa canción entre sola y sea la protagonista.
 */

const VOL_NORMAL = 0.5
/** El final suena más alto: es el que tiene que llevarse la escena. */
const VOL_FINAL = 0.82

const CRUCE_MS = 1400
/** Lo anterior se apaga del todo… */
const SALIDA_FINAL_MS = 1300
/** …luego un silencio limpio… */
const SILENCIO_FINAL_MS = 550
/**
 * …y la última entra ya a volumen. Solo lo justo para no soltar un chasquido:
 * la canción dice una frase desde el segundo cero y tiene que oírse entera.
 */
const ENTRADA_FINAL_MS = 220

const PISTA_FINAL = "the universe is and we are.mp3"

/** Qué canción le toca a cada área, por el nombre del archivo. */
function pistaPara(pathname: string): string {
  if (pathname.startsWith("/universo")) return PISTA_FINAL
  if (pathname.startsWith("/futuro")) return "hacia el futuro.mp3"
  if (pathname.startsWith("/cartas")) return "cartas.mp3"
  if (pathname.startsWith("/experiencia")) return "linea de tiempo.mp3"
  // El hub y los rincones que cuelgan de él comparten pista, así la música
  // no se corta al entrar en uno de ellos.
  if (
    pathname.startsWith("/hub") ||
    pathname.startsWith("/pancito") ||
    pathname.startsWith("/civil") ||
    pathname.startsWith("/abayomi")
  ) {
    return "tus rincones.mp3"
  }
  return "campo de flores.mp3"
}

function volumenDe(pista: string): number {
  return pista === PISTA_FINAL ? VOL_FINAL : VOL_NORMAL
}

export default function Soundtrack() {
  const { pathname } = useLocation()
  const [activo, setActivo] = useState(cargarSonido)
  /** El navegador puede negar la reproducción hasta que haya un gesto. */
  const [bloqueado, setBloqueado] = useState(false)

  /** Un elemento de audio por pista, creado la primera vez que hace falta. */
  const pistasRef = useRef(new Map<string, HTMLAudioElement>())
  /** Token por pista para cancelar un fundido a medias. */
  const fundidosRef = useRef(new Map<string, number>())
  const actualRef = useRef<string | null>(null)
  /** Arranque aplazado de la pista final, para poder cancelarlo. */
  const pendienteRef = useRef<number | null>(null)
  const activoRef = useRef(activo)
  activoRef.current = activo

  /**
   * Sube o baja el volumen poco a poco.
   *
   * Va con temporizadores y no con requestAnimationFrame: el navegador congela
   * los fotogramas cuando la pestaña pasa a segundo plano, y un fundido a medio
   * camino dejaría dos canciones sonando a la vez. Además hay una red de
   * seguridad que fija el valor final aunque los temporizadores se ralenticen.
   */
  const fundir = (
    audio: HTMLAudioElement,
    pista: string,
    destino: number,
    ms: number,
    alTerminar?: () => void,
  ) => {
    const token = (fundidosRef.current.get(pista) ?? 0) + 1
    fundidosRef.current.set(pista, token)

    const desde = audio.volume
    const t0 = performance.now()
    let hecho = false

    const acotar = (v: number) => Math.max(0, Math.min(1, v))

    const rematar = () => {
      if (hecho) return
      hecho = true
      clearInterval(id)
      clearTimeout(red)
      if (fundidosRef.current.get(pista) !== token) return
      audio.volume = acotar(destino)
      alTerminar?.()
    }

    const id = window.setInterval(() => {
      // Otro fundido tomó el control de esta pista.
      if (fundidosRef.current.get(pista) !== token) {
        hecho = true
        clearInterval(id)
        clearTimeout(red)
        return
      }
      const k = Math.min(1, (performance.now() - t0) / ms)
      // Curva suave en los extremos, sin saltos al empezar ni al acabar.
      const suave = k * k * (3 - 2 * k)
      audio.volume = acotar(desde + (destino - desde) * suave)
      if (k >= 1) rematar()
    }, 25)

    const red = window.setTimeout(rematar, ms + 80)
  }

  const obtener = (pista: string): HTMLAudioElement | null => {
    const cache = pistasRef.current
    const existente = cache.get(pista)
    if (existente) return existente

    const url = cancion(pista)
    if (!url) return null

    const audio = new Audio(url)
    audio.loop = true
    audio.preload = "auto"
    audio.volume = 0
    cache.set(pista, audio)
    return audio
  }

  const arrancar = (audio: HTMLAudioElement) => {
    const intento = audio.play()
    if (intento) {
      intento.then(() => setBloqueado(false)).catch(() => setBloqueado(true))
    }
  }

  const detener = (audio: HTMLAudioElement, pista: string, ms: number) => {
    fundir(audio, pista, 0, ms, () => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  // Cambio de área: encadena la pista que toca.
  useEffect(() => {
    const destino = pistaPara(pathname)
    if (actualRef.current === destino) return

    // Si había un arranque aplazado de otra transición, se descarta.
    if (pendienteRef.current !== null) {
      clearTimeout(pendienteRef.current)
      pendienteRef.current = null
    }

    const anteriorNombre = actualRef.current
    const anterior = anteriorNombre ? pistasRef.current.get(anteriorNombre) : null
    actualRef.current = destino

    if (!activoRef.current) {
      if (anterior && anteriorNombre) detener(anterior, anteriorNombre, 400)
      return
    }

    const nuevo = obtener(destino)
    if (!nuevo) return

    // El planeta final entra solo: primero se apaga lo anterior del todo.
    const esFinal = destino === PISTA_FINAL

    if (anterior && anteriorNombre) {
      detener(anterior, anteriorNombre, esFinal ? SALIDA_FINAL_MS : CRUCE_MS)
    }

    const encender = () => {
      if (actualRef.current !== destino || !activoRef.current) return
      if (esFinal) {
        // Desde el principio y sin nada encima: la frase inicial se aprecia.
        anterior?.pause()
        nuevo.currentTime = 0
      }
      nuevo.volume = 0
      arrancar(nuevo)
      fundir(nuevo, destino, volumenDe(destino), esFinal ? ENTRADA_FINAL_MS : CRUCE_MS)
    }

    if (esFinal && anterior) {
      // Silencio limpio antes de que empiece.
      pendienteRef.current = window.setTimeout(() => {
        pendienteRef.current = null
        encender()
      }, SALIDA_FINAL_MS + SILENCIO_FINAL_MS)
      return
    }
    encender()

    // Estando ya en «Hacia el futuro», la última queda cargada y lista, para
    // que al llegar al planeta suene al instante y no se pierda el arranque.
    if (destino === "hacia el futuro.mp3") obtener(PISTA_FINAL)
  }, [pathname])

  // Encender y apagar la música desde el botón.
  useEffect(() => {
    guardarSonido(activo)
    const pista = actualRef.current
    if (!pista) return
    const audio = pistasRef.current.get(pista) ?? obtener(pista)
    if (!audio) return

    if (activo) {
      audio.volume = 0
      arrancar(audio)
      fundir(audio, pista, volumenDe(pista), 900)
    } else {
      detener(audio, pista, 600)
    }
  }, [activo])

  // Si el navegador bloqueó el arranque, se reintenta al primer gesto.
  useEffect(() => {
    if (!bloqueado || !activo) return

    const reintentar = () => {
      const pista = actualRef.current
      if (!pista) return
      const audio = pistasRef.current.get(pista)
      if (!audio) return
      audio.volume = 0
      arrancar(audio)
      fundir(audio, pista, volumenDe(pista), 1200)
    }

    window.addEventListener("pointerdown", reintentar, { once: true })
    window.addEventListener("keydown", reintentar, { once: true })
    return () => {
      window.removeEventListener("pointerdown", reintentar)
      window.removeEventListener("keydown", reintentar)
    }
  }, [bloqueado, activo])

  // Al desmontar, callar todo y olvidar en qué pista íbamos, para que un
  // remontaje (StrictMode lo hace en desarrollo) vuelva a empezar limpio.
  useEffect(() => {
    const pistas = pistasRef.current
    const pendiente = pendienteRef
    const actual = actualRef
    return () => {
      if (pendiente.current !== null) {
        clearTimeout(pendiente.current)
        pendiente.current = null
      }
      for (const audio of pistas.values()) audio.pause()
      pistas.clear()
      actual.current = null
    }
  }, [])

  const sonando = activo && !bloqueado

  return (
    <button
      onClick={() => setActivo(a => !a)}
      title={activo ? "Silenciar la música" : "Poner la música"}
      aria-label={activo ? "Silenciar la música" : "Poner la música"}
      style={{
        position: "fixed",
        right: "clamp(14px,2.5vw,26px)",
        bottom: "clamp(14px,2.5vh,26px)",
        zIndex: 200,
        width: "34px",
        height: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10,8,20,0.45)",
        border: "1px solid rgba(230,220,255,0.16)",
        borderRadius: "50%",
        cursor: "pointer",
        padding: 0,
        color: sonando ? "rgba(240,230,255,0.75)" : "rgba(230,220,255,0.35)",
        backdropFilter: "blur(6px)",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = "rgba(255,250,255,0.98)"
        e.currentTarget.style.borderColor = "rgba(230,220,255,0.45)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = sonando ? "rgba(240,230,255,0.75)" : "rgba(230,220,255,0.35)"
        e.currentTarget.style.borderColor = "rgba(230,220,255,0.16)"
      }}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path
          d="M3.4 6.1h2.1L8.4 3.5v9L5.5 9.9H3.4z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {sonando ? (
          <>
            <path d="M10.6 5.9a3 3 0 0 1 0 4.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            <path d="M12.4 4.3a5.4 5.4 0 0 1 0 7.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <path d="M10.8 6.2l3.2 3.6M14 6.2l-3.2 3.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        )}
      </svg>
    </button>
  )
}
