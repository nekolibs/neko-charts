import { AbsPath } from '../abstractions/Path'
import React from 'react'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale } from '../NekoChartTheme'

export function Lines({
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
  spaceAround = false,
  suggestedMax: suggestedMaxProp,
  max: maxProp,
  suggestedMin: suggestedMinProp,
  min: minProp,
  chartPaddingTop,
  lineWidth = 2,
}) {
  const _cpt = chartPaddingTop ?? CHART_PADDING_TOP
  const colors = useColorsScale(colorsScale)

  // Calculate chart dimensions
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Calculate max value and step
  const series = pick ? seriesRaw.filter(s => pick.includes(s.name)) : seriesRaw
  const dataMax = Math.max(...series.flatMap((s) => s.data.map((d) => d.y)))
  const maxValue = maxProp ?? (suggestedMaxProp ? Math.max(dataMax, suggestedMaxProp) : dataMax)
  const rawMin = Math.min(...series.flatMap(s => s.data.map(d => d.y)))
  const dataMin = suggestedMinProp === 'auto' ? rawMin : Math.min(0, rawMin)
  const minValue = minProp ?? (typeof suggestedMinProp === 'number' ? Math.min(dataMin, suggestedMinProp) : dataMin)
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
        const serieColor = serie.color || getColorFromScale(colors, seriesRaw.findIndex(s => s.name === serie.name)) || '#818DF9'

        // Build path string for this series, skipping null values but maintaining connection
        let linePath = ''
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
            (chartHeight - ((point.y - minValue) / (maxValue - minValue)) * (chartHeight - _cpt - CHART_PADDING_BOTTOM) - CHART_PADDING_BOTTOM)

          if (isFirstPoint) {
            linePath += `M${x},${y}`
            isFirstPoint = false
          } else {
            linePath += ` L${x},${y}`
          }
        })

        return (
          <React.Fragment key={serie.name}>
            <AbsPath d={linePath} fill="none" stroke={serieColor} strokeWidth={lineWidth} strokeLinecap="round" strokeLinejoin="round" />
          </React.Fragment>
        )
      })}
    </>
  )
}
