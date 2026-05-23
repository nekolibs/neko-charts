import { PieChart } from './PieChart'

export function DonutChart({ innerRadiusRatio = 0.6, sliceSpacing = 0, ...props }) {
  return <PieChart sliceSpacing={sliceSpacing} innerRadiusRatio={innerRadiusRatio} {...props} />
}
