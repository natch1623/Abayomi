import { useEffect, useState } from "react"
import { revealImage, type FrameKind, type FutureEnvelope, type FutureLetter } from "../data/futureLetters"

/* ── Marcos ──────────────────────────────────────────────────────────
   Seis adornos distintos, uno por carta. Cada uno se dibuja por encima
   del contenido sin capturar clics, así que la carta se sigue leyendo
   y desplazando con normalidad.                                        */

function Flourish({ color }: { color: string }) {
  // Voluta de esquina; se rota para las otras tres.
  const curl = (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path
        d="M25 1H8C4.13 1 1 4.13 1 8v17"
        stroke={color}
        strokeOpacity="0.5"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M13 4c-4 0-9 4-9 9"
        stroke={color}
        strokeOpacity="0.28"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="4" cy="4" r="1.4" fill={color} fillOpacity="0.45" />
    </svg>
  )
  const corners: [string, string][] = [
    ["top-left", "rotate(0deg)"],
    ["top-right", "rotate(90deg)"],
    ["bottom-right", "rotate(180deg)"],
    ["bottom-left", "rotate(270deg)"],
  ]
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1px solid ${color}30`,
          borderRadius: "16px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "7px",
          border: `1px solid ${color}16`,
          borderRadius: "11px",
          pointerEvents: "none",
        }}
      />
      {corners.map(([pos, rot]) => (
        <div
          key={pos}
          style={{
            position: "absolute",
            [pos.includes("top") ? "top" : "bottom"]: "-1px",
            [pos.includes("left") ? "left" : "right"]: "-1px",
            transform: rot,
            transformOrigin: "center",
            lineHeight: 0,
            pointerEvents: "none",
          }}
        >
          {curl}
        </div>
      ))}
    </>
  )
}

function Arrows({ color }: { color: string }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1px dashed ${color}45`,
          borderRadius: "5px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "9px",
          border: `1px dotted ${color}1e`,
          borderRadius: "2px",
          pointerEvents: "none",
        }}
      />
      {/* Puntas que empujan hacia adelante, a media altura */}
      {(["left", "right"] as const).map(side => (
        <span
          key={side}
          style={{
            position: "absolute",
            [side]: "-7px",
            top: "50%",
            transform: "translateY(-50%)",
            color,
            opacity: 0.6,
            fontSize: "13px",
            lineHeight: 1,
            background: "rgba(4,10,28,0.95)",
            padding: "3px 0",
            pointerEvents: "none",
          }}
        >
          ›
        </span>
      ))}
    </>
  )
}

function Dissolve({ color }: { color: string }) {
  // Sin esquinas: los cuatro filetes se apagan antes de tocarse.
  const bar = (extra: React.CSSProperties, dir: string) => (
    <div
      style={{
        position: "absolute",
        background: `linear-gradient(${dir}, transparent 0%, ${color}55 28%, ${color}55 72%, transparent 100%)`,
        pointerEvents: "none",
        ...extra,
      }}
    />
  )
  return (
    <>
      {bar({ top: 0, left: 0, right: 0, height: "1px" }, "to right")}
      {bar({ bottom: 0, left: 0, right: 0, height: "1px" }, "to right")}
      {bar({ top: 0, bottom: 0, left: 0, width: "1px" }, "to bottom")}
      {bar({ top: 0, bottom: 0, right: 0, width: "1px" }, "to bottom")}
      <div
        style={{
          position: "absolute",
          inset: "-14px",
          borderRadius: "20px",
          boxShadow: `inset 0 0 40px ${color}12`,
          pointerEvents: "none",
        }}
      />
    </>
  )
}

function Brackets({ color }: { color: string }) {
  const corners: [string, string][] = [
    ["top-left", "borderTop borderLeft"],
    ["top-right", "borderTop borderRight"],
    ["bottom-left", "borderBottom borderLeft"],
    ["bottom-right", "borderBottom borderRight"],
  ]
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1px solid ${color}12`,
          borderRadius: "3px",
          pointerEvents: "none",
        }}
      />
      {corners.map(([pos, sides]) => {
        const s = sides.split(" ")
        return (
          <div
            key={pos}
            style={{
              position: "absolute",
              [pos.includes("top") ? "top" : "bottom"]: "-1px",
              [pos.includes("left") ? "left" : "right"]: "-1px",
              width: "30px",
              height: "30px",
              [s[0]]: `2px solid ${color}70`,
              [s[1]]: `2px solid ${color}70`,
              borderRadius: pos === "top-left" ? "3px 0 0 0"
                : pos === "top-right" ? "0 3px 0 0"
                : pos === "bottom-left" ? "0 0 0 3px"
                : "0 0 3px 0",
              pointerEvents: "none",
            }}
          />
        )
      })}
    </>
  )
}

function Geometric({ color }: { color: string }) {
  const diamond = (side: "top" | "bottom") => (
    <span
      key={side}
      style={{
        position: "absolute",
        [side]: "-4px",
        left: "50%",
        marginLeft: "-4px",
        width: "8px",
        height: "8px",
        background: "rgba(4,10,28,1)",
        border: `1px solid ${color}70`,
        transform: "rotate(45deg)",
        pointerEvents: "none",
      }}
    />
  )
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1px solid ${color}40`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "6px",
          border: `1px solid ${color}1c`,
          pointerEvents: "none",
        }}
      />
      {diamond("top")}
      {diamond("bottom")}
    </>
  )
}

function Envelope({ color }: { color: string }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1px solid ${color}40`,
          borderRadius: "4px",
          pointerEvents: "none",
        }}
      />
      {/* Solapa */}
      <svg
        viewBox="0 0 100 12"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "62px",
          pointerEvents: "none",
        }}
      >
        <path d="M0 0 L50 11 L100 0" stroke={color} strokeOpacity="0.4" strokeWidth="0.22" fill="none" vectorEffect="non-scaling-stroke" />
        <path d="M0 0 L50 8 L100 0" stroke={color} strokeOpacity="0.16" strokeWidth="0.22" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* Lacre donde cierra la solapa */}
      <div
        style={{
          position: "absolute",
          top: "52px",
          left: "50%",
          marginLeft: "-6px",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: `radial-gradient(circle at 38% 35%, ${color}cc, ${color}66)`,
          boxShadow: `0 0 12px ${color}55`,
          pointerEvents: "none",
        }}
      />
    </>
  )
}

const FRAMES: Record<FrameKind, (p: { color: string }) => React.JSX.Element> = {
  flourish: Flourish,
  arrows: Arrows,
  dissolve: Dissolve,
  brackets: Brackets,
  geometric: Geometric,
  envelope: Envelope,
}

/* ── Sobres del "próximo plan" ───────────────────────────────────── */

function SealedEnvelope({ env, color }: { env: FutureEnvelope; color: string }) {
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(o => !o)}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: open ? `${color}10` : "rgba(255,255,255,0.02)",
        border: `1px solid ${open ? color + "50" : color + "22"}`,
        borderRadius: "8px",
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "var(--font-body)",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "11px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: open ? `${color}dd` : "rgba(190,220,245,0.5)",
          transition: "color 0.3s ease",
        }}
      >
        <span style={{ fontSize: "17px", lineHeight: 1 }}>{open ? env.icon : "✉"}</span>
        <span style={{ marginLeft: "auto", fontSize: "10px", opacity: 0.6 }}>
          {open ? "cerrar" : "abrir"}
        </span>
      </span>

      {open && (
        <span style={{ display: "block", marginTop: "12px", animation: "homeRise 0.5s cubic-bezier(0.22,1,0.36,1) both" }}>
          {env.hint.map((line, i) => (
            <span
              key={i}
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "14px",
                lineHeight: "1.75",
                color: "rgba(214,236,255,0.72)",
                marginBottom: i < env.hint.length - 1 ? "8px" : 0,
              }}
            >
              {line}
            </span>
          ))}
        </span>
      )}
    </button>
  )
}

/* ── Revelado con imagen ─────────────────────────────────────────── */

function Reveal({ letter }: { letter: FutureLetter }) {
  const [shown, setShown] = useState(false)
  const src = revealImage(letter)
  const reveal = letter.reveal!

  if (!shown) {
    return (
      <div style={{ textAlign: "center", marginTop: "clamp(20px,3vh,28px)" }}>
        <button
          onClick={() => setShown(true)}
          style={{
            background: `${letter.color}10`,
            border: `1px solid ${letter.color}45`,
            borderRadius: "999px",
            padding: "10px 24px",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: `${letter.color}dd`,
            transition: "all 0.35s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `${letter.color}22`
            e.currentTarget.style.boxShadow = `0 0 24px ${letter.color}30`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = `${letter.color}10`
            e.currentTarget.style.boxShadow = "none"
          }}
        >
          ✧ {reveal.label}
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        marginTop: "clamp(20px,3vh,28px)",
        textAlign: "center",
        animation: "homeRise 0.8s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      {src && (
        <img
          src={src}
          alt={reveal.phrase}
          decoding="async"
          style={{
            maxWidth: "100%",
            maxHeight: "46vh",
            width: "auto",
            height: "auto",
            display: "block",
            margin: "0 auto",
            borderRadius: "8px",
            boxShadow: `0 16px 44px rgba(0,0,0,0.55), 0 0 30px ${letter.color}22`,
          }}
        />
      )}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(15px,2vw,18px)",
          color: `${letter.color}f0`,
          lineHeight: "1.75",
          margin: "clamp(16px,2.5vh,22px) auto 0",
          maxWidth: "440px",
          textShadow: `0 0 30px ${letter.color}35`,
        }}
      >
        {reveal.phrase}
      </p>
    </div>
  )
}

/* ── Modal ───────────────────────────────────────────────────────── */

export default function FutureLetterModal({
  letter,
  onClose,
}: {
  letter: FutureLetter
  onClose: () => void
}) {
  const [visible, setVisible] = useState(false)
  const Frame = FRAMES[letter.frame]

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    setVisible(false)
    setTimeout(onClose, 380)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 100,
        background: `rgba(2,6,20,${visible ? 0.9 : 0})`,
        backdropFilter: visible ? "blur(10px)" : "blur(0px)",
        transition: "all 0.4s ease",
        padding: "clamp(16px,4vh,48px) clamp(12px,4vw,40px)",
      }}
      onClick={e => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(660px, 100%)",
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(22px) scale(0.97)",
          transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <button
          onClick={close}
          style={{
            position: "absolute",
            top: "-30px",
            right: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(190,225,255,0.55)",
            transition: "color 0.2s",
            padding: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(220,240,255,1)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(190,225,255,0.55)")}
        >
          ✕ Cerrar
        </button>

        {/* Panel con su marco */}
        <div
          style={{
            position: "relative",
            background: `radial-gradient(ellipse 90% 60% at 50% 0%, ${letter.color}0e, rgba(4,10,28,0.96))`,
            borderRadius: letter.frame === "geometric" ? 0 : "6px",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            boxShadow: `0 24px 70px rgba(0,0,0,0.6), 0 0 50px ${letter.color}12`,
          }}
        >
          <Frame color={letter.color} />

          <div
            style={{
              overflowY: "auto",
              padding: `${letter.frame === "envelope" ? "76px" : "clamp(30px,5vh,44px)"} clamp(24px,5vw,48px) clamp(28px,4vh,40px)`,
              minHeight: 0,
            }}
          >
            {/* Encabezado */}
            <div style={{ textAlign: "center", marginBottom: "clamp(22px,4vh,34px)" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: "400",
                  fontSize: "clamp(21px,3.4vw,30px)",
                  color: "rgba(226,242,255,0.94)",
                  margin: 0,
                  letterSpacing: "0.01em",
                  textShadow: `0 0 44px ${letter.color}40`,
                }}
              >
                {letter.title}
              </h2>
              <div
                style={{
                  width: "56px",
                  height: "1px",
                  margin: "clamp(14px,2vh,20px) auto 0",
                  background: `linear-gradient(to right, transparent, ${letter.color}70, transparent)`,
                }}
              />
            </div>

            {/* Cuerpo */}
            {letter.paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(14px,1.7vw,16px)",
                  lineHeight: "1.9",
                  color: "rgba(206,230,250,0.78)",
                  margin: `0 0 ${i < letter.paragraphs.length - 1 ? "1.15em" : "0"}`,
                  textAlign: "left",
                }}
              >
                {p}
              </p>
            ))}

            {letter.reveal && <Reveal letter={letter} />}

            {letter.envelopes && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "clamp(22px,3.5vh,32px)",
                }}
              >
                {letter.envelopes.map(env => (
                  <SealedEnvelope key={env.name} env={env} color={letter.color} />
                ))}
              </div>
            )}

            {letter.closing && (
              <>
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    margin: "clamp(26px,4vh,36px) 0 clamp(20px,3vh,26px)",
                    background: `linear-gradient(to right, transparent, ${letter.color}28, transparent)`,
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "clamp(14px,1.8vw,17px)",
                    lineHeight: "1.8",
                    color: `${letter.color}e0`,
                    textAlign: "center",
                    margin: 0,
                    textShadow: `0 0 34px ${letter.color}30`,
                  }}
                >
                  {letter.closing}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
