import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { StackedAreas } from '../parts/StackedAreas'
import { StackedLabelsChart } from '../parts/StackedLabelsChart'
import { StackedLines } from '../parts/StackedLines'
import { StackedScatters } from '../parts/StackedScatters'
import { StackedTotalLabelsChart } from '../parts/StackedTotalLabelsChart'

export function SimpleStackedLinesChart({ showTotals = false, area = false, showValues = true, xSpace = 15, ...props }) {
  return (
    <LegendWrapper {...props}>
      <NekoChart xSpace={15} {...props}>
        <Axis {...props}>
          <StackedLines {...props} />
          <StackedScatters {...props} />
          <StackedAreas hide={!area} {...props} />
          <StackedLabelsChart hide={!showValues} {...props} />
          <StackedTotalLabelsChart hide={!showTotals} {...props} />
          <AxisInteractive {...props} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}

export const SimpleStackedAreasChart = (props) => <SimpleStackedLinesChart {...props} area />
