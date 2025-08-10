import { Text as SvgText } from 'react-native-svg'

import { useTheme } from '../NekoChartTheme'

export function StackedBarsLabelsChart({
  series,
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
  theme,
}) {
  theme = useTheme(theme)
  if (!!hide) return false

  // Calculate chart dimensions
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Find max value (sum of all series at each point)
  const maxValue = Math.max(...series[0].data.map((_, i) => series.reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)))

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
          const barHeight = (point.y / maxValue) * (chartHeight - 40)

          // Calculate stacked position - sum of all previous series at this point
          const previousHeight = series
            .slice(0, serieIndex)
            .reduce((sum, s) => sum + ((s.data[i]?.y || 0) / maxValue) * (chartHeight - 40), 0)

          const x = xSpace + paddingLeft + i * groupWidth + barSpacing
          const y = ySpace + paddingTop + (chartHeight - barHeight - previousHeight - 20)

          // Only show label if bar height is large enough (same as original)
          if (barHeight <= 15) return null

          return (
            <SvgText
              key={`${serie.serie}-label-${i}`}
              x={x + barWidth / 2}
              y={y + barHeight / 2}
              fontSize={theme.valueSize}
              fill={'white'}
              alignmentBaseline="middle"
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
