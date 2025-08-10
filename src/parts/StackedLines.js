import { Path } from 'react-native-svg'
import React from 'react'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale } from '../NekoChartTheme'

export function StackedLines({
  series,
  colorsScale,
  width,
  height,
  xSpace = 15,
  ySpace = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  spaceAround = false,
  hide,
}) {
  const colors = useColorsScale(colorsScale)
  if (!!hide) return false

  // Calculate chart dimensions
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Find max value (sum of all series at each point)
  const maxValue = Math.max(...series[0].data.map((_, i) => series.reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)))
  const xPoints = series[0]?.data?.length || 0

  // Calculate stepX based on spaceAround setting
  let stepX
  if (spaceAround) {
    // Distribute with equal space between items (like bar charts)
    stepX = chartWidth / xPoints
  } else {
    // End-to-end distribution (like line charts)
    stepX = xPoints > 1 ? chartWidth / (xPoints - 1) : chartWidth
  }

  return (
    <>
      {series.map((serie, serieIndex) => {
        const serieColor = serie.color || getColorFromScale(colors, serieIndex) || '#818DF9'

        // Build path string for this series with cumulative values
        const linePath = serie.data.reduce((acc, point, i) => {
          const x = spaceAround
            ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
            : xSpace + paddingLeft + i * stepX // End-to-end

          // Calculate cumulative value up to this series
          const cumulativeValue = series.slice(0, serieIndex + 1).reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)
          const y =
            ySpace + paddingTop + (chartHeight - (cumulativeValue / maxValue) * (chartHeight - CHART_PADDING_TOP) - CHART_PADDING_BOTTOM)

          return acc + (i === 0 ? `M${x},${y}` : ` L${x},${y}`)
        }, '')

        return (
          <React.Fragment key={serie.serie}>
            <Path d={linePath} fill="none" stroke={serieColor} strokeWidth={2} />
          </React.Fragment>
        )
      })}
    </>
  )
}
