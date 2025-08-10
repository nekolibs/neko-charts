import React from 'react'

import { formatChartSeries } from './_helpers/series'
import ResponsiveChartWrapper from './ResponsiveChartWrapper'

export const CHART_PADDING_TOP = 40
export const CHART_PADDING_BOTTOM = 10

function Content({ height = 200, width, children, data, ...props }) {
  const series = formatChartSeries(data)
  props = { width, height, data, series, ...props }

  return React.Children.map(children, (child) => React.cloneElement(child, props))
}

export function NekoChart({ ...props }) {
  return (
    <ResponsiveChartWrapper>
      <Content {...props} />
    </ResponsiveChartWrapper>
  )
}
