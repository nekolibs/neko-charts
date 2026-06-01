import { AbsSvgText } from '../abstractions/SvgText'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { formatLargeNumber } from '../_helpers/numbers'
import { useTheme } from '../NekoChartTheme'

export function StackedTotalLabelsChart({
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
  spaceAround = true,
  hide,
  suggestedMax: suggestedMaxProp,
  max: maxProp,
  suggestedMin: suggestedMinProp,
  min: minProp,
  theme,
  chartPaddingTop,
}) {
  theme = useTheme(theme)
  if (!!hide) return false
  const _cpt = chartPaddingTop ?? CHART_PADDING_TOP

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

  // Calculate totals for each x point
  const totals = series[0].data.map((_, i) => series.reduce((sum, s) => sum + (s.data[i]?.y || 0), 0))

  // Calculate positioning based on spaceAround (for future compatibility with other stacked charts)
  let stepX
  if (spaceAround) {
    stepX = chartWidth / xPoints
  } else {
    stepX = xPoints > 1 ? chartWidth / (xPoints - 1) : chartWidth
  }

  return (
    <>
      {totals.map((total, i) => {
        const totalHeight = (total / (maxValue - minValue)) * (chartHeight - _cpt - CHART_PADDING_BOTTOM)
        const minOffset = (-minValue / (maxValue - minValue)) * (chartHeight - _cpt - CHART_PADDING_BOTTOM)

        const x = spaceAround
          ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
          : xSpace + paddingLeft + i * stepX // End-to-end

        const y = ySpace + paddingTop + (chartHeight - totalHeight - minOffset - CHART_PADDING_BOTTOM)

        return (
          <AbsSvgText
            key={`total-${i}`}
            x={x}
            y={y - 5}
            fontSize={theme.valueSize}
            fill={theme.valueColor}
            alignmentBaseline="baseline"
            textAnchor="middle"
          >
            {formatLargeNumber(total)}
          </AbsSvgText>
        )
      })}
    </>
  )
}
