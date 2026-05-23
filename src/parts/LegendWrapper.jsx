import { View } from '@neko-os/ui'
import React from 'react'

import { Legend } from './Legend'

const POSITIONS = {
  bottom: { bottom: 30, left: 0, right: 0 },
  topRight: { top: 20, right: 50 },
}

export function LegendWrapper({ legendPosition, legendFields, width, height, children, ...props }) {
  let before = false
  let after = false

  const vertical = ['left', 'right'].includes(legendPosition)
  if (['top', 'left'].includes(legendPosition)) before = <Legend vertical={vertical} {...props} />
  if (['bottom', 'right'].includes(legendPosition)) after = <Legend vertical={vertical} {...props} />

  const isFixed = width > 0 && height > 0

  return (
    <View row={vertical} fullW={!isFixed} fullH={!isFixed} gap="md" center={vertical} flex={!isFixed}>
      {before}
      <View style={isFixed ? { width, height } : { flex: 4, alignSelf: 'stretch' }}>
        {React.Children.map(children, (child) => React.cloneElement(child, { legendFields, width, height, ...props }))}
      </View>
      {after}
    </View>
  )
}
