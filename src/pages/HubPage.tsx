import { useEffect, useState, type ReactElement } from "react"
import { useNavigate } from "react-router-dom"

function PancitoSVG() {
  return (
    <svg viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg" width="64" height="56">
      {/* Shadow */}
      <ellipse cx="40" cy="64" rx="24" ry="7" fill="#b86010" opacity="0.3" />
      {/* Bottom bun */}
      <rect x="14" y="48" width="52" height="14" rx="7" fill="#e8902a" />
      {/* Top dome */}
      <path d="M14 54 Q14 14 40 14 Q66 14 66 54 Z" fill="#f4a843" />
      {/* Sheen */}
      <ellipse cx="33" cy="26" rx="9" ry="5.5" fill="rgba(255,255,200,0.28)" transform="rotate(-18,33,26)" />
      {/* Score lines */}
      <path d="M22 42 Q40 32 58 42" stroke="#d47818" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />
      <path d="M28 34 Q40 46 52 34" stroke="#d47818" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.65" />
    </svg>
  )
}

function CivilSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="60" height="60">
      {/* Document body */}
      <rect x="12" y="8" width="56" height="68" rx="5" fill="#f0e6d0" />
      {/* Header band */}
      <rect x="12" y="8" width="56" height="14" rx="5" fill="#d8c8a0" />
      <rect x="12" y="16" width="56" height="6" fill="#d8c8a0" />
      {/* Lines */}
      <rect x="20" y="32" width="40" height="2" rx="1" fill="#b8a070" opacity="0.7" />
      <rect x="20" y="40" width="40" height="2" rx="1" fill="#b8a070" opacity="0.7" />
      <rect x="20" y="48" width="28" height="2" rx="1" fill="#b8a070" opacity="0.7" />
      {/* Wax seal */}
      <circle cx="56" cy="62" r="11" fill="#8b3a3a" opacity="0.85" />
      <circle cx="56" cy="62" r="8" fill="none" stroke="rgba(255,210,170,0.45)" strokeWidth="1.5" />
      <text x="56" y="66" textAnchor="middle" fontSize="8" fill="rgba(255,220,180,0.8)" fontFamily="serif">✦</text>
    </svg>
  )
}

function AbayomiSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="62" height="62">
      {/* Main circle frame */}
      <circle cx="40" cy="40" r="26" fill="#ede0f4" />
      {/* Person silhouette */}
      <circle cx="40" cy="31" r="10" fill="#c898e8" />
      <ellipse cx="40" cy="55" rx="15" ry="11" fill="#c898e8" />
      {/* Floral decorations */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2
        const r = 31
        return (
          <circle
            key={i}
            cx={40 + Math.cos(a) * r}
            cy={40 + Math.sin(a) * r}
            r="4.5"
            fill="#d8a8f0"
            opacity="0.75"
          />
        )
      })}
      {/* Center flowers */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2
        const r = 31
        return (
          <circle
            key={i + 8}
            cx={40 + Math.cos(a) * r}
            cy={40 + Math.sin(a) * r}
            r="1.8"
            fill="#f5d0f8"
            opacity="0.9"
          />
        )
      })}
      <circle cx="40" cy="40" r="26" fill="none" stroke="#d4a0e8" strokeWidth="1.5" opacity="0.6" />
    </svg>
  )
}

interface HubCard {
  id: string
  route: string
  label: string
  subtitle: string
  color: string
  glowColor: string
  Icon: () => ReactElement
}

const cards: HubCard[] = [
  {
    id: "pancito",
    route: "/pancito",
    label: "Pancito",
    subtitle: "Cositas lindas que veo en ti",
    color: "#f4a843",
    glowColor: "rgba(244,168,67,0.3)",
    Icon: PancitoSVG,
  },
  {
    id: "civil",
    route: "/civil",
    label: "Nicole",
    subtitle: "Algo escrito solo para ti",
    color: "#c8a870",
    glowColor: "rgba(200,168,112,0.3)",
    Icon: CivilSVG,
  },
  {
    id: "abayomi",
    route: "/abayomi",
    label: "Abayomi",
    subtitle: "Un rincón solo tuyo",
    color: "#c898e8",
    glowColor: "rgba(200,152,232,0.3)",
    Icon: AbayomiSVG,
  },
]

export default function HubPage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const goTo = (route: string) => {
    setFadeOut(true)
    setTimeout(() => navigate(route), 650)
  }

  const goBack = () => {
    setFadeOut(true)
    setTimeout(() => navigate("/experiencia"), 650)
  }

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "#030110",
        opacity: mounted && !fadeOut ? 1 : 0,
        transition: fadeOut ? "opacity 0.65s ease" : "opacity 1.1s ease",
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(40,20,80,0.5) 0%, transparent 70%)",
        }}
      />

      {/* Subtle stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${0.8 + Math.random() * 1.4}px`,
              height: `${0.8 + Math.random() * 1.4}px`,
              background: "rgba(220,230,255,0.6)",
              opacity: 0.2 + Math.random() * 0.5,
              animation: `twinkleHub ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Back */}
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
          color: "rgba(200,175,140,0.35)",
          padding: "8px 0",
          transition: "color 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(200,175,140,0.85)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,175,140,0.35)")}
      >
        ← Volver
      </button>

      {/* Title */}
      <div
        className="relative text-center"
        style={{ zIndex: 10, marginBottom: "clamp(32px,6vh,56px)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(200,175,140,0.35)",
            marginBottom: "10px",
          }}
        >
          Como te veo
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: "400",
            fontSize: "clamp(22px,4vw,38px)",
            color: "rgba(240,220,185,0.85)",
            margin: 0,
            letterSpacing: "0.02em",
          }}
        >
          Tus rincones
        </h1>
      </div>

      {/* Cards */}
      <div
        className="relative flex items-stretch justify-center"
        style={{
          zIndex: 10,
          gap: "clamp(16px,3vw,32px)",
          flexWrap: "wrap",
          padding: "0 clamp(16px,4vw,40px)",
          maxWidth: "860px",
          width: "100%",
        }}
      >
        {cards.map((card, i) => (          <button
            key={card.id}
            onClick={() => goTo(card.route)}
            onMouseEnter={() => setHovered(card.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === card.id
                ? `radial-gradient(ellipse at 50% 30%, ${card.color}18, rgba(10,6,24,0.95))`
                : "rgba(10,6,24,0.85)",
              border: `1px solid ${hovered === card.id ? card.color + "55" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "16px",
              padding: "clamp(24px,4vh,40px) clamp(20px,3vw,32px)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(12px,2vh,18px)",
              minWidth: "clamp(140px,22vw,200px)",
              flex: "1 1 160px",
              maxWidth: "220px",
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              transform: hovered === card.id ? "translateY(-8px)" : "translateY(0)",
              boxShadow: hovered === card.id
                ? `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${card.glowColor}`
                : "0 4px 20px rgba(0,0,0,0.3)",
              opacity: 0,
              animation: `hubCardIn 0.6s ease ${0.1 + i * 0.12}s forwards`,
            }}
          >
            {/* Icon area */}
            <div
              style={{
                width: "clamp(80px,12vw,100px)",
                height: "clamp(80px,12vw,100px)",
                borderRadius: "50%",
                background: hovered === card.id
                  ? `radial-gradient(circle, ${card.color}22, transparent 70%)`
                  : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.4s ease",
                border: `1px solid ${hovered === card.id ? card.color + "30" : "rgba(255,255,255,0.05)"}`,
              }}
            >
              <card.Icon />
            </div>

            {/* Label */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(16px,2.2vw,20px)",
                  color: hovered === card.id ? card.color : "rgba(235,215,175,0.8)",
                  transition: "color 0.3s ease",
                  marginBottom: "5px",
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  letterSpacing: "0.05em",
                  color: "rgba(200,175,140,0.38)",
                  lineHeight: "1.4",
                }}
              >
                {card.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Hacia el futuro */}
      <FuturoLink onGo={() => goTo("/futuro")} />
    </div>
  )
}

function FuturoLink({ onGo }: { onGo: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      className="relative flex flex-col items-center"
      style={{ marginTop: "clamp(28px,5vh,48px)", zIndex: 10 }}
    >
      {/* Connector line */}
      <div style={{
        width: "1px",
        height: "clamp(24px,4vh,36px)",
        background: "linear-gradient(to bottom, transparent, rgba(180,220,255,0.2))",
        marginBottom: "14px",
      }} />

      <button
        onClick={onGo}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          padding: "8px 24px",
          transition: "all 0.4s ease",
          transform: hover ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Glow orb */}
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: `1px solid rgba(160,210,255,${hover ? 0.45 : 0.18})`,
          background: hover
            ? "radial-gradient(circle, rgba(120,190,255,0.15), transparent)"
            : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: hover ? "0 0 28px rgba(130,200,255,0.25)" : "none",
          transition: "all 0.4s ease",
          marginBottom: "2px",
        }}>
          <span style={{
            fontSize: "18px",
            color: `rgba(160,215,255,${hover ? 0.9 : 0.4})`,
            transition: "color 0.4s ease",
            lineHeight: 1,
          }}>→</span>
        </div>
        <span style={{
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: `rgba(160,215,255,${hover ? 0.7 : 0.28})`,
          transition: "color 0.4s ease",
        }}>
          Hacia el futuro
        </span>
      </button>
    </div>
  )
}
