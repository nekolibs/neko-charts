import { BODIES } from '../_data/muscles'

const BODIES_GAP = 50
const MIN_OPACITY = 0.2

export function getBodies(gender, view) {
  const body = BODIES[gender] || BODIES.male
  if (view === 'front') return [body.front]
  if (view === 'back') return [body.back]
  return [body.front, body.back]
}

function getBodiesBox(bodies) {
  const top = Math.min(...bodies.map((b) => b.bounds.y))
  const bottom = Math.max(...bodies.map((b) => b.bounds.y + b.bounds.height))
  const width = bodies.reduce((sum, b) => sum + b.bounds.width, 0) + BODIES_GAP * (bodies.length - 1)
  return { top, width, height: bottom - top }
}

export function getViewAspectRatio(bodies) {
  const box = getBodiesBox(bodies)
  return box.width / box.height
}

export function getBodyLayout(bodies, width, height) {
  const box = getBodiesBox(bodies)
  const scale = Math.min(width / box.width, height / box.height)
  const offsetY = (height - box.height * scale) / 2 - box.top * scale
  let cursor = (width - box.width * scale) / 2

  const groups = bodies.map((body) => {
    const x = cursor - body.bounds.x * scale
    cursor += (body.bounds.width + BODIES_GAP) * scale
    return { body, transform: `translate(${x}, ${offsetY}) scale(${scale})` }
  })

  return { scale, groups }
}

export function indexMuscleData(data) {
  const index = {}
  if (!Array.isArray(data)) return index
  data.forEach((datum) => {
    if (!datum?.muscle) return
    index[datum.muscle] = { ...index[datum.muscle], [datum.side || 'both']: datum }
  })
  return index
}

export function isSideSpecific(index, key) {
  return !!(index[key]?.left || index[key]?.right)
}

export function getMuscleDatum(index, key, side) {
  const entry = index[key]
  if (!entry) return undefined
  return (side && entry[side]) || entry.both
}

export function getMuscleDomain(data, min = 0, max) {
  if (max !== undefined) return { min, max }
  const values = (Array.isArray(data) ? data : []).map((d) => d?.value).filter((v) => Number.isFinite(v))
  return { min, max: values.length ? Math.max(...values) : min }
}

export function getIntensity(value, { min, max }, steps) {
  if (!Number.isFinite(value)) return 0
  if (max <= min) return value > min ? 1 : 0
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)))
  if (steps > 0 && t > 0) return Math.ceil(t * steps) / steps
  return t
}

export function getHeatScale(scaleColors, steps) {
  if (!scaleColors?.length) return undefined
  return steps > 0 ? scaleColors.slice(0, steps) : scaleColors
}

export function getIntensityFill(t, { color, scale }) {
  if (t <= 0) return undefined
  if (scale?.length) return { fill: scale[Math.max(0, Math.ceil(t * scale.length) - 1)], fillOpacity: 1 }
  return { fill: color, fillOpacity: MIN_OPACITY + (1 - MIN_OPACITY) * t }
}

export function getMuscleFill(datum, { domain, steps, color, scale, resolve }) {
  if (!datum) return undefined
  if (datum.color) return { fill: resolve(datum.color), fillOpacity: 1 }
  return getIntensityFill(getIntensity(datum.value, domain, steps), { color, scale })
}
