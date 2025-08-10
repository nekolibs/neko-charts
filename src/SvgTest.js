import { View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

export function SvgTest({ size = 100 }) {
  return (
    <View>
      <Svg height={size} width={size}>
        <Circle cx={size / 2} cy={size / 2} r={size / 3} fill="green" />
      </Svg>
    </View>
  )
}
