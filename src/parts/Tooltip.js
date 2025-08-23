import React, { useMemo } from 'react'
import { G, Rect, Text } from 'react-native-svg'
import { calculateTooltipWidth } from '../_helpers/tooltip'

/**
 * Generic Tooltip component for displaying data
 * Can be used with any chart type (line, bar, radar, pie, etc.)
 */
export function Tooltip({
  x = 0,
  y = 0,
  visible = false,
  title,
  items = [], // Array of { label, value, color }
  theme,
  width,
  padding = 8,
  opacity = 0.85,
}) {
  if (!visible || !items.length) return null

  const lineHeight = theme.tooltipSize + 4
  const tooltipHeight = useMemo(() => {
    const titleLines = title ? 1 : 0
    return padding * 2 + (items.length + titleLines) * lineHeight
  }, [items.length, title, padding, lineHeight])

  // Calculate dynamic width based on content
  const calculatedWidth = useMemo(() => 
    calculateTooltipWidth({
      title,
      items,
      fontSize: theme.tooltipSize,
      padding,
      fixedWidth: width
    }),
    [title, items, theme.tooltipSize, padding, width]
  )

  return (
    <G transform={`translate(${x}, ${y})`} style={{ pointerEvents: 'none' }}>
      {/* Background */}
      <Rect x={0} y={0} width={calculatedWidth} height={tooltipHeight} fill={theme.tooltipBGColor} rx={4} opacity={opacity} />

      {/* Title */}
      {title && (
        <Text
          x={padding}
          y={padding + theme.tooltipSize}
          fill={theme.tooltipColor}
          fontSize={theme.tooltipSize}
          fontWeight="bold"
        >
          {title}
        </Text>
      )}

      {/* Items */}
      {items.map((item, index) => {
        const yOffset = (title ? index + 1 : index) * lineHeight

        return (
          <G key={`${item.label}-${index}`} transform={`translate(0, ${yOffset})`}>
            {/* Color indicator */}
            {item.color && <Rect x={padding} y={padding + 3} width={8} height={8} fill={item.color} rx={1} />}

            {/* Label */}
            <Text
              x={item.color ? padding + 12 : padding}
              y={padding + theme.tooltipSize}
              fill={theme.tooltipColor}
              fontSize={theme.tooltipSize - 1}
            >
              {item.label}
            </Text>

            {/* Value */}
            <Text
              x={calculatedWidth - padding}
              y={padding + theme.tooltipSize}
              fill={theme.tooltipColor}
              fontSize={theme.tooltipSize - 1}
              textAnchor="end"
              fontWeight="bold"
            >
              {item.value}
            </Text>
          </G>
        )
      })}
    </G>
  )
}
