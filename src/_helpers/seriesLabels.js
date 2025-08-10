import dayjs from 'dayjs'
import { prop } from 'ramda'

import { formatLabel } from './labels'

export function useSeriesLabelsContainerProps({ series, tooltipFields, isDate, yPrefix, ySufix }) {
  return {
    voronoiDimension: 'x',
    cursorDimension: 'x',
    voronoiBlacklist: series.map(prop('name')),
    activateData: true,
    labels: !!tooltipFields?.length
      ? ({ datum }) => {
          const hasX = tooltipFields.includes('x')
          let prefix = ''
          if (hasX && datum.serieIndex === 0) {
            prefix = isDate ? `${dayjs(datum.x).format('DD MMM YYYY')}\n` : `${datum.x}\n`
          }

          const value = formatLabel(datum.serie, datum.y, {
            prefix: yPrefix,
            sufix: ySufix,
            fields: tooltipFields,
          })

          return `${prefix}${value}`
        }
      : [],
  }
}
