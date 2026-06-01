import dayjs from 'dayjs'
import { detectPeriod, isValidDate } from './dates'

// Re-export for convenience (detection lives in dates.js)
export { detectPeriod }

/**
 * Generate sequence of ISO date strings from start to end at period step.
 * Snaps start to startOf(period) so sequence aligns with natural period boundaries
 * (e.g. monthly sequence always lands on the 1st of each month).
 */
export function generateDateSequence(start, end, period) {
  const startDate = dayjs(start)
  const endDate = dayjs(end)
  if (!startDate.isValid() || !endDate.isValid()) return []

  const sequence = []
  let current = startDate.startOf(period)
  // Safety cap to avoid runaway loops
  const maxIterations = 100000
  let i = 0

  while ((current.isBefore(endDate) || current.isSame(endDate)) && i < maxIterations) {
    sequence.push(current.toISOString())
    current = current.add(1, period)
    i++
  }

  return sequence
}

/**
 * Fill missing dates across all series. Returns new series array.
 * - Union of all x values determines fill range (or xMin/xMax if provided)
 * - Each series padded to same x sequence with fillValue for missing points
 * - Non-date x values: passes through unchanged
 */
export function fillSeriesDates(series, { xMin, xMax, datesPeriod, fillValue = null } = {}) {
  if (!series || series.length === 0) return series

  // Collect all x values across all series
  const allX = series.flatMap((s) => (s.data || []).map((d) => d.x))
  if (allX.length === 0) return series

  // Check if x values are dates
  const datesOnly = allX.filter(isValidDate)
  if (datesOnly.length === 0) return series

  // Determine bounds
  const sortedDates = datesOnly.map((d) => dayjs(d)).sort((a, b) => a.valueOf() - b.valueOf())
  const dataMin = sortedDates[0]
  const dataMax = sortedDates[sortedDates.length - 1]
  const boundMin = xMin ? dayjs(xMin) : dataMin
  const boundMax = xMax ? dayjs(xMax) : dataMax

  if (!boundMin.isValid() || !boundMax.isValid()) return series

  // Detect or use provided period (passes bounds for sparse-data fallback)
  const period = datesPeriod || detectPeriod(datesOnly, { xMin: boundMin, xMax: boundMax })

  // Generate full date sequence
  const sequence = generateDateSequence(boundMin, boundMax, period)
  if (sequence.length === 0) return series

  // For each series, build a map of x → original point, then walk sequence
  return series.map((serie) => {
    if (!serie.data || serie.data.length === 0) {
      return { ...serie, data: sequence.map((x) => ({ x, y: fillValue })) }
    }

    // Build lookup by normalized date key (period-truncated ISO)
    const pointMap = new Map()
    for (const point of serie.data) {
      if (isValidDate(point.x)) {
        const key = dayjs(point.x).startOf(period).toISOString()
        pointMap.set(key, point)
      }
    }

    const filledData = sequence.map((isoX) => {
      const key = dayjs(isoX).startOf(period).toISOString()
      const existing = pointMap.get(key)
      if (existing) return existing
      return { x: isoX, y: fillValue }
    })

    return { ...serie, data: filledData }
  })
}
