import { View, Text } from 'react-native'
import { SimpleDonutChart } from './SimpleDonutChart'

export function SimpleProgressDonutChart({ value, target = 100, size = 80, color, trackColor = 'transparent', innerRadiusRatio = 0.75, label, ...props }) {
  const pct = Math.round(Math.max(0, Math.min(100, ((value || 0) / target) * 100)))
  const data = [
    { y: value || 0, color },
    { y: Math.max(0, target - (value || 0)), color: trackColor },
  ]

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <SimpleDonutChart data={data} showTooltip={false} theme={{ labelSize: 0 }} innerRadiusRatio={innerRadiusRatio} {...props} />
      {label !== false && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: size * 0.2, fontWeight: '600' }}>{label ?? `${pct}%`}</Text>
        </View>
      )}
    </View>
  )
}
