import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { timeline } from "../data/timeline"

// ── Starfield canvas with warp effect ──────────────────────────────────────

interface Star {
  x: number
  y: number
  z: number          // depth 0-1, smaller = farther
  opacity: number
  phase: number
}

function useStarfield(warpRef: React.MutableRefObject<number>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let stars: Star[] = []
    let raf = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      stars = Array.from({ length: 280 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: 0.15 + Math.random() * 0.85,
        opacity: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    resize()
    window.addEventListener("resize", resize)

    let lastTime = 0

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      const t = now / 1000

      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const warp = warpRef.current

      for (const s of stars) {
        const twinkle = 0.65 + 0.35 * Math.sin(t * s.z * 1.5 + s.phase)
        const alpha = s.opacity * twinkle
        const r = s.z * 1.6

        if (warp > 0.01) {
          // Warp: elongate stars into streaks from center
          const cx = canvas.width / 2
          const cy = canvas.height / 2
          const dx = s.x - cx
          const dy = s.y - cy
          const len = Math.sqrt(dx * dx + dy * dy)
          const stretch = warp * s.z * 60
          const nx = len > 0 ? dx / len : 0
          const ny = len > 0 ? dy / len : 0

          ctx.beginPath()
          ctx.moveTo(s.x, s.y)
          ctx.lineTo(s.x + nx * stretch, s.y + ny * stretch)
          ctx.strokeStyle = `rgba(220,235,255,${alpha * (0.4 + warp * 0.6)})`
          ctx.lineWidth = r * 0.8
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(220,235,255,${alpha})`
          ctx.fill()
        }
      }

      // Occasional shooting star
      raf = requestAnimationFrame(render)
    }

    raf = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [warpRef])

  return canvasRef
}

// ── Forget-me-not SVG decoration ──────────────────────────────────────────

function ForgetMeNot({ color, size = 32 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        const px = 16 + Math.cos(a) * 8
        const py = 16 + Math.sin(a) * 8
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={5}
            ry={5}
            fill={color}
            opacity={0.82}
            style={{ transformOrigin: `${px}px ${py}px` }}
          />
        )
      })}
      <circle cx={16} cy={16} r={4} fill="rgba(255,255,255,0.9)" />
      <circle cx={16} cy={16} r={2.5} fill="#f5d464" />
    </svg>
  )
}

// ── Timeline node strip ────────────────────────────────────────────────────

function TimelineStrip({
  current,
  total,
  onGoTo,
  color,
}: {
  current: number
  total: number
  onGoTo: (i: number) => void
  color: string
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        position: "relative",
      }}
    >
      {timeline.map((ev, i) => (
        <div key={ev.id} style={{ display: "flex", alignItems: "center" }}>
          {/* Connecting line */}
          {i > 0 && (
            <div
              style={{
                width: "clamp(12px, 2.5vw, 28px)",
                height: "1px",
                background: i <= current
                  ? `linear-gradient(to right, ${timeline[i - 1].color}, ${ev.color})`
                  : "rgba(255,255,255,0.1)",
                transition: "background 0.6s ease",
              }}
            />
          )}
          {/* Node */}
          <button
            onClick={() => onGoTo(i)}
            title={ev.shortDate}
            style={{
              width: i === current ? "10px" : "6px",
              height: i === current ? "10px" : "6px",
              borderRadius: "50%",
              border: `1px solid ${i <= current ? ev.color : "rgba(255,255,255,0.2)"}`,
              background: i < current
                ? ev.color
                : i === current
                ? ev.color
                : "transparent",
              boxShadow: i === current ? `0 0 10px ${ev.color}, 0 0 20px ${ev.color}60` : "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.4s ease",
              flexShrink: 0,
            }}
          />
        </div>
      ))}
    </div>
  )
}

// ── Helper components (must be before ExperiencePage) ─────────────────────

function ContinuarButton({ onClick, color }: { onClick: () => void; color: string }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "none",
        border: `1px solid ${hover ? color + "cc" : color + "55"}`,
        borderRadius: "24px",
        padding: "0 clamp(14px,2.5vw,22px)",
        height: "clamp(36px,5vw,44px)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        fontSize: "11px",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: hover ? color : color + "99",
        transition: "all 0.3s ease",
        boxShadow: hover ? `0 0 20px ${color}40` : "none",
        whiteSpace: "nowrap",
      }}
    >
      Continuar →
    </button>
  )
}

function NavArrow({
  direction,
  disabled,
  onClick,
  color,
}: {
  direction: "left" | "right"
  disabled: boolean
  onClick: () => void
  color: string
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "none",
        border: `1px solid ${disabled ? "rgba(255,255,255,0.08)" : hover ? color + "80" : "rgba(255,255,255,0.15)"}`,
        borderRadius: "50%",
        width: "clamp(36px,5vw,44px)",
        height: "clamp(36px,5vw,44px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? "rgba(255,255,255,0.12)" : hover ? color : "rgba(255,255,255,0.4)",
        fontSize: "16px",
        transition: "all 0.3s ease",
        boxShadow: !disabled && hover ? `0 0 16px ${color}40` : "none",
      }}
    >
      {direction === "left" ? "←" : "→"}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ExperiencePage() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<"fwd" | "bwd">("fwd")
  const [transitioning, setTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [continuara, setContinuara] = useState(false)
  const warpRef = useRef(0)
  const warpAnimRef = useRef(0)

  const canvasRef = useStarfield(warpRef)

  const event = timeline[current]

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const goBack = () => {
    setFadeOut(true)
    setTimeout(() => navigate("/"), 700)
  }

  const handleContinuar = () => {
    if (current === timeline.length - 1) {
      setContinuara(true)
      setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => navigate("/hub"), 700)
      }, 3800)
    } else {
      goTo(current + 1)
    }
  }

  const triggerWarp = () => {
    cancelAnimationFrame(warpAnimRef.current)
    warpRef.current = 0
    let start = 0
    const animate = (t: number) => {
      if (!start) start = t
      const elapsed = (t - start) / 1000
      // ramp up 0→1 in 0.15s then down 1→0 in 0.25s
      if (elapsed < 0.15) {
        warpRef.current = elapsed / 0.15
      } else if (elapsed < 0.4) {
        warpRef.current = 1 - (elapsed - 0.15) / 0.25
      } else {
        warpRef.current = 0
        return
      }
      warpAnimRef.current = requestAnimationFrame(animate)
    }
    warpAnimRef.current = requestAnimationFrame(animate)
  }

  const goTo = (idx: number) => {
    if (transitioning || idx === current || idx < 0 || idx >= timeline.length) return
    setDirection(idx > current ? "fwd" : "bwd")
    setTransitioning(true)
    triggerWarp()
    setTimeout(() => {
      setCurrent(idx)
      setTransitioning(false)
    }, 380)
  }

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(current + 1)
      if (e.key === "ArrowLeft") goTo(current - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [current, transitioning])

  // Touch/swipe
  const touchStartX = useRef(0)
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX
    if (dx > 50) goTo(current + 1)
    if (dx < -50) goTo(current - 1)
  }

  const slideOffset = transitioning
    ? direction === "fwd" ? "-4%" : "4%"
    : "0%"

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: "#02010c",
        opacity: mounted && !fadeOut ? 1 : 0,
        transition: fadeOut ? "opacity 0.7s ease" : "opacity 1s ease",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Starfield */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Ambient color glow from current event */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${event.color}14 0%, transparent 70%)`,
          transition: "background 0.8s ease",
          zIndex: 2,
        }}
      />

      {/* Back button */}
      <button
        onClick={goBack}
        className="absolute"
        style={{
          top: "clamp(16px,3vh,28px)",
          left: "clamp(16px,3vw,32px)",
          zIndex: 30,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(200,175,140,0.4)",
          padding: "8px 0",
          transition: "color 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(200,175,140,0.85)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,175,140,0.4)")}
      >
        ← Campo
      </button>

      {/* Step counter — top right */}
      <div
        className="absolute"
        style={{
          top: "clamp(16px,3vh,28px)",
          right: "clamp(16px,3vw,32px)",
          zIndex: 30,
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          letterSpacing: "0.3em",
          color: "rgba(200,175,140,0.35)",
        }}
      >
        {String(current + 1).padStart(2, "0")} / {String(timeline.length).padStart(2, "0")}
      </div>

      {/* Memory card — center */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ zIndex: 20, padding: "clamp(60px,10vh,100px) clamp(20px,8vw,120px)" }}
      >
        <div
          style={{
            opacity: transitioning ? 0 : 1,
            transform: `translateX(${slideOffset})`,
            transition: transitioning
              ? "opacity 0.35s ease, transform 0.35s ease"
              : "opacity 0.45s ease 0.05s, transform 0.45s cubic-bezier(0.4,0,0.2,1) 0.05s",
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(12px,2.5vh,22px)",
          }}
        >
          {/* Flower + date */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
            <ForgetMeNot color={event.color} size={event.isLast ? 40 : 28} />

            {/* Date */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(9px, 1.2vw, 11px)",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: `${event.color}cc`,
                  transition: "color 0.6s ease",
                }}
              >
                {event.date}
              </span>
            </div>
          </div>

          {/* Giant faded step number in background */}
          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(80px,18vw,200px)",
                fontWeight: "600",
                color: `${event.color}08`,
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                transition: "color 0.6s ease",
              }}
            >
              {event.id}
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: "400",
                fontSize: "clamp(22px, 4.5vw, 46px)",
                color: event.isLast ? event.color : "#f0ddc0",
                lineHeight: "1.25",
                margin: 0,
                position: "relative",
                textShadow: event.isLast
                  ? `0 0 60px ${event.color}60`
                  : "0 0 40px rgba(200,140,60,0.2)",
                transition: "color 0.6s ease",
                padding: "clamp(28px,5vw,50px) 0 clamp(14px,2.5vw,24px)",
              }}
            >
              {event.title}
            </h2>
          </div>

          {/* Divider */}
          <div
            style={{
              width: "40px",
              height: "1px",
              background: `linear-gradient(to right, transparent, ${event.color}80, transparent)`,
              transition: "background 0.6s ease",
            }}
          />

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: "300",
              fontSize: "clamp(13px, 1.8vw, 16px)",
              color: "rgba(220,200,170,0.65)",
              lineHeight: "1.85",
              maxWidth: "480px",
              margin: 0,
            }}
          >
            {event.description}
          </p>

          {/* Special ending message */}
          {event.isLast && (
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(12px, 1.5vw, 14px)",
                color: `${event.color}aa`,
                letterSpacing: "0.08em",
                marginTop: "8px",
              }}
            >
              Y desde ahí, ya nada fue igual.
            </p>
          )}
        </div>
      </div>

      {/* Continuará overlay */}
      {continuara && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex: 50,
            background: "rgba(2,1,12,0)",
            animation: "continuaraFadeIn 0.8s ease forwards",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "clamp(28px, 5vw, 52px)",
                color: "rgba(240,220,180,0)",
                letterSpacing: "0.06em",
                animation: "continuaraText 0.9s ease 0.4s forwards",
              }}
            >
              Continuará...
            </p>
            <div
              style={{
                width: "0px",
                height: "1px",
                background: "rgba(240,180,80,0.5)",
                margin: "20px auto 0",
                animation: "continuaraLine 1.5s ease 0.8s forwards",
              }}
            />
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col items-center"
        style={{
          zIndex: 30,
          padding: "0 clamp(16px,4vw,48px) clamp(20px,4vh,36px)",
          gap: "clamp(14px,2.5vh,22px)",
        }}
      >
        {/* Timeline strip */}
        <TimelineStrip
          current={current}
          total={timeline.length}
          onGoTo={goTo}
          color={event.color}
        />

        {/* Arrows */}
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(20px,4vw,40px)" }}>
          <NavArrow
            direction="left"
            disabled={current === 0}
            onClick={() => goTo(current - 1)}
            color={event.color}
          />

          {/* Short title of next event */}
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(200,175,140,0.3)",
              minWidth: "120px",
              textAlign: "center",
            }}
          >
            {current < timeline.length - 1 ? timeline[current + 1].shortDate : "Fin del viaje"}
          </div>

          {current === timeline.length - 1 ? (
            <ContinuarButton onClick={handleContinuar} color={event.color} />
          ) : (
            <NavArrow
              direction="right"
              disabled={false}
              onClick={() => goTo(current + 1)}
              color={event.color}
            />
          )}
        </div>
      </div>
    </div>
  )
}

