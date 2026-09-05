import { useEffect, useRef } from "react"

interface BackgroundStar {
  x: number
  y: number
  r: number
  baseOpacity: number
  phase: number
  speed: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  len: number
  life: number
  maxLife: number
}

export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgStarsRef = useRef<BackgroundStar[]>([])
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const animRef = useRef(0)
  const lastSpawnTimeRef = useRef(0)
  const nextSpawnDelayRef = useRef(5)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initBgStars(canvas.width, canvas.height)
    }

    function initBgStars(w: number, h: number) {
      const stars: BackgroundStar[] = []
      const count = Math.floor((w * h) / 6000)
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.65,
          r: 0.3 + Math.random() * 1.2,
          baseOpacity: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.8,
        })
      }
      bgStarsRef.current = stars
    }

    resize()
    window.addEventListener("resize", resize)

    let lastTime = 0

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const t = now / 1000

      // Draw background stars
      for (const s of bgStarsRef.current) {
        const opacity = s.baseOpacity * (0.7 + 0.3 * Math.sin(t * s.speed + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 248, 235, ${opacity})`
        ctx.fill()
      }

      // Spawn shooting stars
      if (t - lastSpawnTimeRef.current > nextSpawnDelayRef.current) {
        lastSpawnTimeRef.current = t
        nextSpawnDelayRef.current = 4 + Math.random() * 9

        const count = Math.random() < 0.25 ? 2 : 1
        for (let i = 0; i < count; i++) {
          const angleDeg = 25 + Math.random() * 35
          const angle = (angleDeg * Math.PI) / 180
          const speed = 350 + Math.random() * 450
          const side = Math.random() < 0.15 ? -1 : 1

          shootingStarsRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.55,
            vx: Math.cos(angle) * speed * side,
            vy: Math.sin(angle) * speed,
            len: 90 + Math.random() * 160,
            life: 0,
            maxLife: 0.35 + Math.random() * 0.45,
          })
        }
      }

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((s) => s.life < s.maxLife)

      for (const s of shootingStarsRef.current) {
        s.life += dt
        s.x += s.vx * dt
        s.y += s.vy * dt

        const progress = s.life / s.maxLife
        const opacity = progress < 0.15
          ? progress / 0.15
          : 1 - (progress - 0.15) / 0.85

        const mag = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
        const nx = s.vx / mag
        const ny = s.vy / mag
        const tailX = s.x - nx * s.len
        const tailY = s.y - ny * s.len

        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255, 248, 230, ${opacity * 0.95})`)
        grad.addColorStop(0.3, `rgba(210, 225, 255, ${opacity * 0.45})`)
        grad.addColorStop(1, "rgba(180, 200, 255, 0)")

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Bright head glow
        const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 3)
        headGrad.addColorStop(0, `rgba(255, 255, 250, ${opacity})`)
        headGrad.addColorStop(1, "rgba(255, 255, 250, 0)")
        ctx.beginPath()
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = headGrad
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

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    />
  )
}
