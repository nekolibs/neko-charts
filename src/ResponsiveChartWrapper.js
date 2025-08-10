import { View } from 'react-native'
import React, { useState } from 'react'

export default function ResponsiveChartWrapper({ children }) {
  const [width, setWidth] = useState(0)

  return (
    <View
      style={{ flex: 1 }}
      onLayout={(event) => {
        const { width: layoutWidth } = event.nativeEvent.layout
        if (layoutWidth !== width) setWidth(layoutWidth)
      }}
    >
      {width > 0 && React.cloneElement(children, { width })}
    </View>
  )
}
