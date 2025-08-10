import { View } from 'react-native'
import React from 'react'

import { Legend } from './Legend'

const POSITIONS = {
  bottom: { bottom: 30, left: 0, right: 0 },
  topRight: { top: 20, right: 50 },
}

export function LegendWrapper({ legendPosition, showLegend, legendFields, children, ...props }) {
  let before = false
  let after = false
  let style = {}

  const vertical = ['left', 'right'].includes(legendPosition)
  if (['top', 'left'].includes(legendPosition)) before = <Legend vertical={vertical} {...props} />
  if (['bottom', 'right'].includes(legendPosition)) after = <Legend vertical={vertical} {...props} />
  if (['left', 'right'].includes(legendPosition)) {
    style.flexDirection = 'row'
    style.gap = 10
    style.alignItems = 'center'
  }

  return (
    <View style={style}>
      {before}
      <View style={{ flex: 4 }}>
        {React.Children.map(children, (child) => React.cloneElement(child, { showLegend, legendFields, ...props }))}
      </View>
      {after}
    </View>
  )
}
