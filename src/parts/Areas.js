import { Path } from 'react-native-svg'
import React from 'react'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale } from '../NekoChartTheme'

export function Areas({
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

  // Calculate max value and step
  const maxValue = Math.max(...series.flatMap((s) => s.data.map((d) => d.y)))
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

        // Build area path, skipping null values but maintaining connection
        let areaPath = ''
        let firstX = null
        let lastX = null
        let isFirstPoint = true

        serie.data.forEach((point, i) => {
          if (point.y === null || point.y === undefined) {
            return // Skip null points
          }

          const x = spaceAround
            ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
            : xSpace + paddingLeft + i * stepX // End-to-end
          const y =
            ySpace +
            paddingTop +
            (chartHeight - (point.y / maxValue) * (chartHeight - CHART_PADDING_TOP) - CHART_PADDING_BOTTOM)

          if (isFirstPoint) {
            firstX = x
            areaPath = `M${x},${chartHeight + ySpace + paddingTop - CHART_PADDING_BOTTOM} L${x},${y}`
            isFirstPoint = false
          } else {
            areaPath += ` L${x},${y}`
          }
          lastX = x
        })

        // Close the area path if we have points
        if (firstX !== null && lastX !== null) {
          areaPath += ` L${lastX},${chartHeight + ySpace + paddingTop - CHART_PADDING_BOTTOM} L${firstX},${chartHeight + ySpace + paddingTop - CHART_PADDING_BOTTOM} Z`
        }

        return (
          <React.Fragment key={serie.name}>
            <Path d={areaPath} fill={serieColor + '30'} stroke="none" />
          </React.Fragment>
        )
      })}
    </>
  )
}
