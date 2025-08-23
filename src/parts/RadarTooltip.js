import { G } from 'react-native-svg'
import { Platform } from 'react-native'
import { useState, useRef, useMemo, useCallback } from 'react'

import { RadarAxisInteractive } from './RadarAxisInteractive'
import { Tooltip } from './Tooltip'
import { getColorFromScale } from '../_helpers/colors'
import { calculateTooltipWidthFromData, calculateTooltipPosition } from '../_helpers/tooltip'
import { useColorsScale, useTheme } from '../NekoChartTheme'

/**
 * Radar axis specific tooltip that shows all series values at a given axis
 * Works with radar charts - includes RadarAxisInteractive for hover detection
 */
export function RadarTooltip({
  series,
  colorsScale,
  width,
  height,
  xSpace = 20,
  ySpace = 20,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  showLabels = true,
  hide,
  tooltipWidth,
  tooltipPadding = 8,
  theme,
}) {
  theme = useTheme(theme)
  const [hoveredData, setHoveredData] = useState(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const colors = useColorsScale(colorsScale)

  // Only render on web
  if (Platform.OS !== 'web' || hide) return null

  // Calculate tooltip dimensions
  const lineHeight = theme.tooltipSize + 4
  const tooltipHeight = useMemo(() => {
    if (!hoveredData) return 0
    const titleLines = 1 // for axis label
    return tooltipPadding * 2 + (hoveredData.values.length + titleLines) * lineHeight
  }, [hoveredData, tooltipPadding, lineHeight])

  // Calculate dynamic tooltip width
  const calculatedTooltipWidth = useMemo(() => {
    if (!hoveredData) return tooltipWidth || 120

    // Convert radar axis data to expected format
    const tooltipData = {
      x: hoveredData.axis,
      values: hoveredData.values,
    }

    return calculateTooltipWidthFromData(tooltipData, theme.tooltipSize, tooltipPadding, tooltipWidth)
  }, [hoveredData, theme.tooltipSize, tooltipPadding, tooltipWidth])

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
        padding: tooltipPadding,
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

      // Convert to expected format and calculate width
      const tooltipData = { x: data.axis, values: data.values }
      const newTooltipWidth = calculateTooltipWidthFromData(
        tooltipData,
        theme.tooltipSize,
        tooltipPadding,
        tooltipWidth
      )

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
            getTooltipPosition(
              mousePositionRef.current.x,
              mousePositionRef.current.y,
              tooltipHeight,
              calculatedTooltipWidth
            )
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
      <RadarAxisInteractive
        series={series}
        width={width}
        height={height}
        xSpace={xSpace}
        ySpace={ySpace}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        showLabels={showLabels}
        onAxisHover={handleHover}
        onAxisHoverOut={handleHoverOut}
      />

      {hoveredData && (
        <Tooltip
          x={tooltipPosition.x}
          y={tooltipPosition.y}
          visible={true}
          title={hoveredData.axis}
          items={tooltipItems}
          width={calculatedTooltipWidth}
          theme={theme}
        />
      )}
    </G>
  )
}
