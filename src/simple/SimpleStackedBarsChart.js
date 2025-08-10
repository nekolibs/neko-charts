import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { StackedBars } from '../parts/StackedBars'
import { StackedBarsLabelsChart } from '../parts/StackedBarsLabelsChart'
import { StackedTotalLabelsChart } from '../parts/StackedTotalLabelsChart'

export function SimpleStackedBarsChart({ showTotals = false, showValues = true, ...props }) {
  return (
    <LegendWrapper {...props}>
      <NekoChart {...props}>
        <Axis spaceAround showXGrid={false} {...props}>
          <StackedBars {...props} />
          <StackedBarsLabelsChart hide={!showValues} {...props} />
          <StackedTotalLabelsChart hide={!showTotals} {...props} />
          <AxisInteractive {...props} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}
