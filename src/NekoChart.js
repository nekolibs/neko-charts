import React from 'react'

import { fillSeriesDates } from './_helpers/fillDates'
import { formatChartSeries } from './_helpers/series'
import { useResolveColor } from './NekoChartTheme'
import ResponsiveChartWrapper from './ResponsiveChartWrapper'

export const CHART_PADDING_TOP = 8
export const CHART_PADDING_TOP_LABELS = 20
export const CHART_PADDING_BOTTOM = 10

function resolveSeriesColors(series, resolve) {
  return series.map((s) => ({
    ...s,
    color: resolve(s.color),
    data: s.data?.map((d) => (d.color ? { ...d, color: resolve(d.color) } : d)),
  }))
}

function Content({ height, width, children, data, series: seriesProp, fillEmptyDates, datesPeriod, xMin, xMax, fillValue, ...props }) {
  const resolve = useResolveColor()
  let series = resolveSeriesColors(seriesProp || formatChartSeries(data), resolve)
  if (fillEmptyDates) {
    series = fillSeriesDates(series, { xMin, xMax, datesPeriod, fillValue })
  }
  props = { width, height, data, series, ...props }

  return React.Children.map(children, (child) => React.cloneElement(child, props))
}

export function NekoChart({ width, height, ...props }) {
  return (
    <ResponsiveChartWrapper width={width} height={height}>
      <Content {...props} />
    </ResponsiveChartWrapper>
  )
}
