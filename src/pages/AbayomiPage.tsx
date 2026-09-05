import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fotos, shuffle, type MediaItem } from "../data/media"
import { abayomiLetter } from "../data/letters"
import LetterModal from "../components/LetterModal"

export type GalleryPhoto = MediaItem

/** Miniatura de la cuadrícula: imagen o primer fotograma del video. */
function PhotoThumb({ photo }: { photo: GalleryPhoto }) {
  if (photo.kind === "video") {
    return (
      <video
        src={photo.src}
        muted
        playsInline
        preload="metadata"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    )
  }

  return (
    <img
      src={photo.src}
      alt={photo.date ? `Foto del ${photo.date}` : "Foto"}
      loading="lazy"
      decoding="async"
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  )
}

function LightboxModal({
  photo,
  idx,
  total,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  photo: GalleryPhoto
  idx: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 20); return () => clearTimeout(t) }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setVisible(false); setTimeout(onClose, 300) }
      if (e.key === "ArrowLeft" && hasPrev) onPrev()
      if (e.key === "ArrowRight" && hasNext) onNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [hasPrev, hasNext])

  const close = () => { setVisible(false); setTimeout(onClose, 300) }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 100,
        background: `rgba(4,2,14,${visible ? 0.92 : 0})`,
        backdropFilter: visible ? "blur(10px)" : "none",
        transition: "all 0.3s ease",
      }}
      onClick={e => { if (e.target === e.currentTarget) close() }}
    >
      <button
        onClick={close}
        className="absolute"
        style={{
          top: "20px", right: "24px",
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--font-body)", fontSize: "11px",
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "rgba(220,190,240,0.5)",
          transition: "color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "rgba(220,190,240,0.95)")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(220,190,240,0.5)")}
      >
        ✕ Cerrar
      </button>

      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          transition: "all 0.35s ease",
          maxWidth: "min(720px, 90vw)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Foto o video, con su proporción real */}
        <div
          style={{
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            background: "rgba(0,0,0,0.35)",
          }}
        >
          {photo.kind === "video" ? (
            <video
              key={photo.src}
              src={photo.src}
              controls
              autoPlay
              playsInline
              style={{ width: "100%", maxHeight: "72vh", display: "block" }}
            />
          ) : (
            <img
              src={photo.src}
              alt={photo.date ? `Foto del ${photo.date}` : "Foto"}
              decoding="async"
              style={{ width: "100%", maxHeight: "72vh", objectFit: "contain", display: "block" }}
            />
          )}
        </div>

        {/* Fecha */}
        {photo.date && (
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "11px",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(200,160,220,0.35)", margin: 0,
            }}>
              {photo.date}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            disabled={!hasPrev} onClick={onPrev}
            style={{
              background: "none",
              border: `1px solid ${hasPrev ? "rgba(200,150,240,0.3)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "50%", width: "38px", height: "38px",
              color: hasPrev ? "rgba(220,180,240,0.7)" : "rgba(255,255,255,0.1)",
              cursor: hasPrev ? "pointer" : "default",
              fontSize: "16px", transition: "all 0.2s",
            }}
          >←</button>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(200,160,220,0.3)" }}>
            {idx + 1} / {total}
          </span>
          <button
            disabled={!hasNext} onClick={onNext}
            style={{
              background: "none",
              border: `1px solid ${hasNext ? "rgba(200,150,240,0.3)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "50%", width: "38px", height: "38px",
              color: hasNext ? "rgba(220,180,240,0.7)" : "rgba(255,255,255,0.1)",
              cursor: hasNext ? "pointer" : "default",
              fontSize: "16px", transition: "all 0.2s",
            }}
          >→</button>
        </div>
      </div>
    </div>
  )
}

export default function AbayomiPage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [letterOpen, setLetterOpen] = useState(false)

  // Se barajan otra vez cada vez que se entra a la página: nunca el mismo orden.
  const photos = useMemo<GalleryPhoto[]>(() => shuffle(fotos), [])

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t) }, [])

  const goBack = () => { setFadeOut(true); setTimeout(() => navigate("/hub"), 650) }

  return (
    <div
      className="relative w-full h-full overflow-auto"
      style={{
        background: "#06040e",
        opacity: mounted && !fadeOut ? 1 : 0,
        transition: fadeOut ? "opacity 0.65s ease" : "opacity 1s ease",
      }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(80,40,120,0.2) 0%, transparent 70%)",
        zIndex: 0,
      }} />

      {/* Header */}
      <div className="relative" style={{ padding: "clamp(20px,4vw,36px) clamp(20px,4vw,48px) 0", zIndex: 10 }}>
        <button
          onClick={goBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: "11px",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(200,165,230,0.35)", padding: 0,
            transition: "color 0.3s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(200,165,230,0.85)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(200,165,230,0.35)")}
        >
          ← Volver
        </button>
        <h1 style={{
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: "400",
          fontSize: "clamp(22px,4vw,38px)", color: "#eeddf8",
          margin: "clamp(16px,2.5vh,24px) 0 6px", letterSpacing: "0.02em",
        }}>
          Abayomi
        </h1>
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          color: "rgba(200,160,230,0.38)", fontSize: "clamp(12px,1.5vw,14px)", margin: 0,
        }}>
          Un rincón guardado para ti.
        </p>

        {/* La carta de este rincón */}
        {abayomiLetter.pages.length > 0 && (
          <button
            onClick={() => setLetterOpen(true)}
            style={{
              marginTop: "clamp(14px,2vh,20px)",
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "rgba(180,130,220,0.07)",
              border: "1px solid rgba(180,130,220,0.22)",
              borderRadius: "999px",
              padding: "9px 18px",
              cursor: "pointer",
              fontFamily: "var(--font-body)", fontSize: "11px",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(220,190,245,0.65)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(180,130,220,0.16)"
              e.currentTarget.style.color = "rgba(240,215,255,0.95)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(180,130,220,0.07)"
              e.currentTarget.style.color = "rgba(220,190,245,0.65)"
            }}
          >
            ✦ Leer la carta
          </button>
        )}

        <div style={{
          height: "1px", marginTop: "clamp(16px,2.5vh,24px)",
          background: "linear-gradient(to right, transparent, rgba(180,130,220,0.2) 30%, rgba(180,130,220,0.2) 70%, transparent)",
        }} />
      </div>

      {/* Sin fotos en la carpeta (por ejemplo, en una copia del repositorio)
          la sección se queda solo con su carta, sin una rejilla vacía. */}
      {photos.length === 0 && (
        <div
          className="relative"
          style={{
            zIndex: 10,
            padding: "clamp(40px,10vh,90px) clamp(20px,6vw,60px)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(13px,1.6vw,15px)",
              color: "rgba(200,160,230,0.32)",
              margin: 0,
            }}
          >
            Las fotos de este rincón viven fuera de aquí.
          </p>
        </div>
      )}

      {/* Mosaico: columnas de altura libre, cada foto con su proporción real */}
      <div className="relative" style={{
        padding: "clamp(20px,3vh,32px) clamp(16px,4vw,48px) clamp(40px,8vh,80px)",
        zIndex: 10,
        columns: "min(240px, 45vw)",
        columnGap: "clamp(10px,1.5vw,18px)",
      }}>
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            style={{
              breakInside: "avoid",
              marginBottom: "clamp(10px,1.5vw,18px)",
              cursor: "pointer",
              position: "relative",
              borderRadius: "6px",
              overflow: "hidden",
              transition: "transform 0.35s ease, box-shadow 0.35s ease",
              transform: hoveredIdx === idx ? "scale(1.02)" : "scale(1)",
              boxShadow: hoveredIdx === idx
                ? "0 16px 40px rgba(0,0,0,0.55), 0 0 30px rgba(180,130,220,0.12)"
                : "0 4px 18px rgba(0,0,0,0.4)",
            }}
            onClick={() => setLightboxIdx(idx)}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <PhotoThumb photo={photo} />

            {/* Marca de video */}
            {photo.kind === "video" && (
              <div style={{
                position: "absolute", top: "10px", right: "10px",
                width: "26px", height: "26px", borderRadius: "50%",
                background: "rgba(10,4,20,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(240,220,255,0.85)", fontSize: "10px",
                pointerEvents: "none",
              }}>▶</div>
            )}

            {/* Hover overlay */}
            {hoveredIdx === idx && photo.date && (
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(10,4,20,0.75) 0%, transparent 50%)",
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                padding: "12px 14px",
                pointerEvents: "none",
              }}>
                <p style={{
                  fontFamily: "var(--font-body)", fontSize: "10px",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "rgba(200,160,230,0.55)", margin: 0,
                }}>{photo.date}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <LightboxModal
          photo={photos[lightboxIdx]}
          idx={lightboxIdx}
          total={photos.length}
          onClose={() => setLightboxIdx(null)}
          onPrev={() => setLightboxIdx(i => (i! > 0 ? i! - 1 : i))}
          onNext={() => setLightboxIdx(i => (i! < photos.length - 1 ? i! + 1 : i))}
          hasPrev={lightboxIdx > 0}
          hasNext={lightboxIdx < photos.length - 1}
        />
      )}

      {/* Carta */}
      {letterOpen && (
        <LetterModal letter={abayomiLetter} onClose={() => setLetterOpen(false)} />
      )}
    </div>
  )
}
