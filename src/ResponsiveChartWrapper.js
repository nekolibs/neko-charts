import { View } from 'react-native'
import React, { useState } from 'react'

export default function ResponsiveChartWrapper({ children, style = {} }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  return (
    <View
      style={[
        {
          flex: 1,
          alignSelf: 'stretch',
          minHeight: 50,
          height: '100%',
        },
        style,
      ]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout
        if (width !== dimensions.width || height !== dimensions.height) {
          setDimensions({ width, height })
        }
      }}
    >
      {dimensions.width > 0 &&
        dimensions.height > 0 &&
        React.cloneElement(children, {
          width: dimensions.width,
          height: dimensions.height,
        })}
    </View>
  )
}
