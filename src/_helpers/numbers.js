/**
 * Formats large numbers with K, M, B suffixes
 */
export function formatLargeNumber(value) {
  if (value === null || value === undefined) return ''
  if (typeof value !== 'number') return String(value)

  // Format with suffixes for large numbers
  if (Math.abs(value) >= 1000000000) {
    return `${(value / 1000000000).toFixed(0)}B`
  }
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }

  // For smaller numbers
  if (Number.isInteger(value)) {
    return value.toString()
  }

  // For decimals, use appropriate precision
  if (Math.abs(value) < 10) {
    return value.toFixed(2)
  }
  return value.toFixed(1)
}

/**
 * Creates a number formatter for axis labels
 */
export function createNumberFormatter() {
  return formatLargeNumber
}
