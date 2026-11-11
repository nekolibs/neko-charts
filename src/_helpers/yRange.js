const finite = (value) => Number.isFinite(value)

function stackedTotals(series) {
  const length = Math.max(0, ...series.map((s) => s.data?.length || 0))
  return Array.from({ length }, (_, i) => series.reduce((sum, s) => sum + (finite(s.data?.[i]?.y) ? s.data[i].y : 0), 0))
}

/**
 * Resolves the y domain every part scales against.
 *
 * - `suggestedMin: 'auto'` starts at the data min instead of 0; a number extends the domain down to it.
 * - `suggestedMax` extends the domain up; `min` / `max` force it.
 * - A flat domain (all values equal, or forced bounds that meet) falls back to the zero baseline,
 *   and to a unit range when even that is flat, so callers never divide by zero.
 */
export function resolveYRange(series = [], { stacked = false, suggestedMax, suggestedMin, max, min } = {}) {
  const values = stacked ? stackedTotals(series) : series.flatMap((s) => (s.data || []).map((d) => d?.y)).filter(finite)
  const dataMax = values.length ? Math.max(...values) : 0
  const rawMin = values.length ? Math.min(...values) : 0

  let maxValue = max ?? (suggestedMax ? Math.max(dataMax, suggestedMax) : dataMax)
  const dataMin = suggestedMin === 'auto' ? rawMin : Math.min(0, rawMin)
  let minValue = min ?? (typeof suggestedMin === 'number' ? Math.min(dataMin, suggestedMin) : dataMin)

  if (maxValue <= minValue) {
    minValue = Math.min(0, rawMin)
    if (maxValue <= minValue) maxValue = minValue + 1
  }

  return { minValue, maxValue, range: maxValue - minValue }
}
