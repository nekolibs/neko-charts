import { G, Line } from 'react-native-svg'
import { Platform } from 'react-native'
import { useState, useRef, useMemo, useCallback } from 'react'

import { AxisInteractive } from './AxisInteractive'
import { Tooltip } from './Tooltip'
import { getColorFromScale } from '../_helpers/colors'
import { calculateTooltipWidthFromData, calculateTooltipPosition } from '../_helpers/tooltip'
import { useColorsScale, useTheme } from '../NekoChartTheme'

/**
 * X-Axis specific tooltip that shows all series values at a given X position
 * Works with line charts, bar charts, area charts, etc.
 */
export function XAxisTooltip({
  series,
  colorsScale,
  width,
  height,
  xSpace = 0,
  ySpace = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  spaceAround = false,
  hide,
  tooltipWidth,
  tooltipPadding = 8,
  showVerticalLine = true,
  theme,
}) {
  theme = useTheme(theme)
  const [hoveredData, setHoveredData] = useState(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const colors = useColorsScale(colorsScale)

  // Only render on web
  if (Platform.OS !== 'web' || hide) return null

  // Memoize chart dimensions
  const { chartWidth, chartHeight } = useMemo(
    () => ({
      chartWidth: width - xSpace * 2 - paddingLeft - paddingRight,
      chartHeight: height - ySpace * 2 - paddingTop - paddingBottom,
    }),
    [width, height, xSpace, paddingLeft, paddingRight, ySpace, paddingTop, paddingBottom]
  )

  // Calculate vertical line position only when hoveredData changes
  const verticalLineX = useMemo(() => {
    if (!hoveredData) return 0

    const firstData = series[0]?.data || []
    const stepX = spaceAround
      ? chartWidth / firstData.length
      : firstData.length > 1
        ? chartWidth / (firstData.length - 1)
        : chartWidth

    return spaceAround
      ? xSpace + paddingLeft + hoveredData.index * stepX + stepX / 2
      : xSpace + paddingLeft + hoveredData.index * stepX
  }, [hoveredData, series, spaceAround, chartWidth, xSpace, paddingLeft])

  // Calculate dynamic tooltip width based on content
  const calculatedTooltipWidth = useMemo(() => 
    calculateTooltipWidthFromData(hoveredData, theme.tooltipSize, tooltipPadding, tooltipWidth),
    [hoveredData, theme.tooltipSize, tooltipPadding, tooltipWidth]
  )

  // Calculate tooltip height for positioning
  const lineHeight = theme.tooltipSize + 4
  const tooltipHeight = useMemo(() => {
    if (!hoveredData) return 0
    const titleLines = 1 // for x-axis label
    return tooltipPadding * 2 + (hoveredData.values.length + titleLines) * lineHeight
  }, [hoveredData, tooltipPadding, lineHeight])

  // Smart positioning wrapper
  const getTooltipPosition = useCallback(
    (mouseX, mouseY, tooltipH, tooltipW) => 
      calculateTooltipPosition({
        mouseX,
        mouseY,
        tooltipWidth: tooltipW,
        tooltipHeight: tooltipH,
        containerWidth: width,
        containerHeight: height,
        padding: tooltipPadding
      }),
    [width, height, tooltipPadding]
  )

  // Optimized hover handler
  const handleHover = useCallback(
    (data) => {
      setHoveredData(data)

      const mouseX = mousePositionRef.current.x
      const mouseY = mousePositionRef.current.y
      const newTooltipHeight = tooltipPadding * 2 + (data.values.length + 1) * lineHeight
      const newTooltipWidth = calculateTooltipWidthFromData(data, theme.tooltipSize, tooltipPadding, tooltipWidth)

      setTooltipPosition(getTooltipPosition(mouseX, mouseY, newTooltipHeight, newTooltipWidth))
    },
    [getTooltipPosition, tooltipPadding, lineHeight, tooltipWidth, theme.tooltipSize]
  )

  const handleHoverOut = useCallback(() => {
    setHoveredData(null)
  }, [])

  // Track mouse position without triggering re-renders
  const handleMouseMove = useCallback(
    (e) => {
      if (Platform.OS === 'web' && e.nativeEvent) {
        const svg = e.currentTarget
        const rect = svg.getBoundingClientRect()
        mousePositionRef.current = {
          x: e.nativeEvent.clientX - rect.left,
          y: e.nativeEvent.clientY - rect.top,
        }

        // Update tooltip position if hovering
        if (hoveredData) {
          setTooltipPosition(
            getTooltipPosition(mousePositionRef.current.x, mousePositionRef.current.y, tooltipHeight, calculatedTooltipWidth)
          )
        }
      }
    },
    [hoveredData, tooltipHeight, calculatedTooltipWidth, getTooltipPosition]
  )

  // Prepare tooltip items
  const tooltipItems = useMemo(() => {
    if (!hoveredData) return []

    return hoveredData.values.map((value, index) => {
      const serieColor = series[index]?.color || getColorFromScale(colors, index) || '#818DF9'

      return {
        label: value.serie,
        value: value.y,
        color: serieColor,
      }
    })
  }, [hoveredData, series, colors])

  return (
    <G onMouseMove={handleMouseMove}>
      <AxisInteractive
        series={series}
        width={width}
        height={height}
        xSpace={xSpace}
        ySpace={ySpace}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        spaceAround={spaceAround}
        onXAxisHover={handleHover}
        onXAxisHoverOut={handleHoverOut}
      />

      {hoveredData && (
        <>
          {/* Vertical line at hovered position */}
          {showVerticalLine && (
            <Line
              x1={verticalLineX}
              y1={ySpace + paddingTop}
              x2={verticalLineX}
              y2={ySpace + paddingTop + chartHeight}
              stroke={theme.tooltipLineColor}
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.5}
            />
          )}

          {/* Tooltip */}
          <Tooltip
            x={tooltipPosition.x}
            y={tooltipPosition.y}
            visible={true}
            title={hoveredData.x}
            items={tooltipItems}
            width={calculatedTooltipWidth}
            theme={theme}
          />
        </>
      )}
    </G>
  )
}
