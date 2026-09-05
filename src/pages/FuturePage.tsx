import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { futureLetters, type FutureLetter } from "../data/futureLetters"
import FutureLetterModal from "../components/FutureLetterModal"
import { cargarCartasLeidas, guardarCartasLeidas } from "../data/progress"

// Floating particle
interface Particle {
  x: number; y: number; vx: number; vy: number
  r: number; opacity: number; phase: number
}

export default function FuturePage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const [leidas, setLeidas] = useState<string[]>(() => {
    const ids = new Set(futureLetters.map(l => l.id))
    return cargarCartasLeidas().filter(id => ids.has(id))
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Particle / dawn sky canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (-0.04 + Math.random() * 0.08),
        vy: -(0.05 + Math.random() * 0.12),
        r: 0.5 + Math.random() * 1.8,
        opacity: 0.1 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      }))
    }
    resize()
    window.addEventListener("resize", resize)

    const render = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = performance.now() / 1000
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width }
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        const tw = 0.5 + 0.5 * Math.sin(t * 0.8 + p.phase)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,230,255,${p.opacity * tw})`
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
    setTimeout(() => navigate("/hub"), 650)
  }

  useEffect(() => {
    guardarCartasLeidas(leidas)
  }, [leidas])

  const open = futureLetters.find(l => l.id === openId) ?? null
  const todasLeidas = leidas.length === futureLetters.length

  const abrirCarta = (id: string) => {
    setOpenId(id)
    setLeidas(prev => (prev.includes(id) ? prev : [...prev, id]))
  }

  const irAlUniverso = () => {
    setFadeOut(true)
    setTimeout(() => navigate("/universo"), 700)
  }

  return (
    <div
      className="relative w-full h-full overflow-auto"
      style={{
        background: `linear-gradient(to bottom,
          #01010a 0%,
          #040818 12%,
          #060c28 24%,
          #081438 35%,
          #0a1c4a 45%,
          #0c2858 54%,
          #103860 62%,
          #164870 68%,
          #1e5878 74%,
          #2c6880 79%,
          #4080a0 84%,
          #5898b8 88%,
          #78b4cc 92%,
          #a0ccd8 95%,
          #c8e4ec 98%,
          #e8f4f8 100%)`,
        opacity: mounted && !fadeOut ? 1 : 0,
        transition: fadeOut ? "opacity 0.65s ease" : "opacity 1.2s ease",
      }}
    >
      {/* Horizon glow — dawn light */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 100% 35% at 50% 100%, rgba(200,230,255,0.22) 0%, transparent 70%)",
        zIndex: 1,
      }} />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 25% at 50% 100%, rgba(240,248,255,0.12) 0%, transparent 100%)",
        zIndex: 1,
      }} />

      {/* Floating particles */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }} />

      {/* Back */}
      <button
        onClick={goBack}
        className="fixed"
        style={{
          top: "clamp(16px,3vh,28px)",
          left: "clamp(16px,3vw,32px)",
          zIndex: 20,
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--font-body)", fontSize: "11px",
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "rgba(180,220,255,0.35)", padding: "8px 0",
          transition: "color 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(180,220,255,0.85)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(180,220,255,0.35)")}
      >
        ← Volver
      </button>

      {/* Content */}
      <div
        className="relative flex flex-col items-center"
        style={{
          zIndex: 10,
          padding: "clamp(26px,4.5vh,48px) clamp(20px,6vw,80px) clamp(30px,5vh,52px)",
          minHeight: "100%",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(14px,2.5vh,26px)" }}>
          {/* Dawn line */}
          <div style={{
            width: "1px",
            height: "clamp(14px,2.5vh,26px)",
            background: "linear-gradient(to bottom, transparent, rgba(180,230,255,0.4))",
            margin: "0 auto clamp(8px,1.5vh,14px)",
          }} />

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(180,230,255,0.35)",
            margin: "0 0 10px",
          }}>
            Lo que está por venir
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: "400",
            fontSize: "clamp(24px,5vw,46px)",
            color: "rgba(220,240,255,0.88)",
            margin: 0,
            letterSpacing: "0.02em",
            textShadow: "0 0 60px rgba(160,220,255,0.3)",
          }}>
            Hacia el futuro
          </h1>
        </div>

        {/* Future cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(clamp(150px,22vw,220px), 1fr))",
          gap: "clamp(12px,2vw,20px)",
          width: "100%",
          maxWidth: "760px",
          marginBottom: "clamp(16px,2.5vh,28px)",
        }}>
          {futureLetters.map((letter, i) => (
            <FutureCard
              key={letter.id}
              card={letter}
              index={i}
              leida={leidas.includes(letter.id)}
              onOpen={() => abrirCarta(letter.id)}
            />
          ))}
        </div>

        {/* Closing message */}
        <div style={{
          textAlign: "center",
          maxWidth: "420px",
          width: "100%",
          borderTop: "1px solid rgba(170,215,255,0.18)",
          paddingTop: "clamp(14px,2.5vh,26px)",
        }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "rgba(196,234,255,0.75)",
            margin: "0 auto clamp(10px,1.5vh,16px)",
            boxShadow: "0 0 16px rgba(170,220,255,0.7)",
          }} />
          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(14px,1.8vw,17px)",
            color: "rgba(198,234,255,0.97)",
            lineHeight: "1.75",
            margin: 0,
            textShadow: "0 2px 16px rgba(4,14,34,0.6)",
          }}>
            Esta historia sigue escribiéndose.<br />
            <span style={{ opacity: 0.78 }}>Y yo quiero que estés en cada página.</span>
          </p>

          {todasLeidas ? (
            <button
              onClick={irAlUniverso}
              style={{
                marginTop: "clamp(14px,2.5vh,22px)",
                border: "1px solid rgba(196,232,255,0.6)",
                borderRadius: "999px",
                padding: "12px 30px",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(232,248,255,1)",
                textShadow: "0 2px 14px rgba(4,14,34,0.85), 0 0 4px rgba(4,14,34,0.5)",
                transition: "all 0.4s ease",
                animation: "homeRise 1.1s cubic-bezier(0.22,1,0.36,1) both",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "rgba(244,252,255,1)"
                e.currentTarget.style.borderColor = "rgba(190,232,255,0.85)"
                e.currentTarget.style.boxShadow = "0 0 30px rgba(150,210,255,0.35)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "rgba(232,248,255,1)"
                e.currentTarget.style.borderColor = "rgba(196,232,255,0.6)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              Sigue mirando →
            </button>
          ) : (
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(188,226,252,0.72)",
              textShadow: "0 2px 12px rgba(4,14,34,0.55)",
              marginTop: "clamp(16px,3vh,26px)",
              marginBottom: 0,
            }}>
              {leidas.length} de {futureLetters.length} cartas leídas
            </p>
          )}
        </div>
      </div>

      {/* La carta abierta */}
      {open && <FutureLetterModal letter={open} onClose={() => setOpenId(null)} />}
    </div>
  )
}

function FutureCard({
  card,
  index,
  leida,
  onOpen,
}: {
  card: FutureLetter
  index: number
  leida: boolean
  onOpen: () => void
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover
          ? `radial-gradient(ellipse at 50% 30%, ${card.color}18, rgba(4,10,28,0.9))`
          : "rgba(4,10,28,0.65)",
        border: `1px solid ${hover ? card.color + "45" : "rgba(160,210,255,0.1)"}`,
        borderRadius: "12px",
        padding: "clamp(18px,3vh,28px) clamp(14px,2vw,20px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        position: "relative",
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        transform: hover ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hover
          ? `0 16px 40px rgba(0,0,0,0.4), 0 0 24px ${card.color}20`
          : "0 4px 16px rgba(0,0,0,0.3)",
        opacity: 0,
        animation: `hubCardIn 0.55s ease ${0.08 + index * 0.08}s forwards`,
        cursor: "pointer",
        backdropFilter: "blur(4px)",
      }}
    >
      {leida && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "12px",
            fontSize: "10px",
            lineHeight: 1,
            color: card.color,
            opacity: 0.55,
          }}
        >
          ✓
        </span>
      )}
      <span style={{
        fontSize: "clamp(22px,3.5vw,30px)",
        lineHeight: 1,
        color: card.color,
        filter: hover ? `drop-shadow(0 0 8px ${card.color}80)` : "none",
        transition: "filter 0.4s ease",
      }}>
        {card.icon}
      </span>
      <p style={{
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: "clamp(12px,1.5vw,14px)",
        color: hover ? "rgba(220,240,255,0.85)" : "rgba(180,220,255,0.5)",
        textAlign: "center",
        margin: 0,
        lineHeight: "1.45",
        transition: "color 0.3s ease",
      }}>
        {card.title}
      </p>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "9px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: card.color,
          opacity: hover ? 0.7 : 0,
          transition: "opacity 0.3s ease",
          marginTop: "-2px",
        }}
      >
        {leida ? "Leída" : "Leer"}
      </span>
    </div>
  )
}
