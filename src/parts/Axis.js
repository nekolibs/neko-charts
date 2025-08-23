import React from 'react'
import Svg, { Line, Text as SvgText } from 'react-native-svg'

import { useTheme } from '../NekoChartTheme'
import { createXLabelFormatter, createYLabelFormatter } from '../_helpers/axis'

export function Axis({
  // Data and dimensions
  data = [],
  series = [],
  width,
  height,
  xSpace = 0,
  ySpace = 0,

  // Axis visibility
  showXAxis = false,
  showYAxis = false,
  showXLabels = true,
  showYLabels = false,
  showXGrid = true,
  showYGrid = false,

  // Styling
  fontSize = 10,
  theme,

  // Layout
  stepY = 40, // Default Y step
  spaceAround = false, // If true, distributes with equal space between items

  // Custom formatters
  formatXLabel,
  formatYLabel,
  children,
  ...props
}) {
  theme = useTheme(theme)

  const paddingLeft = showYLabels ? (!spaceAround ? 20 : 35) : 0
  const paddingTop = showYLabels ? 10 : 0
  const paddingBottom = showXLabels ? 8 : 0
  const paddingRight = 0

  // Calculate chart dimensions (NOT affected by padding - padding just shifts elements)
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Extract data from first series for x-axis labels (assuming all series have same x structure)
  const firstData = series[0]?.data || []

  // Calculate maxValue from series if not provided
  const maxValue = series.length > 0 ? Math.max(...series.flatMap((s) => s.data.map((d) => d.y))) : 0

  // Create smart formatters if not provided
  const smartXFormatter = formatXLabel || createXLabelFormatter(firstData)
  const smartYFormatter = formatYLabel || createYLabelFormatter()

  // Calculate stepX based on spaceAround setting
  let stepX
  if (spaceAround) {
    // Distribute with equal space between items (like bar charts)
    stepX = chartWidth / firstData.length
  } else {
    // End-to-end distribution (like line charts)
    stepX = firstData.length > 1 ? chartWidth / (firstData.length - 1) : chartWidth
  }

  // Generate Y axis values based on stepY
  const yAxisValues =
    (showYAxis || showYLabels || showYGrid) && maxValue
      ? Array.from({ length: Math.floor(maxValue / stepY) + 1 }, (_, i) => i * stepY)
      : []

  return (
    <Svg height={height} width={width}>
      {/* X Axis Line */}
      {showXAxis && (
        <Line
          x1={xSpace + paddingLeft}
          y1={chartHeight + ySpace + paddingTop - 10}
          x2={chartWidth + xSpace + paddingLeft}
          y2={chartHeight + ySpace + paddingTop - 10}
          stroke={theme.axisColor}
          strokeWidth={1}
        />
      )}

      {/* Y Axis Line */}
      {showYAxis && (
        <Line
          x1={xSpace + paddingLeft}
          y1={ySpace + paddingTop - 10}
          x2={xSpace + paddingLeft}
          y2={chartHeight + ySpace + paddingTop - 10}
          stroke={theme.axisColor}
          strokeWidth={1}
        />
      )}

      {/* X Grid Lines */}
      {showXGrid &&
        firstData.map((_, i) => {
          const x = spaceAround
            ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
            : xSpace + paddingLeft + i * stepX // End-to-end
          return (
            <Line
              key={`x-grid-${i}`}
              x1={x}
              y1={ySpace + paddingTop}
              x2={x}
              y2={chartHeight + ySpace + paddingTop}
              stroke={theme.gridColor}
              strokeWidth={0.5}
              opacity={0.3}
            />
          )
        })}

      {/* Y Grid Lines */}
      {showYGrid &&
        yAxisValues.map((value, i) => {
          const y = ySpace + paddingTop + (chartHeight - (value / maxValue) * chartHeight)
          return (
            <Line
              key={`y-grid-${i}`}
              x1={xSpace + paddingLeft}
              y1={y}
              x2={chartWidth + xSpace + paddingLeft}
              y2={y}
              stroke={theme.gridColor}
              strokeWidth={0.5}
              opacity={0.3}
            />
          )
        })}

      {/* X Labels */}
      {showXLabels &&
        firstData.map((point, i) => {
          // Calculate minimum space needed per label (approximate)
          const minLabelWidth = 60 // Minimum pixels needed per label
          const totalLabels = firstData.length
          const availableWidth = chartWidth
          const labelsToShow = Math.max(2, Math.floor(availableWidth / minLabelWidth))

          // Calculate interval to skip labels
          const interval = Math.ceil(totalLabels / labelsToShow)

          // Only show labels at the calculated interval, skip first and last
          const shouldShowLabel =
            (!!spaceAround || i !== 0) && (!!spaceAround || i !== totalLabels - 1) && i % interval === 0

          if (!shouldShowLabel) return null

          // Position based on spaceAround setting
          const x = spaceAround
            ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
            : xSpace + paddingLeft + i * stepX // End-to-end spacing

          return (
            <SvgText
              key={`x-label-${i}`}
              x={x}
              y={height - 5}
              fontSize={theme.labelSize}
              fill={theme.labelColor}
              alignmentBaseline="middle"
              textAnchor="middle"
            >
              {smartXFormatter(point.x)}
            </SvgText>
          )
        })}

      {/* Y Labels */}
      {showYLabels &&
        yAxisValues.map((value, i) => {
          // Calculate minimum space needed per label
          const minLabelHeight = 40 // Minimum pixels needed per label
          const totalLabels = yAxisValues.length
          const availableHeight = chartHeight
          const labelsToShow = Math.max(2, Math.floor(availableHeight / minLabelHeight))

          // Calculate interval to skip labels
          const interval = Math.ceil(totalLabels / labelsToShow)

          // Skip first (0) and show labels at interval
          const shouldShowLabel = i !== 0 && (i === totalLabels - 1 || i % interval === 0)

          if (!shouldShowLabel) return null

          const y = ySpace + paddingTop + (chartHeight - (value / maxValue) * chartHeight)

          return (
            <SvgText
              key={`y-label-${i}`}
              x={xSpace + paddingLeft - 10}
              y={y}
              fontSize={theme.labelSize}
              fill={theme.labelColor}
              alignmentBaseline="middle"
              textAnchor="end"
            >
              {smartYFormatter(value)}
            </SvgText>
          )
        })}

      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          height,
          width,
          paddingLeft,
          paddingTop,
          paddingRight,
          paddingBottom,
          data,
          series,
          xSpace,
          ySpace,
          spaceAround,
          theme,
          ...props,
        })
      )}
    </Svg>
  )
}
