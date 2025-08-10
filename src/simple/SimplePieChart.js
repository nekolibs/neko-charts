import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { Pie } from '../parts/Pie'
import { PieLabelsChart } from '../parts/PieLabelsChart'
import { SquareWrapper } from '../parts/SquareWrapper'

export function SimplePieChart(props) {
  return (
    <LegendWrapper {...props}>
      <NekoChart {...props}>
        <SquareWrapper {...props}>
          <Pie {...props} />
          <PieLabelsChart theme={{ labelSize: 15 }} {...props} />
        </SquareWrapper>
      </NekoChart>
    </LegendWrapper>
  )
}
