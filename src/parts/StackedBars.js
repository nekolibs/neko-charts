import { AbsPath } from '../abstractions/Path'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { getColorFromScale } from '../_helpers/colors'
import { roundedBarPath } from '../_helpers/bar'
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
  chartPaddingTop,
  barSpacing: barSpacingProp,
}) {
  const _cpt = chartPaddingTop ?? CHART_PADDING_TOP
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
  const barSpacing = barSpacingProp ?? Math.max(2, Math.min(groupWidth * 0.15, 15))
  const barWidth = groupWidth - barSpacing * 2

  return (
    <>
      {series.map((serie, serieIndex) => {
        const serieColor = serie.color || getColorFromScale(colors, seriesRaw.findIndex(s => s.name === serie.name)) || '#818DF9'

        return serie.data.map((point, i) => {
          const pointY = Number.isFinite(point?.y) ? point.y : 0
          // Guard against a degenerate domain (all values equal → range 0) which
          // would make every division below NaN/Infinity and emit broken paths.
          const range = (maxValue - minValue) || 1
          const barHeight = (pointY / range) * (chartHeight - _cpt - CHART_PADDING_BOTTOM)

          // Calculate stacked position - sum of all previous series at this point
          const previousHeight = series
            .slice(0, serieIndex)
            .reduce((sum, s) => sum + ((s.data[i]?.y || 0) / range) * (chartHeight - _cpt - CHART_PADDING_BOTTOM), 0)

          const minOffset = (-minValue / range) * (chartHeight - _cpt - CHART_PADDING_BOTTOM)
          const x = xSpace + paddingLeft + i * groupWidth + barSpacing
          const y = ySpace + paddingTop + (chartHeight - barHeight - previousHeight - minOffset - CHART_PADDING_BOTTOM)

          const isFirstSegment = series.findIndex(s => (s.data[i]?.y || 0) > 0) === serieIndex
          const isLastSegment = series.findLastIndex(s => (s.data[i]?.y || 0) > 0) === serieIndex
          const path = roundedBarPath(x, y, barWidth, barHeight, cornerRadius, {
            top: isLastSegment,
            bottom: isFirstSegment,
          })

          return (
            <AbsPath
              key={`${serie.name}-bar-${i}`}
              d={path}
              fill={serieColor}
            />
          )
        })
      })}
    </>
  )
}
