import React from 'react'
import Svg from 'react-native-svg'

export function Wrapper({ width, height, children, ...props }) {
  return (
    <Svg width={width} height={height}>
      {React.Children.map(children, (child) => React.cloneElement(child, { width, height, ...props }))}
    </Svg>
  )
}
