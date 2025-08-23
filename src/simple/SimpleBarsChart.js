import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { Bars } from '../parts/Bars'
import { BarsLabels } from '../parts/BarsLabels'
import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { XAxisTooltip } from '../parts/XAxisTooltip'

export function SimpleBarsChart({ showTooltip = true, ...props }) {
  return (
    <LegendWrapper {...props}>
      <NekoChart {...props}>
        <Axis spaceAround howXGrid={false} {...props}>
          <Bars {...props} />
          <BarsLabels {...props} />
          <AxisInteractive {...props} />
          <XAxisTooltip hide={!showTooltip} {...props} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}
