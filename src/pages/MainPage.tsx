import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import FlowerField from "../components/FlowerField"
import ShootingStars from "../components/ShootingStars"
import TimeCounter from "../components/TimeCounter"

function EnvelopeIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.75" y="0.75" width="20.5" height="14.5" rx="1.25" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 1.5L11 9L21 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export default function MainPage() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
  const [navHover, setNavHover] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  const navigateTo = (path: string) => {
    setFadeOut(true)
    setTimeout(() => navigate(path), 700)
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        opacity: mounted && !fadeOut ? 1 : 0,
        transition: fadeOut ? "opacity 0.7s ease" : "opacity 0.6s ease",
      }}
    >
      {/* Sky gradient — cinematic sunset with distinct color bands */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #02000e  0%,
            #06031a  8%,
            #0e0830  16%,
            #1c0e4a  24%,
            #2e1260  31%,
            #4a1872  37%,
            #6a1e70  43%,
            #8c2462  49%,
            #a82e4a  54%,
            #bf3830  58%,
            #cc4e1a  62%,
            #d46410  66%,
            #dc7c12  69%,
            #e29020  72%,
            #e8a430  76%,
            #edb848  80%,
            #f1c85e  83%,
            #f5d478  87%,
            #f8e094  91%,
            #faeaa8  94%,
            #fcf2c0  97%,
            #fef8dc 100%)`,
          zIndex: 1,
        }}
      />

      {/* Atmospheric scattering band — soft magenta/rose streak at the golden hour */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 120% 18% at 50% 57%, rgba(200,80,60,0.18) 0%, transparent 100%)`,
          zIndex: 2,
        }}
      />

      {/* Horizon glow — wide warm bloom, centrado en la línea del horizonte */}
      <div
        className="absolute"
        style={{
          bottom: "10%",
          left: "-15%",
          right: "-15%",
          height: "330px",
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(240,145,35,0.30) 0%, rgba(220,100,20,0.12) 45%, transparent 78%)",
          zIndex: 6,
          pointerEvents: "none",
        }}
      />

      {/* Shooting stars */}
      <ShootingStars />

      {/* Flowers */}
      <FlowerField />

      {/* Side vignette — keeps sides cinematic */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 78% 65% at 50% 38%, transparent 30%, rgba(2,1,8,0.45) 100%)",
          zIndex: 8,
        }}
      />

      {/* Legibility scrim — apoya el contador sobre el cielo sin taparlo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 44% 24% at 50% 36%, rgba(4,1,14,0.5) 0%, rgba(4,1,14,0.28) 45%, transparent 75%)",
          zIndex: 9,
        }}
      />

      {/* Top darkening for stars to be visible */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "25%",
          background: "linear-gradient(to bottom, rgba(3,1,12,0.35) 0%, transparent 100%)",
          zIndex: 7,
        }}
      />

      {/* UI overlay */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ zIndex: 20 }}
      >
        {/* Top nav */}
        <div className="flex justify-end" style={{ padding: "clamp(16px,3vw,28px)" }}>
          <button
            onClick={() => navigateTo("/cartas")}
            onMouseEnter={() => setNavHover(true)}
            onMouseLeave={() => setNavHover(false)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "5px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: navHover ? "rgba(245,225,185,0.95)" : "rgba(230,205,160,0.6)",
              transition: "color 0.3s ease, text-shadow 0.3s ease",
              textShadow: navHover ? "0 0 20px rgba(245,205,130,0.4)" : "none",
              padding: "8px",
              animation: "homeRise 0.9s cubic-bezier(0.22,1,0.36,1) 1.15s both",
            }}
          >
            <EnvelopeIcon />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: "500",
              }}
            >
              Cartas
            </span>
          </button>
        </div>

        {/* Center content */}
        <div
          className="flex-1 flex flex-col items-center justify-center"
          style={{ gap: "clamp(30px, 5.5vh, 52px)", paddingBottom: "26vh" }}
        >
          <TimeCounter />

          {/* Comenzar button */}
          <button
            onClick={() => navigateTo("/experiencia")}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "12px 40px",
              position: "relative",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "clamp(13px, 1.8vw, 17px)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: btnHover ? "rgba(255,240,210,1)" : "rgba(240,220,180,0.75)",
              transition: "color 0.4s ease",
              textShadow: btnHover
                ? "0 0 24px rgba(245,190,100,0.45)"
                : "0 0 18px rgba(240,170,70,0.2)",
              animation: "homeRise 0.9s cubic-bezier(0.22,1,0.36,1) 0.95s both",
            }}
          >
            Comenzar
            {/* Animated underline */}
            <span
              style={{
                position: "absolute",
                bottom: "-2px",
                left: "50%",
                transform: "translateX(-50%)",
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, rgba(245,195,105,0.85), transparent)",
                width: btnHover ? "88%" : "34%",
                transition: "width 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "block",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
