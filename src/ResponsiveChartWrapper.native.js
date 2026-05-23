import { View } from 'react-native'
import React, { useState } from 'react'

export default function ResponsiveChartWrapper({ children, style = {}, width: fixedWidth, height: fixedHeight, ...props }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const isFixed = fixedWidth > 0 && fixedHeight > 0

  if (isFixed) {
    return (
      <View style={[{ width: fixedWidth, height: fixedHeight }, style]}>
        {React.cloneElement(children, { ...props, width: fixedWidth, height: fixedHeight })}
      </View>
    )
  }

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
          ...props,
          width: dimensions.width,
          height: dimensions.height,
        })}
    </View>
  )
}
