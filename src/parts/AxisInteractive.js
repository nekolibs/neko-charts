import React from 'react'
import { Rect } from 'react-native-svg'
import { Platform } from 'react-native'

export function AxisInteractive({
  series,
  width,
  height,
  xSpace = 0,
  ySpace = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  spaceAround = false,
  onXAxisPress = console.log,
  onXAxisHover,
  onXAxisHoverOut,
  hide,
}) {
  if (!!hide || (!onXAxisPress && !onXAxisHover)) return null

  // Calculate chart dimensions
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Extract data from first series for x-axis structure (assuming all series have same x structure)
  const firstData = series[0]?.data || []

  // Calculate stepX based on spaceAround setting
  let stepX
  if (spaceAround) {
    // Distribute with equal space between items (like bar charts)
    stepX = chartWidth / firstData.length
  } else {
    // End-to-end distribution (like line charts)
    stepX = firstData.length > 1 ? chartWidth / (firstData.length - 1) : chartWidth
  }

  return (
    <>
      {firstData.map((point, i) => {
        // Calculate interaction zone boundaries
        const zoneWidth = stepX
        const zoneX = spaceAround
          ? xSpace + paddingLeft + i * stepX
          : i === 0
            ? xSpace + paddingLeft - stepX / 2
            : i === firstData.length - 1
              ? xSpace + paddingLeft + i * stepX - stepX / 2
              : xSpace + paddingLeft + i * stepX - stepX / 2

        // Get all Y values for this X position across all series
        const xData = {
          x: point.x,
          index: i,
          values: series
            .map((s) => ({
              serie: s.serie,
              y: s.data[i]?.y,
              color: s.color,
            }))
            .filter((v) => v.y !== null && v.y !== undefined), // Filter out null values
        }

        const rectProps = {
          key: `x-interactive-${i}`,
          x: zoneX,
          y: ySpace + paddingTop,
          width: zoneWidth,
          height: chartHeight,
          fill: 'transparent',
          onPress: onXAxisPress ? () => onXAxisPress(xData) : undefined,
        }

        // Add hover props only on web
        if (Platform.OS === 'web' && onXAxisHover) {
          rectProps.onMouseEnter = () => onXAxisHover(xData)
          rectProps.onMouseLeave = () => onXAxisHoverOut && onXAxisHoverOut(xData)
          rectProps.style = { cursor: 'pointer' }
        }

        return <Rect {...rectProps} />
      })}
    </>
  )
}
