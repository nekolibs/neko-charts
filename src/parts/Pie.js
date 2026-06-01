import { AbsG } from '../abstractions/G'
import { AbsPath } from '../abstractions/Path'

import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale, useResolveColor, useTheme } from '../NekoChartTheme'

function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  }
}

function createArcPath(cx, cy, outerR, innerR, startAngle, endAngle, cr) {
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  const angleDeg = endAngle - startAngle
  const maxCr = cr ? Math.min(cr, (angleDeg * Math.PI * outerR) / 360 / 2) : 0
  const outerAngleOffset = maxCr > 0 ? (maxCr / outerR) * (180 / Math.PI) : 0

  if (innerR === 0) {
    const arcStart = polarToCartesian(cx, cy, outerR, endAngle - outerAngleOffset)
    const arcEnd = polarToCartesian(cx, cy, outerR, startAngle + outerAngleOffset)
    const arcLargeFlag = (endAngle - outerAngleOffset) - (startAngle + outerAngleOffset) <= 180 ? '0' : '1'

    if (maxCr <= 0) {
      if (angleDeg >= 359.99) {
        const p1 = polarToCartesian(cx, cy, outerR, startAngle)
        const p2 = polarToCartesian(cx, cy, outerR, startAngle + 180)
        return `M${p1.x},${p1.y} A${outerR},${outerR} 0 0 0 ${p2.x},${p2.y} A${outerR},${outerR} 0 0 0 ${p1.x},${p1.y} Z`
      }
      const start = polarToCartesian(cx, cy, outerR, endAngle)
      const end = polarToCartesian(cx, cy, outerR, startAngle)
      return `M${cx},${cy} L${start.x},${start.y} A${outerR},${outerR} 0 ${largeArcFlag} 0 ${end.x},${end.y} Z`
    }

    const cornerStart = polarToCartesian(cx, cy, outerR, endAngle)
    const cornerEnd = polarToCartesian(cx, cy, outerR, startAngle)
    const lineToStart = lerp(cx, cy, cornerStart.x, cornerStart.y, maxCr)
    const lineFromEnd = lerp(cx, cy, cornerEnd.x, cornerEnd.y, maxCr)
    const tipStart = polarToCartesian(cx, cy, maxCr, endAngle)
    const tipEnd = polarToCartesian(cx, cy, maxCr, startAngle)

    return [
      `M${tipStart.x},${tipStart.y}`,
      `L${lineToStart.x},${lineToStart.y}`,
      `Q${cornerStart.x},${cornerStart.y} ${arcStart.x},${arcStart.y}`,
      `A${outerR},${outerR} 0 ${arcLargeFlag} 0 ${arcEnd.x},${arcEnd.y}`,
      `Q${cornerEnd.x},${cornerEnd.y} ${lineFromEnd.x},${lineFromEnd.y}`,
      `L${tipEnd.x},${tipEnd.y}`,
      `Q${cx},${cy} ${tipStart.x},${tipStart.y}`,
      'Z',
    ].join(' ')
  } else {
    const radialLength = outerR - innerR
    const innerArcLen = (angleDeg * Math.PI * innerR) / 360
    const donutCr = maxCr > 0 ? Math.min(maxCr, radialLength / 2, innerArcLen / 2) : 0
    const innerAngleOffset = donutCr > 0 ? (donutCr / innerR) * (180 / Math.PI) : 0
    const donutOuterAngleOffset = donutCr > 0 ? (donutCr / outerR) * (180 / Math.PI) : 0

    if (donutCr <= 0) {
      if (angleDeg >= 359.99) {
        const mid = startAngle + 180
        const o1 = polarToCartesian(cx, cy, outerR, startAngle)
        const o2 = polarToCartesian(cx, cy, outerR, mid)
        const i1 = polarToCartesian(cx, cy, innerR, startAngle)
        const i2 = polarToCartesian(cx, cy, innerR, mid)
        return [
          `M${o1.x},${o1.y}`,
          `A${outerR},${outerR} 0 0 0 ${o2.x},${o2.y}`,
          `A${outerR},${outerR} 0 0 0 ${o1.x},${o1.y}`,
          `L${i1.x},${i1.y}`,
          `A${innerR},${innerR} 0 0 1 ${i2.x},${i2.y}`,
          `A${innerR},${innerR} 0 0 1 ${i1.x},${i1.y}`,
          'Z',
        ].join(' ')
      }
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

    const outerStart = polarToCartesian(cx, cy, outerR, endAngle)
    const outerArcStart = polarToCartesian(cx, cy, outerR, endAngle - donutOuterAngleOffset)
    const outerArcEnd = polarToCartesian(cx, cy, outerR, startAngle + donutOuterAngleOffset)
    const outerEnd = polarToCartesian(cx, cy, outerR, startAngle)
    const innerStart = polarToCartesian(cx, cy, innerR, startAngle)
    const innerArcStart = polarToCartesian(cx, cy, innerR, startAngle + innerAngleOffset)
    const innerArcEnd = polarToCartesian(cx, cy, innerR, endAngle - innerAngleOffset)
    const innerEnd = polarToCartesian(cx, cy, innerR, endAngle)
    const outerArcFlag = (endAngle - donutOuterAngleOffset) - (startAngle + donutOuterAngleOffset) <= 180 ? '0' : '1'
    const innerArcFlag = (endAngle - innerAngleOffset) - (startAngle + innerAngleOffset) <= 180 ? '0' : '1'

    const rStartFromOuter = lerp(innerStart.x, innerStart.y, outerEnd.x, outerEnd.y, donutCr)
    const rStartFromInner = lerp(outerEnd.x, outerEnd.y, innerStart.x, innerStart.y, donutCr)
    const rEndFromInner = lerp(outerStart.x, outerStart.y, innerEnd.x, innerEnd.y, donutCr)
    const rEndFromOuter = lerp(innerEnd.x, innerEnd.y, outerStart.x, outerStart.y, donutCr)

    return [
      `M${outerArcStart.x},${outerArcStart.y}`,
      `A${outerR},${outerR} 0 ${outerArcFlag} 0 ${outerArcEnd.x},${outerArcEnd.y}`,
      `Q${outerEnd.x},${outerEnd.y} ${rStartFromOuter.x},${rStartFromOuter.y}`,
      `L${rStartFromInner.x},${rStartFromInner.y}`,
      `Q${innerStart.x},${innerStart.y} ${innerArcStart.x},${innerArcStart.y}`,
      `A${innerR},${innerR} 0 ${innerArcFlag} 1 ${innerArcEnd.x},${innerArcEnd.y}`,
      `Q${innerEnd.x},${innerEnd.y} ${rEndFromInner.x},${rEndFromInner.y}`,
      `L${rEndFromOuter.x},${rEndFromOuter.y}`,
      `Q${outerStart.x},${outerStart.y} ${outerArcStart.x},${outerArcStart.y}`,
      'Z',
    ].join(' ')
  }
}

function lerp(x1, y1, x2, y2, dist) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return { x: x1, y: y1 }
  const t = 1 - dist / len
  return { x: x1 + dx * t, y: y1 + dy * t }
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
  innerRadiusRatio = 0,
  sliceSpacing = 0,
  cornerRadius = 0,
  hide,
  theme,
}) {
  const colors = useColorsScale(colorsScale)
  const resolve = useResolveColor()
  theme = useTheme(theme)
  if (!!hide) return false

  const singleItem = data.filter(d => d.y > 0).length === 1
  if (singleItem) cornerRadius = 0

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

  const effectiveOuterRadius = sliceSpacing > 0 ? outerRadius - sliceSpacing : outerRadius
  const effectiveInnerRadius = innerRadiusRatio > 0 ? effectiveOuterRadius * innerRadiusRatio : 0
  let cumulativeAngle = 0

  return (
    <AbsG transform={`translate(${centerX - outerRadius}, ${centerY - outerRadius})`}>
      {data.map((slice, i) => {
        const color = resolve(slice.color) || getColorFromScale(colors, i) || '#818DF9'
        const angle = (slice.y / total) * 360
        const startAngle = cumulativeAngle
        const endAngle = startAngle + angle
        cumulativeAngle += angle

        if (angle <= 0) return null

        const midAngle = startAngle + angle / 2
        const rad = ((midAngle - 90) * Math.PI) / 180
        const dx = sliceSpacing > 0 ? sliceSpacing * Math.cos(rad) : 0
        const dy = sliceSpacing > 0 ? sliceSpacing * Math.sin(rad) : 0

        const path = createArcPath(
          outerRadius + dx,
          outerRadius + dy,
          effectiveOuterRadius,
          effectiveInnerRadius,
          startAngle,
          endAngle,
          cornerRadius,
        )

        return <AbsPath key={`pie-slice-${i}`} d={path} fill={color} />
      })}
    </AbsG>
  )
}
