import { Areas } from '../parts/Areas'
import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LabelsChart } from '../parts/LabelsChart'
import { LegendWrapper } from '../parts/LegendWrapper'
import { Lines } from '../parts/Lines'
import { NekoChart } from '../NekoChart'
import { Scatters } from '../parts/Scatters'
import { XAxisTooltip } from '../parts/XAxisTooltip'

export function LinesChart({ legend = false, legendPosition = 'bottom', area = false, dots = false, dotSize, values = false, tooltip = false, xSpace = 15, ...props }) {
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...props}>
      <NekoChart xSpace={15} {...props}>
        <Axis {...props}>
          <Lines {...props} />
          <Scatters hide={!dots} dotSize={dotSize} {...props} />
          <Areas hide={!area} {...props} />
          <LabelsChart hide={!values} {...props} />
          <XAxisTooltip hide={!tooltip} {...props} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}

export const AreasChart = (props) => <LinesChart {...props} area />
