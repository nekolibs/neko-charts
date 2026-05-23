import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { Bars } from '../parts/Bars'
import { BarsLabels } from '../parts/BarsLabels'
import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { XAxisTooltip } from '../parts/XAxisTooltip'

export function BarsChart({ legend = false, legendPosition = 'bottom', tooltip = false, values = false, xLabels = false, xGrid = false, yLabels = false, yGrid = false, ...props }) {
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...props}>
      <NekoChart {...props}>
        <Axis spaceAround xLabels={xLabels} xGrid={xGrid} yLabels={yLabels} yGrid={yGrid} {...props}>
          <Bars {...props} />
          <BarsLabels hide={!values} {...props} />
          <AxisInteractive {...props} />
          <XAxisTooltip hide={!tooltip} {...props} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}
