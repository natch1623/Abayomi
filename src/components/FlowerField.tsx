import { useEffect, useRef } from "react"

interface Flower {
  x: number
  y: number          // absolute px, set on init
  yRel: number       // 0=top of canvas, 1=bottom
  size: number
  phase: number
  phaseX: number     // spatial wind offset based on x
  speed: number
  maxSway: number
  alpha: number
  colorIdx: number
  layer: number
  rotation: number   // base petal rotation
  sunTint: number    // 0-1, golden horizon tint
}

interface GrassBlade {
  x: number
  y: number
  h: number
  angle: number
  phase: number
  color: string
}

interface Firefly {
  x: number
  y: number
  vy: number
  vx: number
  phase: number
  glowPhase: number
  size: number
}

// Forget-me-not petal colors: cornflower blue spectrum
const PETAL_RGB: [number, number, number][] = [
  [91, 143, 212],   // classic cornflower
  [107, 159, 228],  // lighter
  [72, 108, 196],   // deeper
  [118, 168, 236],  // sky blue
  [62, 100, 188],   // vivid
  [134, 182, 238],  // pale sky
  [225, 225, 240],  // near-white
  [155, 185, 228],  // soft steel blue
]
const CENTER_COLORS = ["#f5d464", "#f0c84a", "#fad055", "#f7c840"]

function warmTint(rgb: [number, number, number], t: number): string {
  const [r, g, b] = rgb
  return `${Math.round(r + (210 - r) * t * 0.4)},${Math.round(g + (155 - g) * t * 0.25)},${Math.round(b + (80 - b) * t * 0.08)}`
}

function drawForgetMeNot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  colorIdx: number,
  layer: number,
  rotation: number,
  sunTint: number
) {
  const rgb = PETAL_RGB[colorIdx % PETAL_RGB.length]
  const petalColor = `rgba(${warmTint(rgb, sunTint)},${alpha})`
  const centerColor = CENTER_COLORS[colorIdx % CENTER_COLORS.length]

  ctx.globalAlpha = alpha

  if (layer === 0) {
    // Distant: simple dot cluster, fast
    ctx.fillStyle = petalColor
    ctx.beginPath()
    ctx.arc(x, y, size * 0.8, 0, Math.PI * 2)
    ctx.fill()
    // White center hint
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.7})`
    ctx.beginPath()
    ctx.arc(x, y, size * 0.3, 0, Math.PI * 2)
    ctx.fill()
  } else if (layer === 1) {
    // Mid: overlapping circles, more clearly petalled
    const orbit = size * 0.72
    const petalR = size * 0.58
    ctx.fillStyle = petalColor
    for (let i = 0; i < 5; i++) {
      const a = rotation + (i / 5) * Math.PI * 2
      ctx.beginPath()
      ctx.arc(x + Math.cos(a) * orbit, y + Math.sin(a) * orbit, petalR, 0, Math.PI * 2)
      ctx.fill()
    }
    // White ring
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.88})`
    ctx.beginPath()
    ctx.arc(x, y, size * 0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = centerColor
    ctx.beginPath()
    ctx.arc(x, y, size * 0.18, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // Front: proper elliptical petals with stem
    const stemLen = size * 6.5

    // Stem with gentle S-curve
    ctx.strokeStyle = `rgba(28,62,12,${alpha * 0.75})`
    ctx.lineWidth = Math.max(0.8, size * 0.14)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.bezierCurveTo(
      x + size * 0.4, y + stemLen * 0.35,
      x - size * 0.3, y + stemLen * 0.65,
      x, y + stemLen
    )
    ctx.stroke()

    // Tiny leaf on stem
    if (size > 7) {
      const lx = x + size * 0.2
      const ly = y + stemLen * 0.5
      ctx.fillStyle = `rgba(35,75,15,${alpha * 0.6})`
      ctx.save()
      ctx.translate(lx, ly)
      ctx.rotate(0.6)
      ctx.beginPath()
      ctx.ellipse(0, 0, size * 0.25, size * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // Petals as proper ellipses — characteristic heart-shaped forget-me-not
    const orbit = size * 0.68
    const pw = size * 0.46   // petal half-width
    const ph = size * 0.56   // petal half-height

    // Soft glow behind flower
    const grd = ctx.createRadialGradient(x, y, 0, x, y, size * 1.8)
    grd.addColorStop(0, `rgba(${warmTint(rgb, sunTint)},${alpha * 0.18})`)
    grd.addColorStop(1, "rgba(0,0,0,0)")
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.arc(x, y, size * 1.8, 0, Math.PI * 2)
    ctx.fill()

    for (let i = 0; i < 5; i++) {
      const a = rotation + (i / 5) * Math.PI * 2
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(a)
      // Petal center offset toward petal
      ctx.beginPath()
      ctx.ellipse(0, -orbit, pw, ph, 0, 0, Math.PI * 2)
      ctx.fillStyle = petalColor
      ctx.fill()
      // Highlight on upper half of petal
      ctx.beginPath()
      ctx.ellipse(0, -orbit - ph * 0.15, pw * 0.55, ph * 0.38, 0, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.22})`
      ctx.fill()
      ctx.restore()
    }

    // White ring (characteristic of forget-me-not)
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.92})`
    ctx.beginPath()
    ctx.arc(x, y, size * 0.32, 0, Math.PI * 2)
    ctx.fill()

    // Yellow center
    const cg = ctx.createRadialGradient(x - size * 0.06, y - size * 0.06, 0, x, y, size * 0.22)
    cg.addColorStop(0, "#fff5b0")
    cg.addColorStop(0.5, centerColor)
    cg.addColorStop(1, "#c89420")
    ctx.fillStyle = cg
    ctx.beginPath()
    ctx.arc(x, y, size * 0.22, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalAlpha = 1
}

export default function FlowerField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dataRef = useRef<{ flowers: Flower[]; grass: GrassBlade[]; fireflies: Firefly[] }>({
    flowers: [], grass: [], fireflies: [],
  })
  const animRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function init(w: number, h: number) {
      const flowers: Flower[] = []

      // ── Back layer: hazy carpet of color near the horizon ──
      for (let i = 0; i < 380; i++) {
        const yRel = Math.pow(Math.random(), 1.4) * 0.52   // cluster toward top
        const sunTint = Math.max(0, 1 - yRel * 2.2)        // warm near horizon
        flowers.push({
          x: Math.random() * w,
          y: yRel * h,
          yRel,
          size: 1 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
          phaseX: Math.random() * 0.012,
          speed: 0.18 + Math.random() * 0.35,
          maxSway: 0.4 + Math.random() * 0.7,
          alpha: 0.18 + yRel * 0.28,
          colorIdx: Math.floor(Math.random() * PETAL_RGB.length),
          layer: 0,
          rotation: Math.random() * Math.PI * 2,
          sunTint,
        })
      }

      // ── Mid layer: recognizable flowers ──
      for (let i = 0; i < 180; i++) {
        const yRel = 0.3 + Math.pow(Math.random(), 0.8) * 0.55
        const sunTint = Math.max(0, 0.5 - yRel * 0.55)
        flowers.push({
          x: Math.random() * w,
          y: yRel * h,
          yRel,
          size: 2.8 + Math.random() * 2.5,
          phase: Math.random() * Math.PI * 2,
          phaseX: Math.random() * 0.009,
          speed: 0.28 + Math.random() * 0.48,
          maxSway: 1.8 + Math.random() * 2.5,
          alpha: 0.52 + Math.random() * 0.32,
          colorIdx: Math.floor(Math.random() * PETAL_RGB.length),
          layer: 1,
          rotation: Math.random() * Math.PI * 2,
          sunTint,
        })
      }

      // ── Front layer: large, detailed, up close ──
      for (let i = 0; i < 55; i++) {
        const yRel = 0.6 + Math.pow(Math.random(), 0.7) * 0.38
        flowers.push({
          x: Math.random() * w,
          y: yRel * h,
          yRel,
          size: 6 + Math.random() * 8,
          phase: Math.random() * Math.PI * 2,
          phaseX: Math.random() * 0.006,
          speed: 0.35 + Math.random() * 0.45,
          maxSway: 4 + Math.random() * 5,
          alpha: 0.8 + Math.random() * 0.18,
          colorIdx: Math.floor(Math.random() * PETAL_RGB.length),
          layer: 2,
          rotation: Math.random() * Math.PI * 2,
          sunTint: 0,
        })
      }

      flowers.sort((a, b) => a.y - b.y)

      // ── Grass ──
      const grass: GrassBlade[] = []
      const grassColors = [
        "rgba(22,52,10,",
        "rgba(28,62,12,",
        "rgba(18,45,8,",
        "rgba(35,68,15,",
        "rgba(45,80,18,",
        "rgba(30,58,22,",
      ]
      for (let i = 0; i < 500; i++) {
        const yRel = 0.48 + Math.random() * 0.52
        const depth = (yRel - 0.48) / 0.52
        grass.push({
          x: Math.random() * w,
          y: yRel * h,
          h: 6 + depth * 28 + Math.random() * 18,
          angle: -0.35 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
          color: grassColors[Math.floor(Math.random() * grassColors.length)],
        })
      }

      // ── Fireflies ──
      const fireflies: Firefly[] = []
      for (let i = 0; i < 18; i++) {
        fireflies.push({
          x: Math.random() * w,
          y: (0.4 + Math.random() * 0.55) * h,
          vy: -(0.08 + Math.random() * 0.18),
          vx: -0.05 + Math.random() * 0.1,
          phase: Math.random() * Math.PI * 2,
          glowPhase: Math.random() * Math.PI * 2,
          size: 1.2 + Math.random() * 1.4,
        })
      }

      dataRef.current = { flowers, grass, fireflies }
    }

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      init(canvas.width, canvas.height)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const render = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      const t = performance.now() / 1000
      const { flowers, grass, fireflies } = dataRef.current

      // ── Ground fill — rich dark green ──
      const groundGrd = ctx.createLinearGradient(0, 0, 0, height)
      groundGrd.addColorStop(0, "rgba(10,22,5,0)")
      groundGrd.addColorStop(0.25, "rgba(8,18,4,0.55)")
      groundGrd.addColorStop(0.55, "rgba(6,14,3,0.88)")
      groundGrd.addColorStop(1, "#040d02")
      ctx.fillStyle = groundGrd
      ctx.fillRect(0, 0, width, height)

      // ── Grass blades ──
      for (const g of grass) {
        const windSway = Math.sin(t * 0.75 + g.phase + g.x * 0.004) * 0.22
        const a = g.angle + windSway
        const depth = Math.max(0, (g.y / height - 0.48) / 0.52)
        ctx.strokeStyle = g.color + (0.22 + depth * 0.5) + ")"
        ctx.lineWidth = 0.5 + depth * 0.8
        const ex = g.x + Math.sin(a) * g.h
        const ey = g.y - Math.cos(a) * g.h
        ctx.beginPath()
        ctx.moveTo(g.x, g.y)
        ctx.quadraticCurveTo(
          g.x + Math.sin(a) * g.h * 0.55,
          g.y - g.h * 0.55,
          ex, ey
        )
        ctx.stroke()
      }

      // ── Flowers ──
      for (const f of flowers) {
        // Organic wind: two frequencies + spatial variation
        const w1 = Math.sin(t * f.speed + f.phase + f.x * f.phaseX)
        const w2 = Math.sin(t * f.speed * 1.7 + f.phase * 1.3 + f.x * f.phaseX * 1.5) * 0.3
        const sway = (w1 + w2) * f.maxSway

        // Stem bob: slight vertical movement on front flowers
        const bob = f.layer === 2 ? Math.sin(t * f.speed * 0.9 + f.phase) * f.maxSway * 0.15 : 0

        drawForgetMeNot(ctx, f.x + sway, f.y + bob, f.size, f.alpha, f.colorIdx, f.layer, f.rotation, f.sunTint)
      }

      // ── Fireflies ──
      for (const ff of fireflies) {
        ff.y += ff.vy
        ff.x += ff.vx
        // Wrap at top
        if (ff.y < height * 0.35) { ff.y = height * 0.9; ff.x = Math.random() * width }
        if (ff.x < 0) ff.x = width
        if (ff.x > width) ff.x = 0

        const glow = 0.35 + 0.65 * Math.pow(Math.sin(t * 1.8 + ff.glowPhase) * 0.5 + 0.5, 2.5)
        const r = ff.size * (1 + glow * 0.5)

        const fg = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, r * 6)
        fg.addColorStop(0, `rgba(200,240,140,${glow * 0.9})`)
        fg.addColorStop(0.3, `rgba(160,220,80,${glow * 0.35})`)
        fg.addColorStop(1, "rgba(120,200,60,0)")
        ctx.fillStyle = fg
        ctx.beginPath()
        ctx.arc(ff.x, ff.y, r * 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(230,255,180,${glow})`
        ctx.beginPath()
        ctx.arc(ff.x, ff.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 w-full"
      style={{ height: "78%", display: "block", zIndex: 4 }}
    />
  )
}
