import { AbsPath } from '../abstractions/Path'
import { AbsRect } from '../abstractions/Rect'
import React from 'react'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale, useTheme } from '../NekoChartTheme'

export function StackedBars({
  series: seriesRaw,
  pick,
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
  suggestedMax: suggestedMaxProp,
  max: maxProp,
  suggestedMin: suggestedMinProp,
  min: minProp,
  cornerRadius = 10,
  theme,
}) {
  const colors = useColorsScale(colorsScale)
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
        const serieColor = serie.color || getColorFromScale(colors, seriesRaw.findIndex(s => s.name === serie.name)) || '#818DF9'

        return serie.data.map((point, i) => {
          const barHeight = (point.y / (maxValue - minValue)) * (chartHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM)

          // Calculate stacked position - sum of all previous series at this point
          const previousHeight = series
            .slice(0, serieIndex)
            .reduce((sum, s) => sum + ((s.data[i]?.y || 0) / (maxValue - minValue)) * (chartHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM), 0)

          const minOffset = (-minValue / (maxValue - minValue)) * (chartHeight - CHART_PADDING_TOP - CHART_PADDING_BOTTOM)
          const x = xSpace + paddingLeft + i * groupWidth + barSpacing
          const y = ySpace + paddingTop + (chartHeight - barHeight - previousHeight - minOffset - CHART_PADDING_BOTTOM)

          // Determine if this is the first or last segment
          const isFirstSegment = serieIndex === 0
          const isLastSegment = serieIndex === series.length - 1

          // Only round corners on edges not in contact with other segments
          const borderRadius = cornerRadius

          return (
            <React.Fragment key={`${serie.name}-bar-${i}`}>
              {isFirstSegment && isLastSegment ? (
                // Single segment - round all corners
                <AbsRect x={x} y={y} width={barWidth} height={barHeight} fill={serieColor} rx={borderRadius} />
              ) : isLastSegment ? (
                // Top segment - round only top corners
                <AbsPath
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
                <AbsPath
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
                <AbsRect x={x} y={y} width={barWidth} height={barHeight} fill={serieColor} />
              )}
            </React.Fragment>
          )
        })
      })}
    </>
  )
}
