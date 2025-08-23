import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { Pie } from '../parts/Pie'
import { PieLabelsChart } from '../parts/PieLabelsChart'
import { PieTooltip } from '../parts/PieTooltip'
import { SquareWrapper } from '../parts/SquareWrapper'

export function SimplePieChart({ showTooltip = true, ...props }) {
  return (
    <LegendWrapper {...props}>
      <NekoChart {...props}>
        <SquareWrapper {...props}>
          <Pie {...props} />
          <PieLabelsChart theme={{ labelSize: 15 }} {...props} />
          <PieTooltip hide={!showTooltip} {...props} />
        </SquareWrapper>
      </NekoChart>
    </LegendWrapper>
  )
}
