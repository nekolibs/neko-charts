import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { Pie } from '../parts/Pie'
import { PieLabelsChart } from '../parts/PieLabelsChart'
import { SquareWrapper } from '../parts/SquareWrapper'

export function SimpleDonutChart({ innerRadiusRatio = 0.6, sliceSpacing = 0, ...props }) {
  return (
    <LegendWrapper {...props}>
      <NekoChart {...props}>
        <SquareWrapper sliceSpacing={sliceSpacing} innerRadiusRatio={innerRadiusRatio} {...props}>
          <Pie {...props} />
          <PieLabelsChart {...props} />
        </SquareWrapper>
      </NekoChart>
    </LegendWrapper>
  )
}
