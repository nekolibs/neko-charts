import { View, Text } from '@neko-os/ui'

import { formatChartSeries } from '../_helpers/series'
import { getColorFromScale } from '../_helpers/colors'
import { useColorsScale, useTheme } from '../NekoChartTheme'

const POSITIONS = {
  bottom: { bottom: 30, left: 0, right: 0 },
  topRight: { top: 20, right: 50 },
}

export function Legend({
  data,
  series,
  legendFields,
  legendPosition,
  legendPrefix,
  legendSufix,
  total,
  vertical,
  colorsScale,
  theme,
  hide,
}) {
  const colors = useColorsScale(colorsScale)
  theme = useTheme(theme)
  if (!!hide) return false
  series = formatChartSeries(data)
  data = !series?.[0]?.name ? data : series

  return (
    <View wrap centerV center={!vertical} row={!vertical} gap={!vertical ? 'sm' : 'xxs'}>
      {data?.map((item, index) => {
        let label = item.name || item.label || item.x || item.serie
        // label = formatLabel(label, item.y, { prefix, sufix, fields, total })
        const color = getColorFromScale(colors, index)

        return (
          <View key={index} row centerV gap="xs">
            <View width={theme.legendPointSize} height={theme.legendPointSize} round bg={color} />

            <Text sm color="text2">
              {label}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
