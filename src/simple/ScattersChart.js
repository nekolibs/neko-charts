import { Areas } from '../parts/Areas'
import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LabelsChart } from '../parts/LabelsChart'
import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { Scatters } from '../parts/Scatters'

export function ScattersChart({ legend = false, legendPosition = 'bottom', area = false, values = false, xSpace = 15, ...props }) {
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...props}>
      <NekoChart xSpace={15} {...props}>
        <Axis {...props}>
          <Scatters {...props} />
          <Areas hide={!area} {...props} />
          <LabelsChart hide={!values} {...props} />
          <AxisInteractive {...props} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}
