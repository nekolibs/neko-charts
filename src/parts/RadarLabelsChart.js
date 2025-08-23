import { Text as SvgText } from 'react-native-svg'
import React from 'react'

import { formatLargeNumber } from '../_helpers/numbers'
import { useTheme } from '../NekoChartTheme'

export function RadarLabelsChart({
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

  // Use first series for structure
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

  return (
    <>
      {/* Value labels for each series */}
      {series.map((serie, serieIndex) => {
        return (
          <React.Fragment key={`${serie.name}-values`}>
            {serie.data.map((d, i) => {
              const point = getPoint(d.y, i)
              return (
                <SvgText
                  key={`${serie.name}-value-${i}`}
                  x={point.x}
                  y={point.y - 8}
                  fontSize={theme.valueSize}
                  fill={theme.valueColor}
                  textAnchor="middle"
                  alignmentBaseline="baseline"
                >
                  {formatLargeNumber(d.y)}
                </SvgText>
              )
            })}
          </React.Fragment>
        )
      })}
    </>
  )
}
