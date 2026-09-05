/**
 * Genera versiones ligeras de las imágenes de `Cartas/` y `Fotos/` dentro de
 * `web/`, respetando la estructura de carpetas.
 *
 * Los originales NO se tocan: siguen donde están, con su nombre y su peso.
 * La web usa la versión ligera cuando existe y cae en el original si no.
 *
 * Se puede volver a ejecutar cuando añadas archivos nuevos: solo procesa lo
 * que falta o lo que cambió.
 *
 *   node scripts/optimizar-imagenes.mjs          normal
 *   node scripts/optimizar-imagenes.mjs --todo   rehace todo
 */

import { readdir, stat, mkdir, unlink } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const SALIDA = path.join(RAIZ, "web")

/** Qué se optimiza y con qué holgura. */
const CARPETAS = [
  {
    origen: "Cartas",
    // Las cartas llevan texto escrito a mano: conviene margen para ampliarlas.
    ladoMaximo: 2200,
    calidad: 82,
  },
  {
    origen: "Fotos",
    ladoMaximo: 1600,
    calidad: 80,
  },
]

const OPTIMIZABLES = new Set([".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff", ".bmp"])

/** Recorre una carpeta y devuelve todas las rutas de archivo que contiene. */
async function listar(dir) {
  const salida = []
  let entradas
  try {
    entradas = await readdir(dir, { withFileTypes: true })
  } catch {
    return salida
  }
  for (const e of entradas) {
    const completa = path.join(dir, e.name)
    if (e.isDirectory()) salida.push(...(await listar(completa)))
    else salida.push(completa)
  }
  return salida
}

function mb(bytes) {
  return (bytes / 1048576).toFixed(1)
}

async function procesar({ origen, ladoMaximo, calidad }, rehacerTodo) {
  const dirOrigen = path.join(RAIZ, origen)
  if (!existsSync(dirOrigen)) {
    console.log(`· ${origen}/ no existe, se omite`)
    return { antes: 0, despues: 0, hechos: 0, saltados: 0, copiados: 0 }
  }

  const archivos = await listar(dirOrigen)
  let antes = 0
  let despues = 0
  let hechos = 0
  let saltados = 0

  for (const archivo of archivos) {
    const ext = path.extname(archivo).toLowerCase()
    if (!OPTIMIZABLES.has(ext)) continue

    const relativa = path.relative(dirOrigen, archivo)
    const destino = path.join(SALIDA, origen, relativa.slice(0, -ext.length) + ".webp")

    const infoOrigen = await stat(archivo)

    // Ya está hecho y el original no ha cambiado desde entonces.
    if (!rehacerTodo && existsSync(destino)) {
      const infoDestino = await stat(destino)
      if (infoDestino.mtimeMs >= infoOrigen.mtimeMs) {
        antes += infoOrigen.size
        despues += infoDestino.size
        saltados++
        continue
      }
    }

    await mkdir(path.dirname(destino), { recursive: true })

    try {
      await sharp(archivo, { limitInputPixels: false })
        .rotate() // respeta la orientación que traen las fotos del móvil
        .resize({
          width: ladoMaximo,
          height: ladoMaximo,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: calidad, effort: 5 })
        .toFile(destino)
    } catch (err) {
      console.error(`  ! no se pudo con ${relativa}: ${err.message}`)
      if (existsSync(destino)) await unlink(destino)
      continue
    }

    const infoDestino = await stat(destino)
    antes += infoOrigen.size
    despues += infoDestino.size
    hechos++

    const pct = Math.round((1 - infoDestino.size / infoOrigen.size) * 100)
    console.log(
      `  ${relativa.padEnd(46).slice(0, 46)} ${mb(infoOrigen.size).padStart(6)} MB → ${mb(
        infoDestino.size,
      ).padStart(5)} MB  (−${pct}%)`,
    )
  }

  return { antes, despues, hechos, saltados }
}

const rehacerTodo = process.argv.includes("--todo")

console.log(rehacerTodo ? "Rehaciendo todas las imágenes…\n" : "Optimizando imágenes…\n")

let totalAntes = 0
let totalDespues = 0
let totalHechos = 0
let totalSaltados = 0

for (const carpeta of CARPETAS) {
  console.log(`── ${carpeta.origen}/`)
  const r = await procesar(carpeta, rehacerTodo)
  totalAntes += r.antes
  totalDespues += r.despues
  totalHechos += r.hechos
  totalSaltados += r.saltados
  console.log("")
}

const ahorro = totalAntes > 0 ? Math.round((1 - totalDespues / totalAntes) * 100) : 0
console.log("──────────────────────────────────────────────")
console.log(`Procesadas: ${totalHechos}   Ya estaban al día: ${totalSaltados}`)
console.log(`Antes:   ${mb(totalAntes)} MB`)
console.log(`Después: ${mb(totalDespues)} MB   (−${ahorro}%)`)
console.log("\nLos originales siguen intactos en Cartas/ y Fotos/.")
