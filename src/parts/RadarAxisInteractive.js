import { Path } from 'react-native-svg'
import { Platform } from 'react-native'

export function RadarAxisInteractive({
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
  onAxisPress = console.log,
  onAxisHover,
  onAxisHoverOut,
  hide,
}) {
  if (!!hide || (!onAxisPress && !onAxisHover)) return null

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

  return (
    <>
      {axisLabels.map((axisData, i) => {
        // Create a pie-slice shaped touch area for each axis
        const startAngle = angleSlice * i - angleSlice / 2 - Math.PI / 2
        const endAngle = angleSlice * i + angleSlice / 2 - Math.PI / 2

        // Calculate points for the slice path
        const x1 = centerX + radius * Math.cos(startAngle)
        const y1 = centerY + radius * Math.sin(startAngle)
        const x2 = centerX + radius * Math.cos(endAngle)
        const y2 = centerY + radius * Math.sin(endAngle)

        const largeArcFlag = angleSlice > Math.PI ? 1 : 0

        // Create path for the slice
        const slicePath = [`M ${centerX} ${centerY}`, `L ${x1} ${y1}`, `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, 'Z'].join(
          ' ',
        )

        // Get all Y values for this axis across all series
        const axisInfo = {
          axis: axisData.x,
          index: i,
          values: series
            .map((s) => ({
              serie: s.serie,
              y: s.data[i]?.y,
              color: s.color,
            }))
            .filter((v) => v.y !== null && v.y !== undefined), // Filter out null values
        }

        const pathProps = {
          key: `radar-interactive-${i}`,
          d: slicePath,
          fill: 'transparent',
          onPress: onAxisPress ? () => onAxisPress(axisInfo) : undefined,
        }

        // Add hover props only on web
        if (Platform.OS === 'web' && onAxisHover) {
          pathProps.onMouseEnter = () => onAxisHover(axisInfo)
          pathProps.onMouseLeave = () => onAxisHoverOut && onAxisHoverOut(axisInfo)
          pathProps.style = { cursor: 'pointer' }
        }

        return <Path {...pathProps} />
      })}
    </>
  )
}
