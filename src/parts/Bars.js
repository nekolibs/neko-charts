import { Rect } from 'react-native-svg'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale } from '../NekoChartTheme'

export function Bars({
  series,
  colorsScale,
  width,
  height,
  xSpace = 0,
  ySpace = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
}) {
  const colors = useColorsScale(colorsScale)

  // Calculate chart dimensions
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Find max value across all series
  const maxValue = Math.max(...series.flatMap((s) => s.data.map((d) => d?.y)))

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
        const serieColor = serie.color || getColorFromScale(colors, serieIndex) || '#818DF9'

        return serie.data.map((point, i) => {
          const barHeight = (point.y / maxValue) * (chartHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM)

          // Calculate grouped position
          const x = xSpace + paddingLeft + i * groupWidth + serieIndex * (barWidth + barSpacing) + barSpacing
          const y = ySpace + paddingTop + (chartHeight - barHeight - CHART_PADDING_BOTTOM)

          return (
            <Rect
              key={`${serie.name}-bar-${i}`}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={serieColor}
              rx={4}
            />
          )
        })
      })}
    </>
  )
}
