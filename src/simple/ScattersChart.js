import { Areas } from '../parts/Areas'
import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LabelsChart } from '../parts/LabelsChart'
import { LegendWrapper } from '../parts/LegendWrapper'
import { CHART_PADDING_TOP_LABELS, NekoChart } from '../NekoChart'
import { Scatters } from '../parts/Scatters'

export function ScattersChart({ legend = false, legendPosition = 'bottom', area = false, values = false, xSpace = 15, chartPaddingTop, ...props }) {
  if (chartPaddingTop === undefined && values) chartPaddingTop = CHART_PADDING_TOP_LABELS
  const allProps = { ...props, chartPaddingTop }
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...allProps}>
      <NekoChart xSpace={15} {...allProps}>
        <Axis {...allProps}>
          <Scatters {...allProps} />
          <Areas hide={!area} {...allProps} />
          <LabelsChart hide={!values} {...allProps} />
          <AxisInteractive {...allProps} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}
