import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { StackedAreas } from '../parts/StackedAreas'
import { StackedLabelsChart } from '../parts/StackedLabelsChart'
import { StackedLines } from '../parts/StackedLines'
import { StackedScatters } from '../parts/StackedScatters'
import { StackedTotalLabelsChart } from '../parts/StackedTotalLabelsChart'

export function StackedLinesChart({ legend = false, legendPosition = 'bottom', totals = false, area = true, dots = false, dotSize, values = false, xSpace = 15, ...props }) {
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...props}>
      <NekoChart xSpace={15} {...props}>
        <Axis stacked {...props}>
          <StackedLines {...props} />
          <StackedScatters hide={!dots} dotSize={dotSize} {...props} />
          <StackedAreas hide={!area} {...props} />
          <StackedLabelsChart hide={!values} {...props} />
          <StackedTotalLabelsChart hide={!totals} {...props} />
          <AxisInteractive {...props} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}

export const StackedAreasChart = (props) => <StackedLinesChart {...props} area />
