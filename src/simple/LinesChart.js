import { Areas } from '../parts/Areas'
import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LabelsChart } from '../parts/LabelsChart'
import { LegendWrapper } from '../parts/LegendWrapper'
import { Lines } from '../parts/Lines'
import { CHART_PADDING_TOP_LABELS, NekoChart } from '../NekoChart'
import { Scatters } from '../parts/Scatters'
import { XAxisTooltip } from '../parts/XAxisTooltip'

export function LinesChart({ legend = false, legendPosition = 'bottom', area = false, dots = false, dotSize, values = false, tooltip = false, xSpace = 15, chartPaddingTop, ...props }) {
  if (chartPaddingTop === undefined && values) chartPaddingTop = CHART_PADDING_TOP_LABELS
  const allProps = { ...props, chartPaddingTop, xSpace }
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...allProps}>
      <NekoChart {...allProps}>
        <Axis {...allProps}>
          <Lines {...allProps} />
          <Scatters hide={!dots} dotSize={dotSize} {...allProps} />
          <Areas hide={!area} {...allProps} />
          <LabelsChart hide={!values} {...allProps} />
          <XAxisTooltip hide={!tooltip} {...allProps} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}

export const AreasChart = (props) => <LinesChart {...props} area />
