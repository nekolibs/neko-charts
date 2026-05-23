import { View } from '@neko-os/ui'

import { AbsCircle } from './abstractions/Circle'
import { AbsSvg } from './abstractions/Svg'

export function SvgTest({ size = 100 }) {
  return (
    <View>
      <AbsSvg height={size} width={size}>
        <AbsCircle cx={size / 2} cy={size / 2} r={size / 3} fill="purple" />
      </AbsSvg>
    </View>
  )
}
