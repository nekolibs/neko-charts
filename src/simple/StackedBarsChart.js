import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LegendWrapper } from '../parts/LegendWrapper'
import { CHART_PADDING_TOP_LABELS, NekoChart } from '../NekoChart'
import { StackedBars } from '../parts/StackedBars'
import { StackedBarsLabelsChart } from '../parts/StackedBarsLabelsChart'
import { StackedTotalLabelsChart } from '../parts/StackedTotalLabelsChart'

export function StackedBarsChart({ legend = false, legendPosition = 'bottom', totals = false, values = false, chartPaddingTop, ...props }) {
  if (chartPaddingTop === undefined && (values || totals)) chartPaddingTop = CHART_PADDING_TOP_LABELS
  const allProps = { ...props, chartPaddingTop }
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...allProps}>
      <NekoChart {...allProps}>
        <Axis spaceAround stacked xGrid={false} {...allProps}>
          <StackedBars {...allProps} />
          <StackedBarsLabelsChart hide={!values} {...allProps} />
          <StackedTotalLabelsChart hide={!totals} {...allProps} />
          <AxisInteractive {...allProps} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}
