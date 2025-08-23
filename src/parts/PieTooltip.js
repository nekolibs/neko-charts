import { G, Path } from 'react-native-svg'
import { Platform } from 'react-native'
import { useState, useRef, useMemo, useCallback } from 'react'

import { Tooltip } from './Tooltip'
import { calculateTooltipWidth, calculateTooltipPosition } from '../_helpers/tooltip'
import { useTheme } from '../NekoChartTheme'

// Helper functions from Pie.js
function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  }
}

function createArcPath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  if (innerR === 0) {
    // Pie slice
    const start = polarToCartesian(cx, cy, outerR, endAngle)
    const end = polarToCartesian(cx, cy, outerR, startAngle)
    return `M${cx},${cy} L${start.x},${start.y} A${outerR},${outerR} 0 ${largeArcFlag} 0 ${end.x},${end.y} Z`
  } else {
    // Donut slice
    const startOuter = polarToCartesian(cx, cy, outerR, endAngle)
    const endOuter = polarToCartesian(cx, cy, outerR, startAngle)
    const startInner = polarToCartesian(cx, cy, innerR, startAngle)
    const endInner = polarToCartesian(cx, cy, innerR, endAngle)

    return [
      `M${startOuter.x},${startOuter.y}`,
      `A${outerR},${outerR} 0 ${largeArcFlag} 0 ${endOuter.x},${endOuter.y}`,
      `L${startInner.x},${startInner.y}`,
      `A${innerR},${innerR} 0 ${largeArcFlag} 1 ${endInner.x},${endInner.y}`,
      'Z',
    ].join(' ')
  }
}

/**
 * Pie chart specific tooltip that shows slice data on hover
 */
export function PieTooltip({
  data,
  width,
  height,
  xSpace = 0,
  ySpace = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  innerRadiusRatio = 0,
  sliceSpacing = 0,
  hide,
  tooltipWidth,
  tooltipPadding = 8,
  showPercentage = true,
  theme,
}) {
  theme = useTheme(theme)
  const [hoveredSlice, setHoveredSlice] = useState(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Only render on web
  if (Platform.OS !== 'web' || hide) return null

  // Calculate pie dimensions (same as Pie.js)
  const availableWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const availableHeight = height - ySpace * 2 - paddingTop - paddingBottom
  const size = Math.min(availableWidth, availableHeight)
  const outerRadius = size / 2
  const innerRadius = outerRadius * innerRadiusRatio
  const centerX = xSpace + paddingLeft + availableWidth / 2
  const centerY = ySpace + paddingTop + availableHeight / 2
  const total = data.reduce((sum, item) => sum + item.y, 0)

  // Calculate tooltip dimensions
  const lineHeight = theme.tooltipSize + 4
  const tooltipHeight = useMemo(() => {
    if (!hoveredSlice) return 0
    const items = showPercentage ? 2 : 1 // value and percentage
    return tooltipPadding * 2 + (items + 1) * lineHeight // +1 for title
  }, [hoveredSlice, showPercentage, tooltipPadding, lineHeight])

  // Calculate dynamic tooltip width
  const calculatedTooltipWidth = useMemo(() => {
    if (!hoveredSlice) return tooltipWidth || 120

    const items = [{ label: 'Value', value: hoveredSlice.value }]
    if (showPercentage) {
      items.push({ label: 'Percentage', value: `${hoveredSlice.percentage}%` })
    }

    return calculateTooltipWidth({
      title: hoveredSlice.label,
      items,
      fontSize: theme.tooltipSize,
      padding: tooltipPadding,
      fixedWidth: tooltipWidth,
    })
  }, [hoveredSlice, tooltipWidth, theme.tooltipSize, tooltipPadding, showPercentage])

  // Track mouse movement
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
        if (hoveredSlice) {
          setTooltipPosition(
            calculateTooltipPosition({
              mouseX: mousePositionRef.current.x,
              mouseY: mousePositionRef.current.y,
              tooltipWidth: calculatedTooltipWidth,
              tooltipHeight,
              containerWidth: width,
              containerHeight: height,
              padding: tooltipPadding,
            })
          )
        }
      }
    },
    [hoveredSlice, width, height, calculatedTooltipWidth, tooltipHeight, tooltipPadding]
  )

  // Handle slice hover
  const handleSliceHover = useCallback(
    (slice, index) => {
      setHoveredSlice({
        label: slice.x || slice.label || `Item ${index + 1}`,
        value: slice.y,
        percentage: ((slice.y / total) * 100).toFixed(1),
        index,
      })

      // Set initial tooltip position
      setTooltipPosition(
        calculateTooltipPosition({
          mouseX: mousePositionRef.current.x,
          mouseY: mousePositionRef.current.y,
          tooltipWidth: tooltipWidth || 120,
          tooltipHeight: tooltipPadding * 2 + (showPercentage ? 3 : 2) * lineHeight,
          containerWidth: width,
          containerHeight: height,
          padding: tooltipPadding,
        })
      )
    },
    [total, width, height, tooltipWidth, tooltipPadding, lineHeight, showPercentage]
  )

  const handleSliceOut = useCallback(() => {
    setHoveredSlice(null)
  }, [])

  // Prepare tooltip items
  const tooltipItems = useMemo(() => {
    if (!hoveredSlice) return []

    const items = [
      {
        label: 'Value',
        value: hoveredSlice.value,
      },
    ]

    if (showPercentage) {
      items.push({
        label: 'Percentage',
        value: `${hoveredSlice.percentage}%`,
      })
    }

    return items
  }, [hoveredSlice, showPercentage])

  // Create invisible hover areas over the pie slices
  let cumulativeAngle = 0
  const hoverAreas = data
    .map((slice, i) => {
      const startAngle = cumulativeAngle + sliceSpacing / 2
      const angle = (slice.y / total) * 360 - sliceSpacing
      const endAngle = startAngle + angle
      cumulativeAngle += (slice.y / total) * 360

      // Skip if angle is too small
      if (angle <= 0) return null

      const path = createArcPath(outerRadius, outerRadius, outerRadius, innerRadius, startAngle, endAngle)

      return {
        path,
        slice,
        index: i,
      }
    })
    .filter(Boolean)

  return (
    <G onMouseMove={handleMouseMove}>
      {/* Invisible hover areas */}
      <G transform={`translate(${centerX - outerRadius}, ${centerY - outerRadius})`}>
        {hoverAreas.map(({ path, slice, index }) => (
          <Path
            key={`pie-hover-area-${index}`}
            d={path}
            fill="transparent"
            onMouseEnter={() => handleSliceHover(slice, index)}
            onMouseLeave={handleSliceOut}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </G>

      {/* Tooltip */}
      {hoveredSlice && (
        <Tooltip
          x={tooltipPosition.x}
          y={tooltipPosition.y}
          visible={true}
          title={hoveredSlice.label}
          items={tooltipItems}
          width={calculatedTooltipWidth}
          theme={theme}
        />
      )}
    </G>
  )
}
