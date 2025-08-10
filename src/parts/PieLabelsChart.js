import { Text as SvgText, G } from 'react-native-svg'

import { useTheme } from '../NekoChartTheme'

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  }
}

export function PieLabelsChart({
  data,
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
        const startAngle = cumulativeAngle + sliceSpacing / 2
        const angle = (slice.y / total) * 360 - sliceSpacing
        const endAngle = startAngle + angle
        cumulativeAngle += (slice.y / total) * 360

        // Skip if angle is too small (happens with spacing)
        if (angle <= 0) return null

        // Calculate label position (middle of the slice, accounting for spacing)
        const midAngle = startAngle + angle / 2
        // For donut, position between inner and outer radius; for pie, use 65% of radius
        const labelRadius = innerRadiusRatio > 0 ? (outerRadius + innerRadius) / 2 : outerRadius * 0.65
        const labelPos = polarToCartesian(outerRadius, outerRadius, labelRadius, midAngle)

        return (
          <SvgText
            key={`pie-label-${i}`}
            x={labelPos.x}
            y={labelPos.y}
            fill="#fff"
            fontSize={Math.min(theme.labelSize, size * 0.05)}
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            {slice.x}
          </SvgText>
        )
      })}
    </G>
  )
}
