import { Platform } from '@neko-os/ui'
import React from 'react'

import { AbsG } from '../abstractions/G'
import { AbsPath } from '../abstractions/Path'
import { MUSCLE_KEYS } from '../_data/muscles/keys'
import { getMuscleDatum, getMuscleFill, isSideSpecific } from '../_helpers/muscles'

const HOVER_OPACITY = 0.75

function isSameMuscle(index, part, target) {
  if (!target || part.key !== target.muscle) return false
  return !isSideSpecific(index, part.key) || part.side === target.side
}

export const MuscleMap = React.memo(function MuscleMap({
  layout,
  index,
  domain,
  steps,
  color,
  scale,
  resolve,
  bodyColor,
  outline,
  outlineColor,
  outlineWidth = 1,
  hovered,
  onMuscleHover,
  onMuscleHoverOut,
  onMouseMove,
  onMusclePress,
  hide,
}) {
  if (!!hide || !layout) return null

  const isWeb = Platform.OS === 'web'
  const hoverable = isWeb && !!onMuscleHover

  return (
    <AbsG onMouseMove={hoverable ? onMouseMove : undefined}>
      {layout.groups.map(({ body, transform }, groupIndex) => (
        <AbsG key={groupIndex} transform={transform}>
          {!!outline &&
            body.outline.map((d, i) => (
              <AbsPath key={`outline-${i}`} d={d} fill="none" stroke={outlineColor} strokeWidth={outlineWidth / layout.scale} />
            ))}

          {body.parts.map((part, i) => {
            const datum = getMuscleDatum(index, part.key, part.side)
            const fill = getMuscleFill(datum, { domain, steps, color, scale, resolve })
            const interactive = !!datum || MUSCLE_KEYS.includes(part.key)
            const target = { muscle: part.key, side: part.side, value: datum?.value, datum }
            const pathProps = { d: part.d, fill: fill?.fill || bodyColor, fillOpacity: fill?.fillOpacity }

            if (interactive && onMusclePress) pathProps.onPress = () => onMusclePress(target)
            if (interactive && hoverable) {
              pathProps.onMouseEnter = (e) => onMuscleHover(target, e)
              pathProps.onMouseLeave = onMuscleHoverOut
              if (onMusclePress) pathProps.style = { cursor: 'pointer' }
            }
            if (isSameMuscle(index, part, hovered)) pathProps.opacity = HOVER_OPACITY

            return <AbsPath key={i} {...pathProps} />
          })}
        </AbsG>
      ))}
    </AbsG>
  )
})
