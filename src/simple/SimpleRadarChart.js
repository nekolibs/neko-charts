import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { Radar } from '../parts/Radar'
import { RadarAxis } from '../parts/RadarAxis'
import { RadarAxisInteractive } from '../parts/RadarAxisInteractive'
import { RadarLabelsChart } from '../parts/RadarLabelsChart'
import { RadarTooltip } from '../parts/RadarTooltip'
import { SquareWrapper } from '../parts/SquareWrapper'

export function SimpleRadarChart({ height = 400, showValues = true, showLabels = true, showTooltip = true, ...props }) {
  return (
    <LegendWrapper {...props}>
      <NekoChart height={height} showLabels={showLabels} showValues={showValues} {...props}>
        <SquareWrapper {...props}>
          <RadarAxis {...props} />
          <Radar {...props} />
          <RadarLabelsChart hide={!showValues} {...props} />
          <RadarAxisInteractive {...props} />
          <RadarTooltip hide={!showTooltip} showLabels={showLabels} {...props} />
        </SquareWrapper>
      </NekoChart>
    </LegendWrapper>
  )
}
