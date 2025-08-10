import { Path, G } from 'react-native-svg'

import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale, useTheme } from '../NekoChartTheme'

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

export function Pie({
  data,
  colorsScale,
  width,
  height,
  xSpace = 0,
  ySpace = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  innerRadiusRatio = 0, // 0 for pie, 0.6 for donut (ratio of outer radius)
  sliceSpacing = 0, // Space between slices in degrees
  hide,
  theme,
}) {
  const colors = useColorsScale(colorsScale)
  theme = useTheme(theme)
  if (!!hide) return false

  // Use the actual available space for the pie
  const availableWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const availableHeight = height - ySpace * 2 - paddingTop - paddingBottom
  const size = Math.min(availableWidth, availableHeight)
  const outerRadius = size / 2
  const innerRadius = outerRadius * innerRadiusRatio

  // Center in the available space (not the full width/height)
  const centerX = xSpace + paddingLeft + availableWidth / 2
  const centerY = ySpace + paddingTop + availableHeight / 2
  const total = data.reduce((sum, item) => sum + item.y, 0)

  let cumulativeAngle = 0

  return (
    <G transform={`translate(${centerX - outerRadius}, ${centerY - outerRadius})`}>
      {data.map((slice, i) => {
        const color = slice.color || getColorFromScale(colors, i) || '#818DF9'
        const startAngle = cumulativeAngle + sliceSpacing / 2
        const angle = (slice.y / total) * 360 - sliceSpacing
        const endAngle = startAngle + angle
        cumulativeAngle += (slice.y / total) * 360

        // Skip if angle is too small (happens with spacing)
        if (angle <= 0) return null

        const path = createArcPath(outerRadius, outerRadius, outerRadius, innerRadius, startAngle, endAngle)

        return <Path key={`pie-slice-${i}`} d={path} fill={color} />
      })}
    </G>
  )
}
