import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

/**
 * El final del recorrido: un planeta suspendido en el vacío, con la frase
 * siguiendo su curva. El tono es el de Outer Wilds — quieto, cálido y enorme
 * a la vez: brasas de fogata a la deriva sobre un cielo profundo.
 */

interface Mote {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  warm: boolean
  opacity: number
  phase: number
}

/* ── Manchas de color del planeta ─────────────────────────────────────
   Acuarelas sueltas bajo la superficie; giran muy despacio, así que el
   planeta nunca se ve dos veces exactamente igual.                     */
const BLOTCHES: { cx: number; cy: number; rx: number; ry: number; fill: string; o: number }[] = [
  { cx: 166, cy: 122, rx: 42, ry: 32, fill: "#6b3fd8", o: 0.82 },
  { cx: 248, cy: 146, rx: 36, ry: 28, fill: "#f0a02c", o: 0.7 },
  { cx: 126, cy: 182, rx: 38, ry: 30, fill: "#2f6be8", o: 0.82 },
  { cx: 274, cy: 210, rx: 40, ry: 34, fill: "#e83a56", o: 0.7 },
  { cx: 182, cy: 244, rx: 44, ry: 32, fill: "#4356e8", o: 0.8 },
  { cx: 262, cy: 278, rx: 32, ry: 26, fill: "#8a3fe0", o: 0.76 },
  { cx: 138, cy: 268, rx: 30, ry: 24, fill: "#f06a3c", o: 0.62 },
  { cx: 212, cy: 172, rx: 28, ry: 22, fill: "#a8b8f0", o: 0.6 },
  { cx: 196, cy: 306, rx: 34, ry: 22, fill: "#3f68d8", o: 0.62 },
  { cx: 300, cy: 168, rx: 24, ry: 20, fill: "#f0c060", o: 0.5 },
  { cx: 108, cy: 240, rx: 24, ry: 20, fill: "#7a5ae0", o: 0.55 },
  { cx: 230, cy: 108, rx: 26, ry: 18, fill: "#cfd8ee", o: 0.5 },
]

/** Rayos que salen del núcleo, como en la referencia. */
const RAYS = Array.from({ length: 30 }, (_, i) => {
  const a = (i / 30) * Math.PI * 2 + 0.18
  const len = i % 5 === 0 ? 150 : i % 3 === 0 ? 118 : i % 2 === 0 ? 92 : 66
  return { a, len, w: i % 5 === 0 ? 1.8 : i % 3 === 0 ? 1.2 : 0.8 }
})

/** Las cuatro puntas largas del destello central. */
const SPIKES = [
  { x: 0, y: -1, len: 210 },
  { x: 0, y: 1, len: 210 },
  { x: -1, y: 0, len: 170 },
  { x: 1, y: 0, len: 170 },
]

function Planet() {
  return (
    <svg
      viewBox="-70 -70 540 540"
      style={{
        width: "min(84vmin, 700px)",
        height: "min(84vmin, 700px)",
        display: "block",
        overflow: "visible",
      }}
    >
      <defs>
        <clipPath id="orb">
          <circle cx="200" cy="200" r="150" />
        </clipPath>

        {/* Cuerpo pálido con el núcleo encendido */}
        <radialGradient id="body" cx="46%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#fbfaff" stopOpacity="0.96" />
          <stop offset="45%" stopColor="#e6e3ef" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c2bfd2" stopOpacity="0.88" />
        </radialGradient>

        {/* Halo exterior, ahora con color */}
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="72%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="84%" stopColor="#c9a6ff" stopOpacity="0.32" />
          <stop offset="93%" stopColor="#ff9f5a" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#7a5cff" stopOpacity="0" />
        </radialGradient>

        {/* Trama de puntos, como la referencia */}
        <pattern id="halftone" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.5" fill="#ffffff" fillOpacity="0.5" />
        </pattern>

        {/* Degradado de las puntas del destello */}
        <linearGradient id="spike" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <filter id="blotchBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
        <filter id="rimGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="coreGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="spikeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id="orbitGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      {/* Anillo de órbita, inclinado, por detrás */}
      <g transform="rotate(-17 200 200)">
        <path
          id="orbita"
          d="M 4 200 A 196 58 0 1 0 396 200 A 196 58 0 1 0 4 200"
          fill="none"
          stroke="#cbb8ff"
          strokeOpacity="0.24"
          strokeWidth="1"
          filter="url(#orbitGlow)"
        />
      </g>

      {/* Pulsos que se abren desde el borde */}
      {[0, 1, 2].map(i => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="#e6d8ff"
          strokeWidth="1.2"
          className="uniPulse"
          style={{ transformOrigin: "200px 200px", animationDelay: `${i * 2.6}s` }}
        />
      ))}

      {/* Resplandor que lo rodea */}
      <circle cx="200" cy="200" r="248" fill="url(#halo)" className="uniHalo" />

      {/* Cuerpo */}
      <circle cx="200" cy="200" r="150" fill="url(#body)" />

      {/* Acuarelas, girando muy despacio */}
      <g clipPath="url(#orb)">
        <g filter="url(#blotchBlur)" className="uniBlotches" style={{ transformOrigin: "200px 200px" }}>
          {BLOTCHES.map((b, i) => (
            <ellipse
              key={i}
              cx={b.cx}
              cy={b.cy}
              rx={b.rx}
              ry={b.ry}
              fill={b.fill}
              opacity={b.o}
            />
          ))}
        </g>

        {/* Rayos desde el núcleo */}
        <g className="uniRays" style={{ transformOrigin: "200px 200px" }}>
          {RAYS.map((r, i) => (
            <line
              key={i}
              x1={200}
              y1={200}
              x2={200 + Math.cos(r.a) * r.len}
              y2={200 + Math.sin(r.a) * r.len}
              stroke="#ffffff"
              strokeWidth={r.w}
              strokeLinecap="round"
              opacity={0.5}
            />
          ))}
        </g>

        {/* Trama de puntos por encima del color */}
        <circle cx="200" cy="200" r="150" fill="url(#halftone)" opacity="0.16" />
      </g>

      {/* Velo lechoso: acuarela bajo una capa de luz */}
      <circle cx="200" cy="200" r="150" fill="#ffffff" opacity="0.14" />

      {/* Borde encendido */}
      <circle cx="200" cy="200" r="150" fill="none" stroke="#d8c4ff" strokeWidth="14" opacity="0.5" filter="url(#rimGlow)" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="#ffffff" strokeWidth="7" opacity="0.95" filter="url(#rimGlow)" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.95" />

      {/* Destello del núcleo */}
      <g className="uniCore" filter="url(#spikeGlow)">
        {SPIKES.map((sp, i) => (
          <path
            key={i}
            d={`M ${200 - sp.y * 7} ${200 + sp.x * 7}
                L ${200 + sp.x * sp.len} ${200 + sp.y * sp.len}
                L ${200 + sp.y * 7} ${200 - sp.x * 7} Z`}
            fill="#ffffff"
            opacity="0.62"
          />
        ))}
      </g>

      {/* Núcleo */}
      <circle cx="200" cy="200" r="20" fill="#ffffff" opacity="0.95" filter="url(#coreGlow)" className="uniCore" />
      <circle cx="200" cy="200" r="5" fill="#ffffff" />
    </svg>
  )
}

/** La frase, siguiendo la curva del planeta. */
function Phrase() {
  return (
    <svg
      viewBox="-70 -70 540 540"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <defs>
        {/* Por arriba, de izquierda a derecha pasando por la cima */}
        <path id="arcoAlto" d="M 8 200 A 192 192 0 0 1 392 200" fill="none" />
        {/* Por abajo, de izquierda a derecha pasando por la base */}
        <path id="arcoBajo" d="M 8 200 A 192 192 0 0 0 392 200" fill="none" />
      </defs>

      <text
        className="uniTextTop"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "30px",
          fill: "rgba(248,244,255,0.92)",
        }}
      >
        <textPath href="#arcoAlto" startOffset="50%" textAnchor="middle">
          the universe is
        </textPath>
      </text>

      <text
        className="uniTextBottom"
        dominantBaseline="hanging"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "30px",
          fill: "rgba(248,244,255,0.92)",
        }}
      >
        <textPath href="#arcoBajo" startOffset="50%" textAnchor="middle">
          and we are…
        </textPath>
      </text>
    </svg>
  )
}

export default function UniversePage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Estrellas quietas y brasas cálidas subiendo, como junto a una fogata.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let motes: Mote[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const total = Math.round((canvas.width * canvas.height) / 5200)
      motes = Array.from({ length: Math.min(300, Math.max(90, total)) }, () => {
        const warm = Math.random() < 0.22
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: warm ? -0.09 + Math.random() * 0.18 : -0.015 + Math.random() * 0.03,
          vy: warm ? -(0.12 + Math.random() * 0.3) : -(0.006 + Math.random() * 0.018),
          r: warm ? 0.7 + Math.random() * 1.5 : 0.4 + Math.random() * 1.3,
          warm,
          opacity: warm ? 0.3 + Math.random() * 0.5 : 0.14 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
        }
      })
    }
    resize()
    window.addEventListener("resize", resize)

    const render = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = performance.now() / 1000

      for (const m of motes) {
        m.x += m.vx
        m.y += m.vy
        if (m.y < -12) {
          m.y = canvas.height + 12
          m.x = Math.random() * canvas.width
        }
        if (m.x < -12) m.x = canvas.width + 12
        if (m.x > canvas.width + 12) m.x = -12

        const tw = 0.55 + 0.45 * Math.sin(t * (m.warm ? 1.9 : 0.7) + m.phase)
        const a = m.opacity * tw
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
        ctx.fillStyle = m.warm
          ? `rgba(255,186,104,${a})`
          : `rgba(226,232,255,${a})`
        ctx.fill()
      }
      animRef.current = requestAnimationFrame(render)
    }
    animRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  const goBack = () => {
    setFadeOut(true)
    setTimeout(() => navigate("/futuro"), 700)
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      style={{
        background: "#07060d",
        opacity: mounted && !fadeOut ? 1 : 0,
        transition: fadeOut ? "opacity 0.7s ease" : "opacity 1.6s ease",
      }}
    >
      {/* Nebulosas de fondo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 30% 25%, rgba(74,50,140,0.22) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 76% 74%, rgba(150,70,50,0.16) 0%, transparent 65%)",
        }}
      />
      {/* Vaho oscuro alrededor del planeta, para que el borde encienda */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(6,4,12,0.75) 0%, rgba(6,4,12,0.2) 38%, transparent 62%)",
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Volver */}
      <button
        onClick={goBack}
        className="absolute"
        style={{
          top: "clamp(16px,3vh,28px)",
          left: "clamp(16px,3vw,32px)",
          zIndex: 20,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(214,206,240,0.3)",
          padding: "8px 0",
          transition: "color 0.3s",
          animation: "homeRise 1s cubic-bezier(0.22,1,0.36,1) 2.6s both",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(230,224,255,0.85)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(214,206,240,0.3)")}
      >
        ← Volver
      </button>

      {/* Planeta y frase */}
      <div
        className="relative"
        style={{
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "uniArrive 2.4s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <Planet />
        <Phrase />
      </div>
    </div>
  )
}
