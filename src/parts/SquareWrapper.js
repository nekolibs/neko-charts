import React from 'react'
import Svg from 'react-native-svg'

import { View } from 'react-native'

export function SquareWrapper({ width, height, children, ...props }) {
  const size = Math.min(height, width)

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { width: size, height: size, size, ...props })
        )}
      </Svg>
    </View>
  )
}
