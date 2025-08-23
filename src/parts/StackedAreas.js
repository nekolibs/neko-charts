import { Path } from 'react-native-svg'
import React from 'react'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale } from '../NekoChartTheme'

export function StackedAreas({
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

        // Build area path for this series - from previous cumulative line to current cumulative line
        let areaPath = serie.data.reduce((acc, point, i) => {
          const x = spaceAround
            ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
            : xSpace + paddingLeft + i * stepX // End-to-end

          // Calculate cumulative value up to this series (top line)
          const cumulativeValue = series.slice(0, serieIndex + 1).reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)
          const topY =
            ySpace +
            paddingTop +
            (chartHeight - (cumulativeValue / maxValue) * (chartHeight - CHART_PADDING_TOP) - CHART_PADDING_BOTTOM)

          // Calculate cumulative value up to previous series (bottom line)
          const previousCumulativeValue = series.slice(0, serieIndex).reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)
          const bottomY =
            ySpace +
            paddingTop +
            (chartHeight -
              (previousCumulativeValue / maxValue) * (chartHeight - CHART_PADDING_TOP) -
              CHART_PADDING_BOTTOM)

          if (i === 0) {
            return `M${x},${bottomY} L${x},${topY}`
          }
          return `${acc} L${x},${topY}`
        }, '')

        // Close the area path - go along bottom line back to start
        for (let i = serie.data.length - 1; i >= 0; i--) {
          const x = spaceAround ? xSpace + paddingLeft + i * stepX + stepX / 2 : xSpace + paddingLeft + i * stepX

          const previousCumulativeValue = series.slice(0, serieIndex).reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)
          const bottomY =
            ySpace +
            paddingTop +
            (chartHeight -
              (previousCumulativeValue / maxValue) * (chartHeight - CHART_PADDING_TOP) -
              CHART_PADDING_BOTTOM)

          areaPath += ` L${x},${bottomY}`
        }
        areaPath += ' Z'

        return (
          <React.Fragment key={serie.name}>
            <Path d={areaPath} fill={serieColor + '30'} stroke="none" />
          </React.Fragment>
        )
      })}
    </>
  )
}
