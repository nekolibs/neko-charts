import { createDateFormatter } from './dates'
import { createNumberFormatter } from './numbers'

/**
 * Creates a smart formatter for X-axis labels (dates/categories).
 * Detects if values are dates and formats them appropriately.
 *
 * @param {Array} data - Array of { x, y } points
 * @param {string} [datesPeriod] - Optional explicit period override (hour/day/week/month/quarter/year)
 */
export function createXLabelFormatter(data, datesPeriod) {
  if (!data || data.length === 0) {
    return (value) => String(value || '')
  }

  const xValues = data.map((d) => d?.x)
  const dateFormatter = createDateFormatter(xValues, datesPeriod)

  if (dateFormatter) return dateFormatter

  // Fallback to string formatting for non-dates
  return (value) => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'number') {
      if (Number.isInteger(value)) return value.toString()
      return value.toFixed(2)
    }
    return String(value)
  }
}

/**
 * Creates a formatter for Y-axis labels (usually numbers)
 */
export function createYLabelFormatter() {
  return createNumberFormatter()
}