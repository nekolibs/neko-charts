import { Rect, Path } from 'react-native-svg'
import React from 'react'

import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale, useTheme } from '../NekoChartTheme'

export function StackedBars({
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
  spaceAround = true, // Always true for stacked bars like regular bars
  hide,
  theme,
}) {
  const colors = useColorsScale(colorsScale)
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
        const serieColor = serie.color || getColorFromScale(colors, serieIndex) || '#818DF9'

        return serie.data.map((point, i) => {
          const barHeight = (point.y / maxValue) * (chartHeight - 40)

          // Calculate stacked position - sum of all previous series at this point
          const previousHeight = series
            .slice(0, serieIndex)
            .reduce((sum, s) => sum + ((s.data[i]?.y || 0) / maxValue) * (chartHeight - 40), 0)

          const x = xSpace + paddingLeft + i * groupWidth + barSpacing
          const y = ySpace + paddingTop + (chartHeight - barHeight - previousHeight - 20)

          // Determine if this is the first or last segment
          const isFirstSegment = serieIndex === 0
          const isLastSegment = serieIndex === series.length - 1

          // Only round corners on edges not in contact with other segments
          const borderRadius = 4

          return (
            <React.Fragment key={`${serie.serie}-bar-${i}`}>
              {isFirstSegment && isLastSegment ? (
                // Single segment - round all corners
                <Rect x={x} y={y} width={barWidth} height={barHeight} fill={serieColor} rx={borderRadius} />
              ) : isLastSegment ? (
                // Top segment - round only top corners
                <Path
                  d={`M ${x},${y + borderRadius} 
                      Q ${x},${y} ${x + borderRadius},${y}
                      L ${x + barWidth - borderRadius},${y}
                      Q ${x + barWidth},${y} ${x + barWidth},${y + borderRadius}
                      L ${x + barWidth},${y + barHeight}
                      L ${x},${y + barHeight}
                      Z`}
                  fill={serieColor}
                />
              ) : isFirstSegment ? (
                // Bottom segment - round only bottom corners
                <Path
                  d={`M ${x},${y}
                      L ${x + barWidth},${y}
                      L ${x + barWidth},${y + barHeight - borderRadius}
                      Q ${x + barWidth},${y + barHeight} ${x + barWidth - borderRadius},${y + barHeight}
                      L ${x + borderRadius},${y + barHeight}
                      Q ${x},${y + barHeight} ${x},${y + barHeight - borderRadius}
                      Z`}
                  fill={serieColor}
                />
              ) : (
                // Middle segment - no rounded corners
                <Rect x={x} y={y} width={barWidth} height={barHeight} fill={serieColor} />
              )}
            </React.Fragment>
          )
        })
      })}
    </>
  )
}
