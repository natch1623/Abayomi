import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { rasgos } from "../data/pancitos"
import { shuffle } from "../data/media"
import { cargarRasgosVistos, guardarRasgosVistos } from "../data/progress"
import { pancitoLetter } from "../data/letters"
import LetterModal from "../components/LetterModal"

interface PancitoData {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  rotStart: number
  rotEnd: number
}

/** Cuántos pancitos caen a la vez. Los rasgos restantes van rotando. */
const PANCITO_COUNT = 12

function PancitoSVG({ size, isOpen }: { size: number; isOpen: boolean }) {
  return (
    <svg
      width={size}
      height={size * 0.88}
      viewBox="0 0 60 53"
      fill="none"
      style={{
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
        transition: "transform 0.3s ease",
        transform: isOpen ? "scale(1.08)" : "scale(1)",
      }}
    >
      {/* Shadow */}
      <ellipse cx="30" cy="50" rx="20" ry="5" fill="#a05010" opacity="0.3" />
      {/* Bottom bun */}
      <rect x="5" y="38" width="50" height="12" rx="6" fill="#e8902a" />
      {/* Top dome */}
      <path d="M5 43 Q5 8 30 8 Q55 8 55 43 Z" fill="#f4a843" />
      {/* Sheen */}
      <ellipse cx="24" cy="20" rx="8" ry="5" fill="rgba(255,255,200,0.3)" transform="rotate(-15,24,20)" />
      {/* Score lines */}
      <path d="M13 34 Q30 25 47 34" stroke="#d47818" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.65" />
      <path d="M19 27 Q30 38 41 27" stroke="#d47818" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.65" />
      {/* Opening glow when open */}
      {isOpen && (
        <ellipse cx="30" cy="38" rx="18" ry="6" fill="#ffeedd" opacity="0.6" />
      )}
    </svg>
  )
}

function PancitoItem({
  pancito,
  rasgo,
  onReveal,
}: {
  pancito: PancitoData
  rasgo: string
  onReveal: (id: number, rasgo: string, x: number, y: number) => void
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  return (
    <div
      className="absolute"
      style={{
        left: `${pancito.x}%`,
        top: "-120px",
        animation: `pancitoCae ${pancito.duration}s linear ${pancito.delay}s infinite`,
        cursor: "pointer",
        ["--rot-s" as string]: `${pancito.rotStart}deg`,
        ["--rot-e" as string]: `${pancito.rotEnd}deg`,
        userSelect: "none",
        zIndex: 5,
      }}
      onClick={e => {
        const rect = e.currentTarget.getBoundingClientRect()
        onReveal(
          pancito.id,
          rasgo,
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        )
      }}
    >
      <PancitoSVG size={pancito.size} isOpen={false} />
    </div>
  )
}

function RasgoCard({
  rasgo,
  x,
  y,
  onClose,
}: {
  rasgo: string
  x: number
  y: number
  onClose: () => void
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  // Position the card so it stays inside viewport
  const cardW = 220
  const cardH = 130
  const left = Math.min(Math.max(x - cardW / 2, 12), window.innerWidth - cardW - 12)
  const top = Math.min(Math.max(y - cardH - 20, 12), window.innerHeight - cardH - 12)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 40, background: "rgba(0,0,0,0.15)" }}
        onClick={close}
      />
      {/* Card */}
      <div
        className="fixed"
        style={{
          left,
          top,
          width: cardW,
          zIndex: 50,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.85) translateY(10px)",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Pancito open illustration */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "-16px" }}>
          <PancitoSVG size={56} isOpen />
        </div>

        {/* Note paper */}
        <div
          style={{
            background: "linear-gradient(160deg, #fdf8ee, #f5ecd4)",
            borderRadius: "10px",
            padding: "22px 18px 16px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,160,80,0.2)",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Paper lines */}
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: "16px", right: "16px",
              top: `${42 + i * 22}px`,
              height: "1px",
              background: "rgba(180,140,70,0.12)",
            }} />
          ))}

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "14px",
              color: "#6b4020",
              lineHeight: "1.55",
              margin: "0 0 12px",
              position: "relative",
            }}
          >
            {rasgo}
          </p>
          <button
            onClick={close}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(120,80,30,0.45)",
              padding: "4px 0",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(120,80,30,0.8)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(120,80,30,0.45)")}
          >
            ✕ cerrar
          </button>
        </div>
      </div>
    </>
  )
}

export default function PancitosPage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [revealed, setRevealed] = useState<{
    id: number; rasgo: string; x: number; y: number
  } | null>(null)
  const [letterOpen, setLetterOpen] = useState(false)

  const [listaAbierta, setListaAbierta] = useState(false)

  // Los rasgos son muchos más que los pancitos en pantalla, así que se recorren
  // en orden barajado y cada pancito abierto se recarga con uno que no se haya
  // visto todavía.
  const orden = useMemo(() => shuffle(rasgos.map((_, i) => i)), [])
  const [descubiertos, setDescubiertos] = useState<number[]>(() =>
    cargarRasgosVistos().filter(i => i >= 0 && i < rasgos.length)
  )

  /** Rasgo cargado en cada pancito, por índice de `rasgos`. */
  const [slots, setSlots] = useState<number[]>(() => {
    const vistos = new Set(cargarRasgosVistos())
    const cupo = Math.min(PANCITO_COUNT, rasgos.length)
    const barajado = shuffle(rasgos.map((_, i) => i))
    // Al volver, se reparten primero los que aún son secreto.
    const frescos = barajado.filter(i => !vistos.has(i))
    const resto = barajado.filter(i => vistos.has(i))
    return [...frescos, ...resto].slice(0, cupo)
  })

  useEffect(() => {
    guardarRasgosVistos(descubiertos)
  }, [descubiertos])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const goBack = () => {
    setFadeOut(true)
    setTimeout(() => navigate("/hub"), 650)
  }

  // Generate fixed pancito positions (stable across renders)
  const pancitos = useMemo<PancitoData[]>(() => {
    const items: PancitoData[] = []
    const count = Math.min(PANCITO_COUNT, rasgos.length)
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        x: 4 + (i / count) * 88 + (Math.random() - 0.5) * 6,
        delay: -(Math.random() * 14),
        duration: 9 + Math.random() * 7,
        size: 48 + Math.random() * 26,
        rotStart: -12 + Math.random() * 24,
        rotEnd: -12 + Math.random() * 24,
      })
    }
    return items
  }, [])

  const openPancito = (id: number, _rasgo: string, x: number, y: number) => {
    const rasgoIdx = slots[id]
    setDescubiertos(d => (d.includes(rasgoIdx) ? d : [...d, rasgoIdx]))
    setRevealed({ id, rasgo: rasgos[rasgoIdx], x, y })
  }

  /**
   * Al cerrar, ese pancito se recarga con un rasgo que todavía sea secreto y
   * que no esté ya dentro de otro pancito. Solo cuando no queda ninguno sin
   * ver se permite repetir, y aun así nunca dos iguales a la vez.
   */
  const closePancito = () => {
    if (revealed) {
      const id = revealed.id
      setSlots(s => {
        const enOtros = new Set(s.filter((_, i) => i !== id))
        const vistos = new Set([...descubiertos, s[id]])
        const siguiente =
          orden.find(i => !vistos.has(i) && !enOtros.has(i)) ??
          orden.find(i => !enOtros.has(i)) ??
          s[id]
        const next = [...s]
        next[id] = siguiente
        return next
      })
    }
    setRevealed(null)
  }

  const restantes = rasgos.length - descubiertos.length

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #120804, #1e1006, #0e0804)",
        opacity: mounted && !fadeOut ? 1 : 0,
        transition: fadeOut ? "opacity 0.65s ease" : "opacity 1s ease",
      }}
    >
      {/* Warm ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(200,100,20,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Falling pancitos */}
      {pancitos.map(p => (
        <PancitoItem
          key={p.id}
          pancito={p}
          rasgo={rasgos[slots[p.id]]}
          onReveal={openPancito}
        />
      ))}

      {/* Rasgo card popup */}
      {revealed && (
        <RasgoCard
          rasgo={revealed.rasgo}
          x={revealed.x}
          y={revealed.y}
          onClose={closePancito}
        />
      )}

      {/* Back button */}
      <button
        onClick={goBack}
        className="absolute"
        style={{
          top: "clamp(16px,3vh,24px)",
          left: "clamp(16px,3vw,28px)",
          zIndex: 30,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(240,190,120,0.4)",
          padding: "8px 0",
          transition: "color 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(240,190,120,0.9)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,190,120,0.4)")}
      >
        ← Volver
      </button>

      {/* Title */}
      <div
        className="absolute"
        style={{
          top: "clamp(14px,3vh,24px)",
          left: 0, right: 0,
          textAlign: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(13px,1.8vw,17px)",
            color: "rgba(240,200,140,0.5)",
            letterSpacing: "0.04em",
            margin: 0,
          }}
        >
          Toca un pancito para descubrir lo que hay dentro
        </p>
        {descubiertos.length > 0 && (
          <button
            onClick={() => setListaAbierta(true)}
            style={{
              pointerEvents: "auto",
              marginTop: "10px",
              background: "none",
              border: "none",
              borderBottom: "1px solid rgba(240,200,140,0.25)",
              cursor: "pointer",
              padding: "2px 2px 4px",
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(240,200,140,0.42)",
              transition: "color 0.3s ease, border-color 0.3s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "rgba(250,220,175,0.9)"
              e.currentTarget.style.borderColor = "rgba(240,200,140,0.6)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "rgba(240,200,140,0.42)"
              e.currentTarget.style.borderColor = "rgba(240,200,140,0.25)"
            }}
          >
            {descubiertos.length} de {rasgos.length} descubiertos — ver lista
          </button>
        )}
      </div>

      {/* La carta de este rincón */}
      {pancitoLetter.pages.length > 0 && (
        <button
          onClick={() => setLetterOpen(true)}
          className="absolute"
          style={{
            bottom: "clamp(18px,4vh,32px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(240,170,70,0.07)",
            border: "1px solid rgba(240,170,70,0.25)",
            borderRadius: "999px",
            padding: "9px 20px",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(245,205,145,0.7)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(240,170,70,0.16)"
            e.currentTarget.style.color = "rgba(255,230,190,0.95)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(240,170,70,0.07)"
            e.currentTarget.style.color = "rgba(245,205,145,0.7)"
          }}
        >
          ✦ Leer la carta
        </button>
      )}

      {listaAbierta && (
        <ListaDescubiertos
          descubiertos={descubiertos}
          restantes={restantes}
          onClose={() => setListaAbierta(false)}
        />
      )}

      {letterOpen && (
        <LetterModal letter={pancitoLetter} onClose={() => setLetterOpen(false)} />
      )}
    </div>
  )
}

/** Panel con los rasgos ya abiertos y cuántos siguen siendo secreto. */
function ListaDescubiertos({
  descubiertos,
  restantes,
  onClose,
}: {
  descubiertos: number[]
  restantes: number
  onClose: () => void
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    setVisible(false)
    setTimeout(onClose, 320)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 90,
        background: `rgba(12,5,2,${visible ? 0.9 : 0})`,
        backdropFilter: visible ? "blur(9px)" : "blur(0px)",
        transition: "all 0.35s ease",
        padding: "clamp(16px,5vh,52px) clamp(14px,5vw,40px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) close() }}
    >
      <div
        style={{
          position: "relative",
          width: "min(520px, 100%)",
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          background: "radial-gradient(ellipse 90% 50% at 50% 0%, rgba(120,60,12,0.22), rgba(16,9,4,0.97))",
          border: "1px solid rgba(240,180,90,0.22)",
          borderRadius: "10px",
          boxShadow: "0 24px 70px rgba(0,0,0,0.65), 0 0 50px rgba(200,120,30,0.1)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.97)",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Encabezado */}
        <div
          style={{
            padding: "clamp(22px,4vh,30px) clamp(20px,4vw,32px) clamp(14px,2vh,18px)",
            borderBottom: "1px solid rgba(240,180,90,0.14)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: "400",
              fontSize: "clamp(18px,3vw,25px)",
              color: "rgba(252,226,180,0.94)",
              margin: 0,
              textShadow: "0 0 40px rgba(240,170,70,0.35)",
            }}
          >
            Lo que ya abriste
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(240,200,140,0.4)",
              margin: "9px 0 0",
            }}
          >
            {descubiertos.length} de {descubiertos.length + restantes}
          </p>
        </div>

        {/* Lista */}
        <div
          style={{
            overflowY: "auto",
            padding: "clamp(16px,3vh,24px) clamp(20px,4vw,32px)",
            minHeight: 0,
          }}
        >
          {descubiertos.map((idx, n) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "12px",
                padding: "9px 0",
                borderBottom: n < descubiertos.length - 1 ? "1px solid rgba(240,180,90,0.07)" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: "rgba(240,190,110,0.35)",
                  minWidth: "18px",
                }}
              >
                {String(n + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(13px,1.7vw,15px)",
                  lineHeight: "1.65",
                  color: "rgba(250,226,190,0.8)",
                }}
              >
                {rasgos[idx]}
              </span>
            </div>
          ))}
        </div>

        {/* Lo que falta */}
        <div
          style={{
            padding: "clamp(16px,2.5vh,22px) clamp(20px,4vw,32px) clamp(20px,3vh,26px)",
            borderTop: "1px solid rgba(240,180,90,0.14)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(13px,1.7vw,15px)",
              color: "rgba(245,205,150,0.62)",
              margin: "0 0 14px",
              lineHeight: "1.7",
            }}
          >
            {restantes > 0
              ? `Todavía quedan ${restantes} ${restantes === 1 ? "secreto" : "secretos"} dentro de los pancitos.`
              : "Ya no queda ningún secreto dentro de los pancitos. Los viste todos."}
          </p>
          <button
            onClick={close}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(240,190,120,0.45)",
              padding: "4px 0",
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(250,215,160,0.9)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,190,120,0.45)")}
          >
            ✕ Seguir buscando
          </button>
        </div>
      </div>
    </div>
  )
}
