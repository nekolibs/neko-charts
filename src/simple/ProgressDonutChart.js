import { View, Text } from '@neko-os/ui'
import { useColorsScale, useResolveColor } from '../NekoChartTheme'
import { DonutChart } from './DonutChart'

export function ProgressDonutChart({
  value,
  target = 100,
  size = 80,
  color: colorProp,
  trackColor: trackColorProp,
  hideTrack,
  innerRadiusRatio = 0.75,
  label,
  labelSize,
  labelColor,
  labelWeight = 800,
  ...props
}) {
  const resolve = useResolveColor()
  const colors = useColorsScale()
  const color = resolve(colorProp) || colors[0]
  const trackColor = resolve(trackColorProp)
  const pct = Math.round(Math.max(0, Math.min(100, ((value || 0) / target) * 100)))
  const resolvedTrackColor = hideTrack ? 'transparent' : trackColor || (color ? `${color}20` : 'transparent')
  const data = [
    { y: value || 0, color },
    { y: Math.max(0, target - (value || 0)), color: resolvedTrackColor },
  ]

  return (
    <View relative width={size} height={size}>
      <DonutChart data={data} tooltip={false} labels={false} innerRadiusRatio={innerRadiusRatio} {...props} />
      {label !== false && (
        <View absoluteFill center>
          <Text size={labelSize ?? Math.round(size * 0.22)} color={labelColor ?? color} weight={labelWeight} center>
            {label ?? `${pct}%`}
          </Text>
        </View>
      )}
    </View>
  )
}
