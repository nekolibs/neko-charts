import { AbsSvgText } from '../abstractions/SvgText'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { formatLargeNumber } from '../_helpers/numbers'
import { useTheme } from '../NekoChartTheme'

const VALUE_LABEL_OFFSET = 5

export function BarsLabels({
  hide,
  series: seriesRaw,
  pick,
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
  theme,
  chartPaddingTop,
  barSpacing: barSpacingProp,
}) {
  if (hide) return null
  const _cpt = chartPaddingTop ?? CHART_PADDING_TOP
  theme = useTheme(theme)
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

  // Calculate bar dimensions (same as BarsChart)
  const groupWidth = chartWidth / xPoints
  const barSpacing = barSpacingProp ?? Math.max(2, Math.min(groupWidth * 0.15, 15))
  const barWidth = (groupWidth - barSpacing * (seriesCount + 1)) / seriesCount

  return (
    <>
      {/* Render value labels for each bar */}
      {series.map((serie, serieIndex) => {
        return serie.data.map((point, i) => {
          const usableHeight = chartHeight - _cpt - CHART_PADDING_BOTTOM
          const range = maxValue - minValue
          const barHeight = Math.abs(point.y / range) * usableHeight
          const zeroY = ySpace + paddingTop + (maxValue / range) * usableHeight + _cpt

          // Calculate grouped position (same as BarsChart)
          const x = xSpace + paddingLeft + i * groupWidth + serieIndex * (barWidth + barSpacing) + barSpacing
          const barY = point.y >= 0 ? zeroY - barHeight : zeroY
          const labelY = point.y >= 0 ? barY - VALUE_LABEL_OFFSET : barY + barHeight + VALUE_LABEL_OFFSET

          return (
            <AbsSvgText
              key={`${serie.name}-bar-label-${i}`}
              x={x + barWidth / 2}
              y={labelY}
              fontSize={theme?.valueSize}
              fill={theme?.valueColor}
              alignmentBaseline={point.y >= 0 ? 'baseline' : 'hanging'}
              textAnchor="middle"
            >
              {point.y}
            </AbsSvgText>
          )
        })
      })}
    </>
  )
}
