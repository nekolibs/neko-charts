import { formatChartNumericValue } from './numericValue'

export function formatLabel(xOrSerie, y, { fields, total, ...opts }) {
  fields = fields || []
  const hasXOrSerie = fields.includes('x') || fields.includes('serie')
  const hasY = fields.includes('y')
  const hasPercentage = fields.includes('percentage') && !!total

  let result = ''

  if (!!hasXOrSerie) result += xOrSerie
  if (!!hasY && !!hasXOrSerie) result += ': '
  if (!!hasY) result += formatChartNumericValue(y, opts)
  if ((!!hasY || !!hasXOrSerie) && hasPercentage) result += ' ('
  if (!!hasPercentage) result += Math.round((y / total) * 100) + '%'
  if ((!!hasY || !!hasXOrSerie) && hasPercentage) result += ')'

  return result
}
