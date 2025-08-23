import { Polygon, Circle } from 'react-native-svg'
import React from 'react'

import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale, useTheme } from '../NekoChartTheme'

export function Radar({
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
  showPoints = true,
  area = true,
  hide,
  theme,
}) {
  const colors = useColorsScale(colorsScale)
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

  const getPointString = (value, index) => {
    const point = getPoint(value, index)
    return `${point.x},${point.y}`
  }

  return (
    <>
      {/* Render each series */}
      {series.map((serie, serieIndex) => {
        const serieColor = serie.color || getColorFromScale(colors, serieIndex) || '#818DF9'
        const dataPoints = serie.data.map((d, i) => getPointString(d.y, i)).join(' ')

        return (
          <React.Fragment key={serie.name}>
            {/* Data shape/area */}
            <Polygon points={dataPoints} stroke={serieColor} fill="transparent" strokeWidth={2} />
            {area && <Polygon points={dataPoints} fill={serieColor} opacity={0.3} />}

            {/* Data points */}
            {showPoints &&
              serie.data.map((d, i) => {
                const point = getPoint(d.y, i)
                return (
                  <Circle
                    key={`${serie.name}-point-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r={theme.pointSize}
                    fill={serieColor}
                    strokeWidth={2}
                  />
                )
              })}
          </React.Fragment>
        )
      })}
    </>
  )
}
