export function formatChartNumericValue(value, { prefix, sufix }) {
  prefix = prefix || ''
  sufix = sufix || ''
  return `${prefix}${value}${sufix}`
}
