import { Text as SvgText } from 'react-native-svg'
import React from 'react'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { formatLargeNumber } from '../_helpers/numbers'
import { useTheme } from '../NekoChartTheme'

const VALUE_LABEL_OFFSET = 8

export function LabelsChart({
  series,
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

  theme,
}) {
  theme = useTheme(theme)
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

  // Calculate which labels to show based on available width
  const minLabelWidth = 40 // Minimum pixels needed per label
  const labelsToShow = Math.max(1, Math.floor(chartWidth / minLabelWidth))
  const interval = Math.ceil(xPoints / labelsToShow)

  return (
    <>
      {series.map((serie, serieIndex) => {
        return (
          <React.Fragment key={`${serie.name}-values`}>
            {serie.data.map((point, i) => {
              if (point.y === null || point.y === undefined) {
                return null // Skip null points
              }

              // Only show labels at calculated interval
              const shouldShowLabel = i % interval === 0
              if (!shouldShowLabel) return null

              const x = spaceAround
                ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
                : xSpace + paddingLeft + i * stepX // End-to-end
              const y =
                ySpace +
                paddingTop +
                (chartHeight - (point.y / maxValue) * (chartHeight - CHART_PADDING_TOP) - CHART_PADDING_BOTTOM)

              return (
                <SvgText
                  key={`${serie.name}-value-${i}`}
                  x={x}
                  y={y - VALUE_LABEL_OFFSET}
                  fontSize={theme.valueSize}
                  fill={theme.valueColor}
                  alignmentBaseline="baseline"
                  textAnchor="middle"
                >
                  {formatLargeNumber(point.y)}
                </SvgText>
              )
            })}
          </React.Fragment>
        )
      })}
    </>
  )
}
