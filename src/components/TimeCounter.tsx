import { useEffect, useState } from "react"

const START_DATE = new Date(2024, 8, 5, 15, 40, 0)

function getElapsed() {
  const now = new Date()
  const start = START_DATE
  let years = now.getFullYear() - start.getFullYear()
  const anniversaryThisYear = new Date(now.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes(), start.getSeconds())
  if (now < anniversaryThisYear) years--
  const lastAnniversary = new Date(now.getFullYear() - (now < anniversaryThisYear ? 1 : 0), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes(), start.getSeconds())
  const diff = Math.max(0, now.getTime() - lastAnniversary.getTime())
  const totalSeconds = Math.floor(diff / 1000)
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const totalHours = Math.floor(totalMinutes / 60)
  const hours = totalHours % 24
  const days = Math.floor(totalHours / 24)
  return { years, days, hours, minutes, seconds }
}

const units = [
  // `pad` solo en las unidades de reloj: "1 año" se lee mejor que "01 años".
  { key: "years", one: "año", many: "años", pad: false },
  { key: "days", one: "día", many: "días", pad: false },
  { key: "hours", one: "hora", many: "horas", pad: true },
  { key: "minutes", one: "minuto", many: "minutos", pad: true },
  { key: "seconds", one: "segundo", many: "segundos", pad: true },
] as const

export default function TimeCounter() {
  const [elapsed, setElapsed] = useState(getElapsed)

  useEffect(() => {
    const id = setInterval(() => setElapsed(getElapsed()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-center px-4">
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          color: "rgba(255, 232, 195, 0.7)",
          fontSize: "clamp(12px, 1.6vw, 15px)",
          letterSpacing: "0.1em",
          marginBottom: "clamp(18px, 3vh, 28px)",
          textShadow: "0 2px 20px rgba(10,4,20,0.8)",
          animation: "homeRise 0.9s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        Desde que nuestras historias se cruzaron...
      </p>

      <div
        style={{
          display: "flex",
          gap: "clamp(8px, 2vw, 24px)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {units.map(({ key, one, many, pad }, i) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(8px, 2vw, 24px)",
              animation: `homeRise 0.85s cubic-bezier(0.22,1,0.36,1) ${0.22 + i * 0.1}s both`,
            }}
          >
            {i > 0 && (
              // Filete vertical: el punto anterior se perdía sobre el cielo.
              <span
                style={{
                  display: "block",
                  width: "1px",
                  height: "clamp(20px, 3vw, 32px)",
                  background:
                    "linear-gradient(to bottom, transparent, rgba(250,205,150,0.28), transparent)",
                  marginBottom: "clamp(14px, 2vh, 20px)",
                }}
              />
            )}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#f0d8a8",
                  fontSize: "clamp(32px, 5.5vw, 58px)",
                  fontWeight: "500",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  textShadow:
                    "0 2px 18px rgba(8,2,18,0.75), 0 0 50px rgba(240,160,70,0.4), 0 0 110px rgba(200,100,50,0.18)",
                  minWidth: "2ch",
                  // Cifras de ancho fijo: sin esto los números bailan cada segundo.
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pad ? String(elapsed[key]).padStart(2, "0") : elapsed[key]}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  color: "rgba(235, 208, 165, 0.5)",
                  fontSize: "clamp(8px, 1vw, 10px)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginTop: "8px",
                  fontWeight: "400",
                  textShadow: "0 1px 10px rgba(10,4,20,0.8)",
                }}
              >
                {elapsed[key] === 1 ? one : many}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
