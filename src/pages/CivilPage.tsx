import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { nicoleLetter } from "../data/letters"
import LetterModal from "../components/LetterModal"

export default function CivilPage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [sealRevealed, setSealRevealed] = useState(false)
  const [letterOpen, setLetterOpen] = useState(false)

  const letterPage = nicoleLetter.pages[0]

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const goBack = () => {
    setFadeOut(true)
    setTimeout(() => navigate("/hub"), 650)
  }

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-auto"
      style={{
        background: "#08060e",
        opacity: mounted && !fadeOut ? 1 : 0,
        transition: fadeOut ? "opacity 0.65s ease" : "opacity 1.1s ease",
      }}
    >
      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(80,55,20,0.25) 0%, transparent 70%)",
        }}
      />

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
          color: "rgba(200,175,120,0.35)",
          padding: "8px 0",
          transition: "color 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(200,175,120,0.85)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,175,120,0.35)")}
      >
        ← Volver
      </button>

      {/* Document */}
      <div
        className="relative"
        style={{
          width: "min(560px, 90vw)",
          margin: "clamp(60px,10vh,80px) auto",
          zIndex: 10,
        }}
      >
        {/* Outer envelope/holder */}
        <div
          style={{
            background: "linear-gradient(145deg, #2a1e0e, #1c1408)",
            border: "1px solid rgba(200,165,90,0.18)",
            borderRadius: "8px",
            padding: "clamp(24px,4vw,40px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(120,80,30,0.1)",
          }}
        >
          {/* Document */}
          <div
            style={{
              background: "linear-gradient(160deg, #f8f2e4 0%, #f2e8d0 50%, #ece0c4 100%)",
              borderRadius: "4px",
              padding: "clamp(28px,5vw,48px) clamp(24px,4vw,44px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative corner flourishes */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map(pos => (
              <div
                key={pos}
                style={{
                  position: "absolute",
                  [pos.includes("top") ? "top" : "bottom"]: "12px",
                  [pos.includes("left") ? "left" : "right"]: "12px",
                  width: "32px",
                  height: "32px",
                  borderTop: pos.includes("top") ? "1.5px solid rgba(140,100,40,0.4)" : "none",
                  borderBottom: pos.includes("bottom") ? "1.5px solid rgba(140,100,40,0.4)" : "none",
                  borderLeft: pos.includes("left") ? "1.5px solid rgba(140,100,40,0.4)" : "none",
                  borderRight: pos.includes("right") ? "1.5px solid rgba(140,100,40,0.4)" : "none",
                }}
              />
            ))}

            {/* Header ornament */}
            <div style={{ textAlign: "center", marginBottom: "clamp(16px,3vh,24px)" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "rgba(100,70,25,0.45)",
                  fontSize: "11px",
                  letterSpacing: "0.35em",
                  fontFamily: "var(--font-body)",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ flex: 1, height: "1px", background: "rgba(140,100,40,0.3)", width: "40px", display: "block" }} />
                ✦
                <span style={{ flex: 1, height: "1px", background: "rgba(140,100,40,0.3)", width: "40px", display: "block" }} />
              </div>
            </div>

            {/* Title */}
            <div style={{ textAlign: "center", marginBottom: "clamp(18px,3vh,28px)" }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: "400",
                  fontSize: "clamp(18px,3vw,26px)",
                  color: "#5a3a12",
                  margin: "0 0 6px",
                  letterSpacing: "0.05em",
                }}
              >
                Una carta especial
              </h1>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(12px,1.5vw,14px)",
                  color: "rgba(100,65,20,0.55)",
                  margin: 0,
                }}
              >
                {letterPage ? "Tómate tu tiempo para leerla" : "Para ser escrita con calma"}
              </p>
            </div>

            {/* La carta */}
            <div style={{ marginBottom: "clamp(18px,3vh,28px)" }}>
              {letterPage ? (
                <div
                  onClick={() => setLetterOpen(true)}
                  title="Haz clic para verla en grande"
                  style={{
                    cursor: "zoom-in",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {/* Entera y de una sola pieza: se ajusta al alto de la
                      ventana en vez de estirar la página hacia abajo. */}
                  <img
                    src={letterPage}
                    alt={nicoleLetter.title}
                    decoding="async"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "58vh",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      display: "block",
                      borderRadius: "3px",
                      boxShadow: "0 6px 22px rgba(80,55,20,0.22)",
                    }}
                  />
                </div>
              ) : (
                Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    style={{
                      height: "1px",
                      background: "rgba(140,100,40,0.15)",
                      marginBottom: "clamp(16px,2.8vh,22px)",
                      position: "relative",
                    }}
                  >
                    {i === 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-10px",
                          left: "0",
                          fontFamily: "var(--font-display)",
                          fontStyle: "italic",
                          fontSize: "13px",
                          color: "rgba(100,65,20,0.35)",
                        }}
                      >
                        Esta carta está siendo escrita para ti...
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Wax seal - clickable */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                onClick={() => setSealRevealed(r => !r)}
                style={{
                  cursor: "pointer",
                  position: "relative",
                  display: "inline-block",
                }}
                title="Haz clic en el sello"
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 38% 35%, #a04030ee, #6b2018aa)",
                    boxShadow: "0 3px 12px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,200,150,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    transform: sealRevealed ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  <span style={{ color: "rgba(255,220,180,0.8)", fontSize: "20px", lineHeight: 1 }}>
                    {sealRevealed ? "♡" : "✦"}
                  </span>
                </div>
                {sealRevealed && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "calc(100% + 10px)",
                      right: 0,
                      background: "linear-gradient(135deg, #f5ecd4, #ede0be)",
                      border: "1px solid rgba(140,100,40,0.2)",
                      borderRadius: "6px",
                      padding: "10px 14px",
                      width: "180px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                        fontSize: "12px",
                        color: "#6b4020",
                        margin: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      {letterPage
                        ? "Escrita a mano, guardada para ti."
                        : "Pronto estas líneas tendrán palabras tuyas."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* La carta en grande */}
      {letterOpen && (
        <LetterModal letter={nicoleLetter} onClose={() => setLetterOpen(false)} />
      )}
    </div>
  )
}
