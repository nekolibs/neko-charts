import { Polygon, Line, Text as SvgText } from 'react-native-svg'

import { useTheme } from '../NekoChartTheme'

export function RadarAxis({
  series,
  width,
  height,
  xSpace = 20,
  ySpace = 20,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  showLabels = true,
  showGrid = true,
  levels = 5,
  hide,
  theme,
}) {
  theme = useTheme(theme)
  if (!!hide) return false

  // Calculate available space
  const availableWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const availableHeight = height - ySpace * 2 - paddingTop - paddingBottom
  const size = Math.min(availableWidth, availableHeight)
  const centerX = xSpace + paddingLeft + availableWidth / 2
  const centerY = ySpace + paddingTop + availableHeight / 2

  // Find max value across all series
  const maxValue = Math.max(...series.flatMap((s) => s.data.map((d) => d.y)))

  // Use first series for axis labels (assuming all series have same structure)
  const axisLabels = series[0]?.data || []
  const angleSlice = (Math.PI * 2) / axisLabels.length
  const radius = size / 2 - (showLabels ? 30 : 10)

  const getPoint = (value, index) => {
    const angle = angleSlice * index - Math.PI / 2
    const r = (value / maxValue) * radius
    const x = centerX + r * Math.cos(angle)
    const y = centerY + r * Math.sin(angle)
    return { x, y }
  }

  const getPointString = (value, index) => {
    const point = getPoint(value, index)
    return `${point.x},${point.y}`
  }

  // Generate grid polygons
  const gridPolygons = []
  if (showGrid) {
    for (let lvl = 1; lvl <= levels; lvl++) {
      const points = axisLabels.map((_, i) => getPointString((maxValue / levels) * lvl, i)).join(' ')
      gridPolygons.push(points)
    }
  }

  return (
    <>
      {/* Grid levels */}
      {showGrid &&
        gridPolygons.map((points, i) => (
          <Polygon key={`grid-${i}`} points={points} fill="none" stroke={theme.gridColor} strokeWidth={1} opacity={0.3} />
        ))}

      {/* Axes */}
      {showGrid &&
        axisLabels.map((_, i) => {
          const point = getPoint(maxValue, i)
          return (
            <Line
              key={`axis-${i}`}
              x1={centerX}
              y1={centerY}
              x2={point.x}
              y2={point.y}
              stroke={theme.gridColor}
              strokeWidth={1}
              opacity={0.3}
            />
          )
        })}

      {/* Axis Labels */}
      {showLabels &&
        axisLabels.map((d, i) => {
          const angle = angleSlice * i - Math.PI / 2
          const labelRadius = radius + 1.7 * theme.labelSize
          const x = centerX + labelRadius * Math.cos(angle)
          const y = centerY + labelRadius * Math.sin(angle)
          return (
            <SvgText
              key={`label-${i}`}
              x={x}
              y={y}
              fontSize={theme.labelSize}
              fill={theme.valueColor}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {d.x}
            </SvgText>
          )
        })}
    </>
  )
}
