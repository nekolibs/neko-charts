import { View, Text } from 'react-native'

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
  showLegend,
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

  // if (!data?.length || (!showLegend && !fields?.length)) return false

  return (
    <View
      style={{
        flexDirection: !vertical && 'row',
        justifyContent: 'center',
        // alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
      }}
    >
      {data?.map((item, index) => {
        let label = item.name || item.label || item.x || item.serie
        // label = formatLabel(label, item.y, { prefix, sufix, fields, total })
        const color = getColorFromScale(colors, index)

        return (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View
              style={{
                width: theme.legendPointSize,
                height: theme.legendPointSize,
                borderRadius: theme.legendPointSize,
                backgroundColor: color,
              }}
            />

            <Text style={{ fontSize: theme.legendSize, color: theme.legendColor }}>{label}</Text>
          </View>
        )
      })}
    </View>
  )
}
