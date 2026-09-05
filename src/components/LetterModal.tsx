import { useEffect, useState } from "react"
import type { Letter } from "../data/letters"

interface Props {
  letter: Letter
  onClose: () => void
}

/** Alto que puede ocupar la carta sin salirse de la ventana. */
const LETTER_MAX_HEIGHT = "72vh"

export default function LetterModal({ letter, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [page, setPage] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  /** Ancho/alto de la página actual; se conoce al cargar la imagen. */
  const [ratio, setRatio] = useState<number | null>(null)

  /** Cambiar de página reinicia la ampliación y la proporción medida. */
  const goToPage = (next: number) => {
    setPage(next)
    setZoomed(false)
    setRatio(null)
  }

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    setVisible(false)
    setTimeout(onClose, 400)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight" && page < letter.pages.length - 1) goToPage(page + 1)
      if (e.key === "ArrowLeft" && page > 0) goToPage(page - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [page, letter.pages.length])

  const hasPages = letter.pages.length > 0
  const isVideo = letter.isVideo === true
  const isHtml = typeof letter.html === "string" && letter.html.length > 0
  const canZoom = hasPages && !isVideo

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 100,
        background: `rgba(4,2,10,${visible ? 0.88 : 0})`,
        backdropFilter: visible ? "blur(8px)" : "blur(0px)",
        transition: "all 0.4s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div
        style={{
          position: "relative",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
          transition: "all 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
          maxWidth: zoomed
            ? "95vw"
            : isHtml
              ? "860px"
              : ratio
                ? `min(680px, calc(${LETTER_MAX_HEIGHT} * ${ratio}))`
                : "680px",
          // El video no se amplía, se ve completo desde el principio.
          width: "90vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close */}
        <button
          onClick={close}
          style={{
            position: "absolute",
            top: "-40px",
            right: "0",
            background: "none",
            border: "none",
            color: "rgba(240,215,175,0.6)",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(240,215,175,1)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,215,175,0.6)")}
        >
          ✕ Cerrar
        </button>

        {/* Letter header */}
        <div
          style={{
            padding: "16px 24px 12px",
            background: "rgba(20,14,8,0.7)",
            borderRadius: "6px 6px 0 0",
            borderBottom: "1px solid rgba(200,170,110,0.12)",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                color: "#f0d8a8",
                fontSize: "clamp(16px, 2.5vw, 22px)",
                fontWeight: "400",
                margin: 0,
              }}
            >
              {letter.title}
            </h2>
            {letter.date && (
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  color: "rgba(210,180,130,0.5)",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {letter.date}
              </span>
            )}
          </div>
          {hasPages && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                color: "rgba(210,180,130,0.45)",
                fontSize: "11px",
                letterSpacing: "0.12em",
              }}
            >
              {page + 1} / {letter.pages.length}
            </span>
          )}
        </div>

        {/* Letter body.
            Sin ampliar, la carta entra completa: se ajusta al alto disponible
            en lugar de ocupar todo el ancho y quedar cortada por abajo.
            Al ampliarla pasa a ancho completo y se puede recorrer. */}
        <div
          style={{
            background: "rgba(14,10,6,0.85)",
            borderRadius: "0 0 6px 6px",
            maxHeight: LETTER_MAX_HEIGHT,
            overflowY: isHtml || !zoomed ? "hidden" : "auto",
            overflowX: "hidden",
            cursor: canZoom ? (zoomed ? "zoom-out" : "zoom-in") : "default",
          }}
          onClick={() => { if (canZoom) setZoomed(z => !z) }}
        >
          {isHtml ? (
            <iframe
              title={letter.title}
              srcDoc={letter.html}
              style={{
                width: "100%",
                height: "min(72vh, 900px)",
                border: "none",
                display: "block",
                background: "#fff5f7",
              }}
            />
          ) : isVideo ? (
            <video
              key={letter.pages[page]}
              src={letter.pages[page]}
              controls
              playsInline
              preload="metadata"
              style={{ width: "100%", display: "block", maxHeight: LETTER_MAX_HEIGHT }}
            />
          ) : hasPages ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                // Al ampliar se ancla arriba: centrarla escondería el
                // principio de la carta fuera del área que se puede recorrer.
                alignItems: zoomed ? "flex-start" : "center",
                minHeight: zoomed ? undefined : LETTER_MAX_HEIGHT,
              }}
            >
              <img
                src={letter.pages[page]}
                alt={`${letter.title} — página ${page + 1}`}
                decoding="async"
                onLoad={e => {
                  const img = e.currentTarget
                  if (img.naturalHeight > 0) setRatio(img.naturalWidth / img.naturalHeight)
                }}
                style={zoomed
                  ? { width: "100%", height: "auto", display: "block" }
                  : {
                      maxWidth: "100%",
                      maxHeight: LETTER_MAX_HEIGHT,
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      display: "block",
                    }}
              />
            </div>
          ) : (
            <PlaceholderLetter letter={letter} />
          )}
        </div>

        {/* Pista de ampliación */}
        {canZoom && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(210,180,130,0.3)",
              textAlign: "center",
              margin: "10px 0 0",
            }}
          >
            {zoomed ? "Clic para verla completa" : "Clic para ampliar"}
          </p>
        )}

        {/* Page navigation */}
        {letter.pages.length > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              marginTop: "16px",
            }}
          >
            <NavButton disabled={page === 0} onClick={() => goToPage(page - 1)} label="←" />
            <div style={{ display: "flex", gap: "6px" }}>
              {letter.pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: i === page ? "rgba(240,200,130,0.8)" : "rgba(240,200,130,0.25)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </div>
            <NavButton disabled={page === letter.pages.length - 1} onClick={() => goToPage(page + 1)} label="→" />
          </div>
        )}
      </div>
    </div>
  )
}

function NavButton({ onClick, disabled, label }: { onClick: () => void; disabled: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "none",
        border: "1px solid rgba(200,170,110,0.2)",
        color: disabled ? "rgba(200,170,110,0.2)" : "rgba(200,170,110,0.7)",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        cursor: disabled ? "default" : "pointer",
        fontFamily: "var(--font-body)",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  )
}

function PlaceholderLetter({ letter }: { letter: Letter }) {
  return (
    <div
      style={{
        padding: "40px 48px 60px",
        minHeight: "380px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "linear-gradient(160deg, #faf5ec 0%, #f5edd8 50%, #f0e4c8 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Parchment texture lines */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "48px",
            right: "48px",
            top: `${80 + i * 28}px`,
            height: "1px",
            background: "rgba(150,120,70,0.1)",
          }}
        />
      ))}

      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: letter.accentColor,
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.7,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "18px" }}>✦</span>
        </div>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "rgba(80,55,25,0.6)",
            lineHeight: "1.7",
            maxWidth: "320px",
            margin: "0 auto 16px",
          }}
        >
          {letter.description || "Una carta guardada a través del tiempo."}
        </p>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(120,85,40,0.35)",
            marginTop: "32px",
          }}
        >
          Imagen de la carta pendiente de añadir
        </p>
      </div>
    </div>
  )
}
