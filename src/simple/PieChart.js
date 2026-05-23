import { Text } from '@neko-os/ui'

import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { Pie } from '../parts/Pie'
import { PieLabelsChart } from '../parts/PieLabelsChart'
import { PieTooltip } from '../parts/PieTooltip'
import { SquareWrapper } from '../parts/SquareWrapper'

export function PieChart({ size, legend = false, legendPosition = 'bottom', labels = false, tooltip = false, labelSize = 15, ...props }) {
  if (size) { props.width = size; props.height = size }
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...props}>
      <NekoChart {...props}>
        <SquareWrapper {...props}>
          <Pie {...props} />
          <PieLabelsChart hide={!labels} labelSize={labelSize} {...props} />
          <PieTooltip hide={!tooltip} {...props} />
        </SquareWrapper>
      </NekoChart>
    </LegendWrapper>
  )
}
