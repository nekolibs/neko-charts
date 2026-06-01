import dayjs from 'dayjs'

/**
 * Detects if a value is a valid date
 */
export function isValidDate(value) {
  if (!value) return false

  // Check if it's already a Date object
  if (value instanceof Date) return !isNaN(value)

  // Try parsing with dayjs
  const parsed = dayjs(value)
  return parsed.isValid()
}

/**
 * Detects the natural period (granularity) from an array of date values.
 *
 * Strategy:
 * - If 2+ valid dates → uses smallest gap between consecutive sorted dates.
 * - If <2 dates but xMin/xMax bounds provided → derives gap from (range / TARGET_COUNT)
 *   so detection produces a reasonable number of bars in the bound range.
 * - Otherwise → falls back to 'day'.
 *
 * Returns: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'
 */
export function detectPeriod(dates, { xMin, xMax } = {}) {
  const TARGET_COUNT = 5 // target number of bars when deriving from bounds

  const valid = (dates || []).filter(isValidDate).map((d) => dayjs(d)).sort((a, b) => a.valueOf() - b.valueOf())

  let minGap = Infinity

  if (valid.length >= 2) {
    for (let i = 1; i < valid.length; i++) {
      const gap = valid[i].valueOf() - valid[i - 1].valueOf()
      if (gap > 0 && gap < minGap) minGap = gap
    }
  }

  // Fallback to bounds-derived gap when data is too sparse
  if (minGap === Infinity && xMin && xMax) {
    const minD = dayjs(xMin)
    const maxD = dayjs(xMax)
    if (minD.isValid() && maxD.isValid()) {
      const range = maxD.valueOf() - minD.valueOf()
      if (range > 0) minGap = range / TARGET_COUNT
    }
  }

  if (minGap === Infinity) return 'day'

  const HOUR = 3600 * 1000
  const DAY = 24 * HOUR
  const WEEK = 7 * DAY
  const MONTH = 30 * DAY
  const QUARTER = 91 * DAY
  const YEAR = 365 * DAY

  if (minGap < DAY * 0.9) return 'hour'
  if (minGap < WEEK * 0.9) return 'day'
  if (minGap < MONTH * 0.9) return 'week'
  if (minGap < QUARTER * 0.9) return 'month'
  if (minGap < YEAR * 0.9) return 'quarter'
  return 'year'
}

/**
 * Maps a period to a dayjs format string.
 * For sub-day periods, includes date prefix when total range spans multiple days.
 */
export function formatForPeriod(period, value, { spansMultipleDays = false } = {}) {
  const date = dayjs(value)

  switch (period) {
    case 'hour':
      return spansMultipleDays ? date.format('MMM DD HH:mm') : date.format('HH:mm')
    case 'day':
    case 'week':
      return date.format('MMM DD')
    case 'month':
    case 'quarter':
      return date.format('MMM YYYY')
    case 'year':
      return date.format('YYYY')
    default:
      return date.format('MMM DD')
  }
}

/**
 * Analyzes date range by checking first and last values only.
 * Returns info about the date range if they are dates.
 */
export function analyzeDateRange(firstValue, lastValue) {
  if (!firstValue || !lastValue) return null

  if (!isValidDate(firstValue) || !isValidDate(lastValue)) return null

  const firstDate = dayjs(firstValue)
  const lastDate = dayjs(lastValue)

  return {
    isDateRange: true,
    firstDate,
    lastDate,
    diffYears: lastDate.diff(firstDate, 'year'),
    diffMonths: lastDate.diff(firstDate, 'month'),
    diffDays: lastDate.diff(firstDate, 'day'),
    diffHours: lastDate.diff(firstDate, 'hour'),
    diffMinutes: lastDate.diff(firstDate, 'minute'),
  }
}

/**
 * Creates a date formatter using detected (or provided) period.
 * @param {Array} dates - All x values from the data (used for period detection)
 * @param {string} [forcedPeriod] - Optional override; skips detection
 */
export function createDateFormatter(dates, forcedPeriod) {
  if (!dates || dates.length === 0) return null

  const valid = dates.filter(isValidDate)
  if (valid.length === 0) return null

  const period = forcedPeriod || detectPeriod(valid)

  // For sub-day periods, check if range spans multiple days to decide whether
  // to include date prefix in time format
  const sorted = valid.map((d) => dayjs(d)).sort((a, b) => a.valueOf() - b.valueOf())
  const spansMultipleDays = sorted.length >= 2 && sorted[sorted.length - 1].diff(sorted[0], 'day') >= 1

  return (value) => formatForPeriod(period, value, { spansMultipleDays })
}
