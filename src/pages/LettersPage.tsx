import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { letters, type Letter } from "../data/letters"
import LetterModal from "../components/LetterModal"

function EnvelopeCard({ letter, onOpen }: { letter: Letter; onOpen: () => void }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hover ? "translateY(-8px)" : "translateY(0)",
      }}
    >
      {/* Envelope wrapper */}
      <div
        style={{
          position: "relative",
          paddingBottom: "66%",
          background: letter.envelopeColor,
          borderRadius: "4px",
          boxShadow: hover
            ? `0 20px 50px rgba(0,0,0,0.65), 0 0 30px ${letter.glowColor}`
            : "0 6px 24px rgba(0,0,0,0.5)",
          transition: "box-shadow 0.4s ease",
          overflow: "hidden",
        }}
      >
        {/* V-fold diagonal lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              linear-gradient(to bottom right, transparent 49.5%, rgba(0,0,0,0.06) 49.5%, rgba(0,0,0,0.06) 50.5%, transparent 50.5%),
              linear-gradient(to bottom left,  transparent 49.5%, rgba(0,0,0,0.06) 49.5%, rgba(0,0,0,0.06) 50.5%, transparent 50.5%)
            `,
          }}
        />

        {/* Top flap */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "55%",
            background: letter.flapColor,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            transformOrigin: "50% 0%",
            transform: hover ? "rotateX(-170deg)" : "rotateX(0deg)",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 3,
            perspective: "800px",
          }}
        />

        {/* Wax seal */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: `radial-gradient(circle at 38% 35%, ${letter.accentColor}ee, ${letter.accentColor}aa)`,
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.15)",
            opacity: hover ? 0 : 1,
            transition: "opacity 0.25s ease",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1 }}>✦</span>
        </div>

        {/* Letter peeking out on hover */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "10%",
            right: "10%",
            height: "60%",
            background: "linear-gradient(160deg, #f8f3e8, #f0e8d4)",
            borderRadius: "2px 2px 0 0",
            zIndex: 1,
            transform: hover ? "translateY(-14px)" : "translateY(4px)",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.05s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "11px",
              color: `rgba(${hexToRgb(letter.accentColor)},0.45)`,
              opacity: hover ? 1 : 0,
              transition: "opacity 0.3s ease 0.2s",
            }}
          >
            Abrir
          </span>
        </div>

        {/* Info */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "14px",
            right: "14px",
            zIndex: 5,
          }}
        >
          {(letter.date || letter.pages.length > 1) && (
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "9.5px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: `rgba(${hexToRgb(letter.accentColor)},0.55)`,
                marginBottom: "4px",
              }}
            >
              {letter.date ?? `${letter.pages.length} páginas`}
            </div>
          )}
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(12px, 1.8vw, 14px)",
              color: `rgba(${hexToRgb(letter.accentColor)},0.82)`,
              fontWeight: "500",
            }}
          >
            {letter.title}
          </div>
        </div>
      </div>
    </div>
  )
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

export default function LettersPage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const goBack = () => {
    setFadeOut(true)
    setTimeout(() => navigate("/"), 700)
  }

  const selected = letters.find((l) => l.id === selectedId) ?? null

  return (
    <div
      className="relative w-full h-full overflow-auto"
      style={{
        background: "#060402",
        opacity: mounted && !fadeOut ? 1 : 0,
        transition: fadeOut ? "opacity 0.7s ease" : "opacity 1s ease",
      }}
    >
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(60,35,15,0.35) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(5,3,1,0.8) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        className="relative"
        style={{ padding: "clamp(24px,4vw,40px) clamp(20px,5vw,60px) 0", zIndex: 10 }}
      >
        <button
          onClick={goBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(210,180,130,0.45)",
            padding: 0,
            transition: "color 0.3s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(210,180,130,0.85)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(210,180,130,0.45)")}
        >
          ← Volver al campo
        </button>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            color: "#f0dcc0",
            fontSize: "clamp(22px, 4vw, 38px)",
            fontWeight: "400",
            letterSpacing: "0.02em",
            margin: "clamp(20px,3vh,32px) 0 8px",
          }}
        >
          Cartas guardadas
        </h1>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            color: "rgba(205,175,130,0.45)",
            fontSize: "clamp(12px, 1.5vw, 15px)",
            margin: 0,
          }}
        >
          Cada palabra, conservada a través del tiempo.
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(200,165,100,0.2) 30%, rgba(200,165,100,0.2) 70%, transparent)",
            margin: "clamp(20px,3vh,32px) 0 0",
          }}
        />
      </div>

      {/* Letters grid */}
      <div
        className="relative"
        style={{
          padding: "clamp(24px,4vh,40px) clamp(20px,5vw,60px) clamp(40px,8vh,80px)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(160px,22vw,240px), 1fr))",
            gap: "clamp(20px,3vw,36px)",
            maxWidth: "980px",
          }}
        >
          {letters.map((letter) => (
            <EnvelopeCard
              key={letter.id}
              letter={letter}
              onOpen={() => setSelectedId(letter.id)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <LetterModal letter={selected} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
