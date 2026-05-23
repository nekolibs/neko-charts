import { AbsRect } from '../abstractions/Rect'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { getColorFromScale } from '../_helpers/colors'
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
}) {
  const colors = useColorsScale(colorsScale)

  // Calculate chart dimensions
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Find max value across all series
  const series = pick ? seriesRaw.filter(s => pick.includes(s.name)) : seriesRaw
  const dataMax = Math.max(...series.flatMap((s) => s.data.map((d) => d?.y)))
  const maxValue = maxProp ?? (suggestedMaxProp ? Math.max(dataMax, suggestedMaxProp) : dataMax)
  const rawMin = Math.min(...series.flatMap(s => s.data.map(d => d.y)))
  const dataMin = suggestedMinProp === 'auto' ? rawMin : Math.min(0, rawMin)
  const minValue = minProp ?? (typeof suggestedMinProp === 'number' ? Math.min(dataMin, suggestedMinProp) : dataMin)

  // Get unique x values
  const xPoints = series[0].data.length
  const seriesCount = series.length

  // Calculate bar dimensions
  const groupWidth = chartWidth / xPoints
  const barSpacing = 4
  const barWidth = (groupWidth - barSpacing * (seriesCount + 1)) / seriesCount

  return (
    <>
      {/* Render bars for each series */}
      {series.map((serie, serieIndex) => {
        const serieColor = serie.color || getColorFromScale(colors, seriesRaw.findIndex(s => s.name === serie.name)) || '#818DF9'

        return serie.data.map((point, i) => {
          const usableHeight = chartHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM
          const range = maxValue - minValue
          const barHeight = Math.abs(point.y / range) * usableHeight
          const zeroY = ySpace + paddingTop + (maxValue / range) * usableHeight + CHART_PADDING_TOP

          // Calculate grouped position
          const x = xSpace + paddingLeft + i * groupWidth + serieIndex * (barWidth + barSpacing) + barSpacing
          const y = point.y >= 0 ? zeroY - barHeight : zeroY

          return (
            <AbsRect
              key={`${serie.name}-bar-${i}`}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={point.color || serieColor}
              rx={cornerRadius}
            />
          )
        })
      })}
    </>
  )
}
