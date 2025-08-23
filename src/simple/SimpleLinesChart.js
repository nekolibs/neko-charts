import { Areas } from '../parts/Areas'
import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LabelsChart } from '../parts/LabelsChart'
import { LegendWrapper } from '../parts/LegendWrapper'
import { Lines } from '../parts/Lines'
import { NekoChart } from '../NekoChart'
import { Scatters } from '../parts/Scatters'
import { XAxisTooltip } from '../parts/XAxisTooltip'

export function SimpleLinesChart({ area = false, showValues = true, showTooltip = true, xSpace = 15, ...props }) {
  return (
    <LegendWrapper {...props}>
      <NekoChart xSpace={15} {...props}>
        <Axis {...props}>
          <Lines {...props} />
          <Scatters {...props} />
          <Areas hide={!area} {...props} />
          <LabelsChart hide={!showValues} {...props} />
          <XAxisTooltip hide={!showTooltip} {...props} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}

export const SimpleAreasChart = (props) => <SimpleLinesChart {...props} area />
