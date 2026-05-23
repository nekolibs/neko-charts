import { LegendWrapper } from '../parts/LegendWrapper'
import { NekoChart } from '../NekoChart'
import { Radar } from '../parts/Radar'
import { RadarAxis } from '../parts/RadarAxis'
import { RadarAxisInteractive } from '../parts/RadarAxisInteractive'
import { RadarLabelsChart } from '../parts/RadarLabelsChart'
import { RadarTooltip } from '../parts/RadarTooltip'
import { SquareWrapper } from '../parts/SquareWrapper'

export function RadarChart({ size, legend = false, legendPosition = 'bottom', values = false, labels = false, tooltip = false, ...props }) {
  if (size) { props.width = size; props.height = size }
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...props}>
      <NekoChart labels={labels} values={values} {...props}>
        <SquareWrapper {...props}>
          <RadarAxis {...props} />
          <Radar {...props} />
          <RadarLabelsChart hide={!values} {...props} />
          <RadarAxisInteractive {...props} />
          <RadarTooltip hide={!tooltip} labels={labels} {...props} />
        </SquareWrapper>
      </NekoChart>
    </LegendWrapper>
  )
}
