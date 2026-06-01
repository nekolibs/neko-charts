import { AbsCircle } from '../abstractions/Circle'
import React from 'react'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale, useTheme } from '../NekoChartTheme'

export function Scatters({
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
  hide,
  dotSize,
  suggestedMax: suggestedMaxProp,
  max: maxProp,
  suggestedMin: suggestedMinProp,
  min: minProp,
  theme,
  chartPaddingTop,
}) {
  const _cpt = chartPaddingTop ?? CHART_PADDING_TOP
  const colors = useColorsScale(colorsScale)
  theme = useTheme(theme)
  if (!!hide) return false

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

        return (
          <React.Fragment key={`${serie.name}-points`}>
            {serie.data.map((point, i) => {
              if (point.y === null || point.y === undefined) {
                return null // Skip null points
              }

              const x = spaceAround
                ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
                : xSpace + paddingLeft + i * stepX // End-to-end
              const y =
                ySpace +
                paddingTop +
                (chartHeight - ((point.y - minValue) / (maxValue - minValue)) * (chartHeight - _cpt - CHART_PADDING_BOTTOM) - CHART_PADDING_BOTTOM)

              return <AbsCircle key={`${serie.name}-point-${i}`} cx={x} cy={y} r={dotSize || theme.pointSize} fill={point.color || serieColor} />
            })}
          </React.Fragment>
        )
      })}
    </>
  )
}
