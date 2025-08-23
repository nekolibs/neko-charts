import { Text as SvgText } from 'react-native-svg'

import { formatLargeNumber } from '../_helpers/numbers'
import { useTheme } from '../NekoChartTheme'

export function StackedTotalLabelsChart({
  series,
  width,
  height,
  xSpace = 15,
  ySpace = 0,
  paddingLeft = 0,
  paddingRight = 0,
  paddingTop = 0,
  paddingBottom = 0,
  spaceAround = true,
  hide,
  theme,
}) {
  theme = useTheme(theme)
  if (!!hide) return false

  // Calculate chart dimensions
  const chartWidth = width - xSpace * 2 - paddingLeft - paddingRight
  const chartHeight = height - ySpace * 2 - paddingTop - paddingBottom

  // Find max value (sum of all series at each point)
  const maxValue = Math.max(...series[0].data.map((_, i) => series.reduce((sum, s) => sum + (s.data[i]?.y || 0), 0)))

  // Get x points length
  const xPoints = series[0]?.data?.length || 0

  // Calculate totals for each x point
  const totals = series[0].data.map((_, i) => series.reduce((sum, s) => sum + (s.data[i]?.y || 0), 0))

  // Calculate positioning based on spaceAround (for future compatibility with other stacked charts)
  let stepX
  if (spaceAround) {
    stepX = chartWidth / xPoints
  } else {
    stepX = xPoints > 1 ? chartWidth / (xPoints - 1) : chartWidth
  }

  return (
    <>
      {totals.map((total, i) => {
        const totalHeight = (total / maxValue) * (chartHeight - 40)

        const x = spaceAround
          ? xSpace + paddingLeft + i * stepX + stepX / 2 // Center in space
          : xSpace + paddingLeft + i * stepX // End-to-end

        const y = ySpace + paddingTop + (chartHeight - totalHeight - 20)

        return (
          <SvgText
            key={`total-${i}`}
            x={x}
            y={y - 5}
            fontSize={theme.valueSize}
            fill={theme.valueColor}
            alignmentBaseline="baseline"
            textAnchor="middle"
          >
            {formatLargeNumber(total)}
          </SvgText>
        )
      })}
    </>
  )
}
