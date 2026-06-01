import { Axis } from '../parts/Axis'
import { AxisInteractive } from '../parts/AxisInteractive'
import { LegendWrapper } from '../parts/LegendWrapper'
import { CHART_PADDING_TOP_LABELS, NekoChart } from '../NekoChart'
import { StackedAreas } from '../parts/StackedAreas'
import { StackedLabelsChart } from '../parts/StackedLabelsChart'
import { StackedLines } from '../parts/StackedLines'
import { StackedScatters } from '../parts/StackedScatters'
import { StackedTotalLabelsChart } from '../parts/StackedTotalLabelsChart'

export function StackedLinesChart({ legend = false, legendPosition = 'bottom', totals = false, area = true, dots = false, dotSize, values = false, xSpace = 15, chartPaddingTop, ...props }) {
  if (chartPaddingTop === undefined && (values || totals)) chartPaddingTop = CHART_PADDING_TOP_LABELS
  const allProps = { ...props, chartPaddingTop }
  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} {...allProps}>
      <NekoChart xSpace={15} {...allProps}>
        <Axis stacked {...allProps}>
          <StackedLines {...allProps} />
          <StackedScatters hide={!dots} dotSize={dotSize} {...allProps} />
          <StackedAreas hide={!area} {...allProps} />
          <StackedLabelsChart hide={!values} {...allProps} />
          <StackedTotalLabelsChart hide={!totals} {...allProps} />
          <AxisInteractive {...allProps} />
        </Axis>
      </NekoChart>
    </LegendWrapper>
  )
}

export const StackedAreasChart = (props) => <StackedLinesChart {...props} area />
