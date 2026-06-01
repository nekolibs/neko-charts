import { AbsSvgText } from '../abstractions/SvgText'
import React from 'react'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { formatLargeNumber } from '../_helpers/numbers'
import { estimateLabelWidth } from '../_helpers/colors'
import { useTheme } from '../NekoChartTheme'

const VALUE_LABEL_OFFSET = 8

export function StackedLabelsChart({
  series: seriesRaw,
  pick,
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
  suggestedMax: suggestedMaxProp,
  max: maxProp,
  suggestedMin: suggestedMinProp,
  min: minProp,
  theme,
  chartPaddingTop,
}) {
  theme = useTheme(theme)
  if (!!hide) return false
  const _cpt = chartPaddingTop ?? CHART_PADDING_TOP

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

  // Calculate which labels to show based on available width
  const formattedValues = series.flatMap((s) => s.data.map((d) => formatLargeNumber(d.y)))
  const minLabelWidth = estimateLabelWidth(formattedValues, theme.valueSize)
  const labelsToShow = Math.max(1, Math.floor(chartWidth / minLabelWidth))
  const interval = Math.ceil(xPoints / labelsToShow)

  return (
    <>
      {series.map((serie, serieIndex) => {
        return (
          <React.Fragment key={`${serie.name}-values`}>
            {serie.data.map((point, i) => {
              // Only show labels at calculated interval
              const shouldShowLabel = i % interval === 0
              if (!shouldShowLabel) return null

              const x = spaceAround
                ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
                : xSpace + paddingLeft + i * stepX // End-to-end

              // Calculate cumulative value up to this series
              const cumulativeValue = series.slice(0, serieIndex + 1).reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)
              const y =
                ySpace +
                paddingTop +
                (chartHeight - ((cumulativeValue - minValue) / (maxValue - minValue)) * (chartHeight - _cpt - CHART_PADDING_BOTTOM) - CHART_PADDING_BOTTOM)

              return (
                <AbsSvgText
                  key={`${serie.name}-value-${i}`}
                  x={x}
                  y={y - VALUE_LABEL_OFFSET}
                  fontSize={theme.valueSize}
                  fill={theme.valueColor}
                  alignmentBaseline="baseline"
                  textAnchor="middle"
                >
                  {formatLargeNumber(point.y)}
                </AbsSvgText>
              )
            })}
          </React.Fragment>
        )
      })}
    </>
  )
}
