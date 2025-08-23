import { SimplePieChart } from './SimplePieChart'

export function SimpleDonutChart({ innerRadiusRatio = 0.6, sliceSpacing = 0, ...props }) {
  return <SimplePieChart sliceSpacing={sliceSpacing} innerRadiusRatio={innerRadiusRatio} {...props} />
}
