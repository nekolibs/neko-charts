import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { StackedBars } from '../parts/StackedBars'
import { StackedBarsLabelsChart } from '../parts/StackedBarsLabelsChart'
import { StackedTotalLabelsChart } from '../parts/StackedTotalLabelsChart'

export function StackedBarsChart({ legend = false, legendPosition = 'bottom', totals = false, values = false, ...props }) {
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...props}>
      <NekoChart {...props}>
        <Axis spaceAround stacked xGrid={false} {...props}>
          <StackedBars {...props} />
          <StackedBarsLabelsChart hide={!values} {...props} />
          <StackedTotalLabelsChart hide={!totals} {...props} />
          <AxisInteractive {...props} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}
