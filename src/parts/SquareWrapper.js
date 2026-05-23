import { View } from '@neko-os/ui'
import React from 'react'
import { AbsSvg } from '../abstractions/Svg'

export function SquareWrapper({ width, height, children, ...props }) {
  const size = Math.min(height, width)

  return (
    <View style={{ alignItems: 'center' }}>
      <AbsSvg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { width: size, height: size, size, ...props })
        )}
      </AbsSvg>
    </View>
  )
}
