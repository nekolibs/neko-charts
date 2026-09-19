import { Platform } from '@neko-os/ui'

import { calculateTooltipPosition, calculateTooltipWidth } from '../_helpers/tooltip'
import { useTheme } from '../NekoChartTheme'
import { Tooltip } from './Tooltip'

export function MuscleMapTooltip({ title, items = [], position, width, height, hide, tooltipWidth, tooltipPadding = 8, theme }) {
  theme = useTheme(theme)
  if (Platform.OS !== 'web' || !!hide || !title || !position) return null

  const calculatedWidth = calculateTooltipWidth({
    title,
    items,
    fontSize: theme.tooltipSize,
    padding: tooltipPadding,
    fixedWidth: tooltipWidth,
  })
  const tooltipHeight = tooltipPadding * 2 + (items.length + 1) * (theme.tooltipSize + 4)
  const { x, y } = calculateTooltipPosition({
    mouseX: position.x,
    mouseY: position.y,
    tooltipWidth: calculatedWidth,
    tooltipHeight,
    containerWidth: width,
    containerHeight: height,
    padding: tooltipPadding,
  })

  return <Tooltip x={x} y={y} visible title={title} items={items} width={calculatedWidth} padding={tooltipPadding} theme={theme} />
}
