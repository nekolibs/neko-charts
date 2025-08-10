import { Text as SvgText } from 'react-native-svg'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { useTheme } from '../NekoChartTheme'

const VALUE_LABEL_OFFSET = 5

export function BarsLabels({
  series,
  width,
  height,
  xSpace = 0,
  ySpace = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,

  theme,
}) {
  theme = useTheme(theme)
  // Calculate chart dimensions
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Find max value across all series
  const maxValue = Math.max(...series.flatMap((s) => s.data.map((d) => d?.y)))

  // Get unique x values
  const xPoints = series[0].data.length
  const seriesCount = series.length

  // Calculate bar dimensions (same as BarsChart)
  const groupWidth = chartWidth / xPoints
  const barSpacing = 4
  const barWidth = (groupWidth - barSpacing * (seriesCount + 1)) / seriesCount

  return (
    <>
      {/* Render value labels for each bar */}
      {series.map((serie, serieIndex) => {
        return serie.data.map((point, i) => {
          const barHeight = (point.y / maxValue) * (chartHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM)

          // Calculate grouped position (same as BarsChart)
          const x = xSpace + paddingLeft + i * groupWidth + serieIndex * (barWidth + barSpacing) + barSpacing
          const y = ySpace + paddingTop + (chartHeight - barHeight - CHART_PADDING_BOTTOM)

          return (
            <SvgText
              key={`${serie.serie}-bar-label-${i}`}
              x={x + barWidth / 2}
              y={y - VALUE_LABEL_OFFSET}
              fontSize={theme?.valueSize}
              fill={theme?.valueColor}
              alignmentBaseline="baseline"
              textAnchor="middle"
            >
              {point.y}
            </SvgText>
          )
        })
      })}
    </>
  )
}
