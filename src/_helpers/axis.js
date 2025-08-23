import { createDateFormatter } from './dates'
import { createNumberFormatter } from './numbers'

/**
 * Creates a smart formatter for X-axis labels (dates/categories)
 * Detects if values are dates and formats them appropriately
 */
export function createXLabelFormatter(data) {
  if (!data || data.length === 0) {
    return (value) => String(value || '')
  }
  
  // Get first and last x values
  const firstValue = data[0]?.x
  const lastValue = data[data.length - 1]?.x
  
  // Try to create a date formatter
  const dateFormatter = createDateFormatter(firstValue, lastValue)
  
  if (dateFormatter) {
    return dateFormatter
  }
  
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