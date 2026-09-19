import { View, Text } from '@neko-os/ui'

import { getHeatScale, getIntensityFill, getMuscleDomain } from '../_helpers/muscles'
import { useColorsScale, useResolveColor } from '../NekoChartTheme'

const DEFAULT_STEPS = 5

export function HeatmapLegend({ data, color = 'red', colorsScale, min, max, steps, formatValue, vertical, hide }) {
  const resolve = useResolveColor()
  const scaleColors = useColorsScale(colorsScale)
  if (!!hide) return false

  const scale = colorsScale ? getHeatScale(scaleColors, steps) : undefined
  const domain = getMuscleDomain(data, min, max)
  const count = scale?.length || (steps > 0 ? steps : DEFAULT_STEPS)
  const format = (v) => String(formatValue ? formatValue(v) : v)
  const swatches = Array.from({ length: count }, (_, i) => getIntensityFill((i + 1) / count, { color: resolve(color), scale }))
  if (vertical) swatches.reverse()

  return (
    <View row={!vertical} center gap="xs">
      <Text sm color="text2">
        {format(vertical ? domain.max : domain.min)}
      </Text>

      <View row={!vertical} br="xxxs" hiddenOverflow>
        {swatches.map((swatch, i) => (
          <View key={i} width={vertical ? 10 : 18} height={vertical ? 18 : 10} bg={swatch.fill} opacity={swatch.fillOpacity} />
        ))}
      </View>

      <Text sm color="text2">
        {format(vertical ? domain.min : domain.max)}
      </Text>
    </View>
  )
}
