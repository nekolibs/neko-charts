import React from 'react'
import { Pressable } from 'react-native'
import { Rect, Circle, Path, G } from 'react-native-svg'
import { useTooltip } from './ChartTooltipProvider'

export function ChartTouchable({ 
  children, 
  tooltipData,
  x = 0,
  y = 0,
  width = 20,
  height = 20,
  onPress,
  longPress = false,
  disabled = false,
  hitSlop = { top: 10, bottom: 10, left: 10, right: 10 },
  shape = 'rect' // 'rect', 'circle'
}) {
  const { showTooltip, hideTooltip, enabled } = useTooltip()
  
  if (!enabled || disabled) {
    return children
  }
  
  const handlePress = () => {
    if (onPress) {
      onPress(tooltipData)
    } else if (tooltipData) {
      const tooltipX = x + (width / 2)
      const tooltipY = shape === 'circle' ? y : y
      
      showTooltip({
        x: tooltipX,
        y: tooltipY,
        data: tooltipData
      })
    }
  }

  const handlePressOut = () => {
    if (!longPress) {
      hideTooltip()
    }
  }

  // For SVG elements, we wrap with a transparent touchable area
  return (
    <G>
      {children}
      <Rect
        x={x - hitSlop.left}
        y={y - hitSlop.top}
        width={width + hitSlop.left + hitSlop.right}
        height={height + hitSlop.top + hitSlop.bottom}
        fill="transparent"
        onPress={!longPress ? handlePress : undefined}
        onLongPress={longPress ? handlePress : undefined}
        onPressOut={handlePressOut}
      />
    </G>
  )
}

// Specialized touchable for circular shapes (pie charts, points)
export function ChartTouchableCircle({
  children,
  tooltipData,
  cx = 0,
  cy = 0,
  r = 10,
  onPress,
  longPress = false,
  disabled = false,
  hitSlop = 10
}) {
  const { showTooltip, hideTooltip, enabled } = useTooltip()
  
  if (!enabled || disabled) {
    return children
  }
  
  const handlePress = () => {
    if (onPress) {
      onPress(tooltipData)
    } else if (tooltipData) {
      showTooltip({
        x: cx,
        y: cy,
        data: tooltipData
      })
    }
  }

  const handlePressOut = () => {
    if (!longPress) {
      hideTooltip()
    }
  }

  return (
    <G>
      {children}
      <Circle
        cx={cx}
        cy={cy}
        r={r + hitSlop}
        fill="transparent"
        onPress={!longPress ? handlePress : undefined}
        onLongPress={longPress ? handlePress : undefined}
        onPressOut={handlePressOut}
      />
    </G>
  )
}

// Specialized touchable for pie/donut slices
export function ChartTouchableSlice({
  children,
  tooltipData,
  centerX,
  centerY,
  startAngle,
  endAngle,
  innerRadius = 0,
  outerRadius,
  onPress,
  longPress = false,
  disabled = false
}) {
  const { showTooltip, hideTooltip, enabled } = useTooltip()
  
  if (!enabled || disabled) {
    return children
  }
  
  const handlePress = (event) => {
    if (!tooltipData) return
    
    // Calculate touch point relative to SVG
    const { locationX, locationY } = event.nativeEvent
    const dx = locationX - centerX
    const dy = locationY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Check if within radius bounds
    if (distance < innerRadius || distance > outerRadius) {
      return
    }
    
    // Calculate angle of touch point
    let angle = Math.atan2(dy, dx) * 180 / Math.PI
    angle = (angle + 360 + 90) % 360 // Normalize and adjust for top start
    
    // Normalize angles for comparison
    let normalizedStart = (startAngle + 360) % 360
    let normalizedEnd = (endAngle + 360) % 360
    
    // Handle angle crossing 0
    let isInSlice = false
    if (normalizedStart <= normalizedEnd) {
      isInSlice = angle >= normalizedStart && angle <= normalizedEnd
    } else {
      isInSlice = angle >= normalizedStart || angle <= normalizedEnd
    }
    
    if (isInSlice) {
      if (onPress) {
        onPress(tooltipData)
      } else {
        // Position tooltip at optimal location
        const tooltipAngle = (startAngle + endAngle) / 2
        const tooltipRadius = innerRadius 
          ? (innerRadius + outerRadius) / 2  // Donut: middle of ring
          : outerRadius * 0.7  // Pie: closer to center
          
        const tooltipX = centerX + tooltipRadius * Math.cos((tooltipAngle - 90) * Math.PI / 180)
        const tooltipY = centerY + tooltipRadius * Math.sin((tooltipAngle - 90) * Math.PI / 180)
        
        showTooltip({
          x: tooltipX,
          y: tooltipY,
          data: tooltipData,
          position: 'auto'
        })
      }
    }
  }

  const handlePressOut = () => {
    if (!longPress) {
      hideTooltip()
    }
  }

  // Create invisible overlay path for the slice
  const createSlicePath = () => {
    const startAngleRad = (startAngle - 90) * Math.PI / 180
    const endAngleRad = (endAngle - 90) * Math.PI / 180
    
    const x1 = centerX + outerRadius * Math.cos(startAngleRad)
    const y1 = centerY + outerRadius * Math.sin(startAngleRad)
    const x2 = centerX + outerRadius * Math.cos(endAngleRad)
    const y2 = centerY + outerRadius * Math.sin(endAngleRad)
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    
    let path = `M ${centerX} ${centerY}`
    
    if (innerRadius > 0) {
      // Donut path
      const x3 = centerX + innerRadius * Math.cos(startAngleRad)
      const y3 = centerY + innerRadius * Math.sin(startAngleRad)
      const x4 = centerX + innerRadius * Math.cos(endAngleRad)
      const y4 = centerY + innerRadius * Math.sin(endAngleRad)
      
      path = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x3} ${y3} Z`
    } else {
      // Pie path
      path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    }
    
    return path
  }

  return (
    <G>
      {children}
      <Path
        d={createSlicePath()}
        fill="transparent"
        onPress={!longPress ? handlePress : undefined}
        onLongPress={longPress ? handlePress : undefined}
        onPressOut={handlePressOut}
      />
    </G>
  )
}