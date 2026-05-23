import { AbsSvgText } from '../abstractions/SvgText'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { formatLargeNumber } from '../_helpers/numbers'
import { useTheme } from '../NekoChartTheme'

export function StackedBarsLabelsChart({
  series: seriesRaw,
  pick,
  width,
  height,
  xSpace = 15,
  ySpace = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  spaceAround = true, // Always true for stacked bars like regular bars
  hide,
  suggestedMax: suggestedMaxProp,
  max: maxProp,
  suggestedMin: suggestedMinProp,
  min: minProp,
  theme,
}) {
  theme = useTheme(theme)
  if (!!hide) return false

  // Calculate chart dimensions
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Find max value (sum of all series at each point)
  const series = pick ? seriesRaw.filter(s => pick.includes(s.name)) : seriesRaw
  const dataMax = Math.max(...series[0].data.map((_, i) => series.reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)))
  const maxValue = maxProp ?? (suggestedMaxProp ? Math.max(dataMax, suggestedMaxProp) : dataMax)
  const rawMin = Math.min(...series[0].data.map((_, i) => series.reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)))
  const dataMin = suggestedMinProp === 'auto' ? rawMin : Math.min(0, rawMin)
  const minValue = minProp ?? (typeof suggestedMinProp === 'number' ? Math.min(dataMin, suggestedMinProp) : dataMin)

  // Get x points length
  const xPoints = series[0]?.data?.length || 0

  // Calculate bar dimensions - same as BarsChart
  const groupWidth = chartWidth / xPoints
  const barSpacing = 4
  const barWidth = groupWidth - barSpacing * 2

  return (
    <>
      {series.map((serie, serieIndex) => {
        return serie.data.map((point, i) => {
          const barHeight = (point.y / (maxValue - minValue)) * (chartHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM)

          // Calculate stacked position - sum of all previous series at this point
          const previousHeight = series
            .slice(0, serieIndex)
            .reduce((sum, s) => sum + ((s.data[i]?.y || 0) / (maxValue - minValue)) * (chartHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM), 0)

          const minOffset = (-minValue / (maxValue - minValue)) * (chartHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM)
          const x = xSpace + paddingLeft + i * groupWidth + barSpacing
          const y = ySpace + paddingTop + (chartHeight - barHeight - previousHeight - minOffset - CHART_PADDING_BOTTOM)

          // Only show label if bar height is large enough (same as original)
          if (barHeight <= 15) return null

          return (
            <AbsSvgText
              key={`${serie.name}-label-${i}`}
              x={x + barWidth / 2}
              y={y + barHeight / 2}
              fontSize={theme.valueSize}
              fill={'white'}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              {formatLargeNumber(point.y)}
            </AbsSvgText>
          )
        })
      })}
    </>
  )
}
