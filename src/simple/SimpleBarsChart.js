import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { Bars } from '../parts/Bars'
import { BarsLabels } from '../parts/BarsLabels'
import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'

export function SimpleBarsChart(props) {
  return (
    <LegendWrapper {...props}>
      <NekoChart {...props}>
        <Axis spaceAround howXGrid={false} {...props}>
          <Bars {...props} />
          <BarsLabels {...props} />
          <AxisInteractive {...props} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}
