import React from 'react'
import { AbsSvg } from '../abstractions/Svg'

export function Wrapper({ width, height, children, ...props }) {
  return (
    <AbsSvg width={width} height={height}>
      {React.Children.map(children, (child) => React.cloneElement(child, { width, height, ...props }))}
    </AbsSvg>
  )
}
