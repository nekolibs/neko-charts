import { AbsPath } from '../abstractions/Path'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { getColorFromScale } from '../_helpers/colors'
import { roundedBarPath } from '../_helpers/bar'
import { useColorsScale } from '../NekoChartTheme'

export function Bars({
  series: seriesRaw,
  pick,
  colorsScale,
  width,
  height,
  xSpace = 0,
  ySpace = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  suggestedMax: suggestedMaxProp,
  max: maxProp,
  suggestedMin: suggestedMinProp,
  min: minProp,
  cornerRadius = 10,
  chartPaddingTop,
  barSpacing: barSpacingProp,
}) {
  const _cpt = chartPaddingTop ?? CHART_PADDING_TOP
  const colors = useColorsScale(colorsScale)

  // Calculate chart dimensions
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Find max value across all series
  const series = pick ? seriesRaw.filter((s) => pick.includes(s.name)) : seriesRaw
  const yOf = (d) => (Number.isFinite(d?.y) ? d.y : 0)
  const dataMax = Math.max(...series.flatMap((s) => s.data.map(yOf)))
  const maxValue = maxProp ?? (suggestedMaxProp ? Math.max(dataMax, suggestedMaxProp) : dataMax)
  const rawMin = Math.min(...series.flatMap((s) => s.data.map(yOf)))
  const dataMin = suggestedMinProp === 'auto' ? rawMin : Math.min(0, rawMin)
  const minValue = minProp ?? (typeof suggestedMinProp === 'number' ? Math.min(dataMin, suggestedMinProp) : dataMin)

  // Get unique x values
  const xPoints = series[0].data.length
  const seriesCount = series.length

  // Calculate bar dimensions
  const groupWidth = chartWidth / xPoints
  const barSpacing = barSpacingProp ?? Math.max(1, Math.min(groupWidth * 0.15, 15))
  const barWidth = (groupWidth - barSpacing * (seriesCount + 1)) / seriesCount

  return (
    <>
      {/* Render bars for each series */}
      {series.map((serie, serieIndex) => {
        const serieColor =
          serie.color ||
          getColorFromScale(
            colors,
            seriesRaw.findIndex((s) => s.name === serie.name)
          ) ||
          '#818DF9'

        return serie.data.map((point, i) => {
          const pointY = yOf(point)
          const usableHeight = chartHeight - _cpt - CHART_PADDING_BOTTOM
          // Guard against a degenerate domain (all values equal → range 0) which
          // would make every division below NaN/Infinity and emit broken paths.
          const range = maxValue - minValue || 1
          const barHeight = Math.abs(pointY / range) * usableHeight
          const zeroY = ySpace + paddingTop + (maxValue / range) * usableHeight + _cpt

          // Calculate grouped position
          const x = xSpace + paddingLeft + i * groupWidth + serieIndex * (barWidth + barSpacing) + barSpacing
          const y = pointY >= 0 ? zeroY - barHeight : zeroY

          const path = roundedBarPath(x, y, barWidth, barHeight, cornerRadius, {
            top: true,
            bottom: true,
          })

          return <AbsPath key={`${serie.name}-bar-${i}`} d={path} fill={point.color || serieColor} />
        })
      })}
    </>
  )
}
