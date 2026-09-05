/**
 * Progreso guardado en el propio navegador: los rasgos que ya se abrieron y
 * las cartas del futuro que ya se leyeron.
 *
 * Todo va envuelto en try/catch porque el almacenamiento puede fallar en
 * ventanas privadas o con las cookies bloqueadas; si falla, la web sigue
 * funcionando y simplemente empieza de cero.
 */

const KEY_SONIDO = "abayomi:sonido"
const KEY_RASGOS = "abayomi:rasgos-vistos"
const KEY_CARTAS = "abayomi:cartas-futuro-leidas"

function leer<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

function guardar(key: string, valor: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(valor))
  } catch {
    // Sin almacenamiento disponible: el progreso solo dura esta visita.
  }
}

/** Índices de `rasgos` que ya se descubrieron. */
export function cargarRasgosVistos(): number[] {
  return leer<number>(KEY_RASGOS).filter(n => typeof n === "number")
}

export function guardarRasgosVistos(vistos: number[]): void {
  guardar(KEY_RASGOS, vistos)
}

/** Ids de las cartas de «Hacia el futuro» que ya se abrieron. */
export function cargarCartasLeidas(): string[] {
  return leer<string>(KEY_CARTAS).filter(s => typeof s === "string")
}

export function guardarCartasLeidas(leidas: string[]): void {
  guardar(KEY_CARTAS, leidas)
}

/** Si la música está activada. Encendida por defecto. */
export function cargarSonido(): boolean {
  try {
    return localStorage.getItem(KEY_SONIDO) !== "off"
  } catch {
    return true
  }
}

export function guardarSonido(activo: boolean): void {
  try {
    localStorage.setItem(KEY_SONIDO, activo ? "on" : "off")
  } catch {
    // Sin almacenamiento: la preferencia dura solo esta visita.
  }
}
