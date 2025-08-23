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
 * Analyzes date range by checking first and last values only
 * Returns info about the date range if they are dates
 */
export function analyzeDateRange(firstValue, lastValue) {
  if (!firstValue || !lastValue) return null

  // Check if both are valid dates
  if (!isValidDate(firstValue) || !isValidDate(lastValue)) return null

  const firstDate = dayjs(firstValue)
  const lastDate = dayjs(lastValue)

  // Calculate differences
  const diffYears = lastDate.diff(firstDate, 'year')
  const diffMonths = lastDate.diff(firstDate, 'month')
  const diffDays = lastDate.diff(firstDate, 'day')
  const diffHours = lastDate.diff(firstDate, 'hour')
  const diffMinutes = lastDate.diff(firstDate, 'minute')

  return {
    isDateRange: true,
    firstDate,
    lastDate,
    diffYears,
    diffMonths,
    diffDays,
    diffHours,
    diffMinutes,
  }
}

/**
 * Formats a date based on the range context
 */
export function formatDateForRange(value, rangeInfo) {
  const date = dayjs(value)

  // If range is less than 1 hour, show time with seconds
  if (rangeInfo.diffMinutes < 60) {
    return date.format('HH:mm:ss')
  }

  // If range is less than 24 hours, show time
  if (rangeInfo.diffHours < 24) {
    return date.format('HH:mm')
  }

  // If range is less than 7 days, show day and time
  if (rangeInfo.diffDays < 7) {
    return date.format('MMM DD HH:mm')
  }

  // If range is less than 1 year, show month and day
  if (rangeInfo.diffYears < 1) {
    return date.format('MMM DD')
  }

  // If range is less than 5 years, show year and month
  if (rangeInfo.diffYears < 5) {
    return date.format('YYYY MMM')
  }

  // For larger ranges, just show year
  return date.format('YYYY')
}

/**
 * Creates a date formatter based on the range between first and last values
 */
export function createDateFormatter(firstValue, lastValue) {
  const rangeInfo = analyzeDateRange(firstValue, lastValue)

  if (!rangeInfo || !rangeInfo.isDateRange) {
    return null // Not a date range
  }

  return (value) => formatDateForRange(value, rangeInfo)
}
