import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { Bars } from '../parts/Bars'
import { BarsLabels } from '../parts/BarsLabels'
import { LegendWrapper } from '../parts/LegendWrapper'
import { CHART_PADDING_TOP_LABELS, NekoChart } from '../NekoChart'
import { XAxisTooltip } from '../parts/XAxisTooltip'

export function BarsChart({ legend = false, legendPosition = 'bottom', tooltip = false, values = false, xLabels = false, xGrid = false, yLabels = false, yGrid = false, chartPaddingTop, ...props }) {
  if (chartPaddingTop === undefined && values) chartPaddingTop = CHART_PADDING_TOP_LABELS
  const allProps = { ...props, chartPaddingTop }
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...allProps}>
      <NekoChart {...allProps}>
        <Axis spaceAround xLabels={xLabels} xGrid={xGrid} yLabels={yLabels} yGrid={yGrid} {...allProps}>
          <Bars {...allProps} />
          <BarsLabels hide={!values} {...allProps} />
          <AxisInteractive {...allProps} />
          <XAxisTooltip hide={!tooltip} {...allProps} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}
