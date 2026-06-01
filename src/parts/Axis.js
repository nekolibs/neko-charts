import React from 'react'
import { AbsLine } from '../abstractions/Line'
import { AbsSvg } from '../abstractions/Svg'
import { AbsSvgText } from '../abstractions/SvgText'

import { CHART_PADDING_BOTTOM, CHART_PADDING_TOP } from '../NekoChart'
import { useTheme } from '../NekoChartTheme'
import { createXLabelFormatter, createYLabelFormatter } from '../_helpers/axis'
import { estimateLabelWidth } from '../_helpers/colors'

export function Axis({
  // Data and dimensions
  data = [],
  series = [],
  width,
  height,
  xSpace = 0,
  ySpace = 0,

  // Axis visibility
  xAxis = false,
  yAxis = false,
  xLabels = false,
  yLabels = false,
  xGrid = false,
  yGrid = false,

  // Styling
  fontSize = 10,
  labelSize,
  theme,

  // Layout
  stepY: stepYProp, // Y step between grid lines (auto-calculated if not provided)
  spaceAround = false, // If true, distributes with equal space between items

  // Stacked mode
  stacked = false,

  // Value range
  suggestedMax: suggestedMaxProp,
  suggestedMin: suggestedMinProp,
  max: maxProp,
  min: minProp,

  // Custom formatters
  formatXLabel,
  formatYLabel,
  datesPeriod,
  chartPaddingTop,
  children,
  ...props
}) {
  const _cpt = chartPaddingTop ?? CHART_PADDING_TOP
  theme = useTheme(theme)
  const effectiveLabelSize = labelSize ?? theme.labelSize

  const paddingLeft = yLabels ? (!spaceAround ? 20 : 35) : 0
  const paddingTop = yLabels ? 10 : 0
  const paddingBottom = xLabels ? 8 : 0
  const paddingRight = 0

  // Calculate chart dimensions (NOT affected by padding - padding just shifts elements)
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Extract data from first series for x-axis labels (assuming all series have same x structure)
  const firstData = series[0]?.data || []

  // Calculate maxValue from series
  const dataMax = series.length > 0
    ? stacked
      ? Math.max(...series[0].data.map((_, i) => series.reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)))
      : Math.max(...series.flatMap((s) => s.data.map((d) => d.y)))
    : 0
  const maxValue = maxProp ?? (suggestedMaxProp ? Math.max(dataMax, suggestedMaxProp) : dataMax)
  const rawMin = series.length > 0
    ? stacked
      ? Math.min(...series[0].data.map((_, i) => series.reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)))
      : Math.min(...series.flatMap(s => s.data.map(d => d.y)))
    : 0
  const dataMin = suggestedMinProp === 'auto' ? rawMin : Math.min(0, rawMin)
  const minValue = minProp ?? (typeof suggestedMinProp === 'number' ? Math.min(dataMin, suggestedMinProp) : dataMin)

  // Create smart formatters if not provided
  const smartXFormatter = formatXLabel || createXLabelFormatter(firstData, datesPeriod)
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

  // Auto-calculate stepY if not provided (nice numbers algorithm)
  let stepY = stepYProp
  if (!stepY) {
    const range = maxValue - minValue
    if (range > 0) {
      const rawStep = range / 5
      const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
      const normalized = rawStep / magnitude
      stepY = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude
    } else {
      stepY = 1
    }
  }

  // Generate Y axis values based on stepY
  const startY = Math.floor(minValue / stepY) * stepY
  const yAxisValues =
    (yAxis || yLabels || yGrid) && maxValue
      ? Array.from({ length: Math.floor((maxValue - startY) / stepY) + 1 }, (_, i) => startY + i * stepY)
      : []

  return (
    <AbsSvg height={height} width={width}>
      {/* X Axis Line */}
      {xAxis && (
        <AbsLine
          x1={xSpace + paddingLeft}
          y1={chartHeight + ySpace + paddingTop - 10}
          x2={chartWidth + xSpace + paddingLeft}
          y2={chartHeight + ySpace + paddingTop - 10}
          stroke={theme.axisColor}
          strokeWidth={1}
        />
      )}

      {/* Y Axis Line */}
      {yAxis && (
        <AbsLine
          x1={xSpace + paddingLeft}
          y1={ySpace + paddingTop - 10}
          x2={xSpace + paddingLeft}
          y2={chartHeight + ySpace + paddingTop - 10}
          stroke={theme.axisColor}
          strokeWidth={1}
        />
      )}

      {/* X Grid Lines */}
      {xGrid &&
        firstData.map((_, i) => {
          const x = spaceAround
            ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
            : xSpace + paddingLeft + i * stepX // End-to-end
          return (
            <AbsLine
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
      {yGrid &&
        yAxisValues.map((value, i) => {
          const scaledHeight = ((value - minValue) / (maxValue - minValue)) * (chartHeight - _cpt - CHART_PADDING_BOTTOM)
          const y = ySpace + paddingTop + (chartHeight - scaledHeight - CHART_PADDING_BOTTOM)
          return (
            <AbsLine
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
      {xLabels &&
        (() => {
          const formattedLabels = firstData.map((p) => smartXFormatter(p.x))
          const minLabelWidth = estimateLabelWidth(formattedLabels, effectiveLabelSize)
          const labelsToShow = Math.max(2, Math.floor(chartWidth / minLabelWidth))
          const interval = Math.ceil(firstData.length / labelsToShow)

          return firstData.map((point, i) => {
            if (i % interval !== 0) return null

            const x = spaceAround
              ? xSpace + paddingLeft + i * stepX + stepX / 2
              : xSpace + paddingLeft + i * stepX

            return (
              <AbsSvgText
                key={`x-label-${i}`}
                x={x}
                y={height - 5}
                fontSize={effectiveLabelSize}
                fill={theme.labelColor}
                alignmentBaseline="middle"
                textAnchor="middle"
              >
                {formattedLabels[i]}
              </AbsSvgText>
            )
          })
        })()}

      {/* Y Labels */}
      {yLabels &&
        yAxisValues.map((value, i) => {
          // Calculate minimum space needed per label
          const minLabelHeight = 40 // Minimum pixels needed per label
          const totalLabels = yAxisValues.length
          const availableHeight = chartHeight
          const labelsToShow = Math.max(2, Math.floor(availableHeight / minLabelHeight))

          // Calculate interval to skip labels
          const interval = Math.ceil(totalLabels / labelsToShow)

          // Skip first label only when it's the zero baseline
          const shouldShowLabel = (i !== 0 || minValue > 0) && (i === totalLabels - 1 || i % interval === 0)

          if (!shouldShowLabel) return null

          const scaledHeight = ((value - minValue) / (maxValue - minValue)) * (chartHeight - _cpt - CHART_PADDING_BOTTOM)
          const y = ySpace + paddingTop + (chartHeight - scaledHeight - CHART_PADDING_BOTTOM)

          return (
            <AbsSvgText
              key={`y-label-${i}`}
              x={xSpace + paddingLeft - 10}
              y={y}
              fontSize={effectiveLabelSize}
              fill={theme.labelColor}
              alignmentBaseline="middle"
              textAnchor="end"
            >
              {smartYFormatter(value)}
            </AbsSvgText>
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
          chartPaddingTop: _cpt,
          theme,
          ...props,
        })
      )}
    </AbsSvg>
  )
}
