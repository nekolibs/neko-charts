import { mergeDeepLeft } from 'ramda'
import React from 'react'

import { getDefaultTheme } from './defaultTheme'

const ChartThemeContext = React.createContext()

export const useChartTheme = (customTheme = {}) => {
  return React.useContext(ChartThemeContext) || {}
}

export function useColorsScale(customColors) {
  const defaultColors = [
    'rgb(60, 161, 255)', // blue
    'rgb(41, 217, 117)', // green
    'rgb(60, 220, 255)', // cyan
    'rgb(255, 165, 60)', // orange
    '#722ed1', // purple
    '#2f54eb', // geekblue
    '#f5222d', // red
    '#fa8c16', // orange (again)
  ]
  const { colorsScale } = useChartTheme()

  return customColors || colorsScale || defaultColors
}

export function useTheme(customTheme) {
  const { theme, dark } = useChartTheme()

  const defaultTheme = getDefaultTheme(dark)

  return mergeDeepLeft(mergeDeepLeft(customTheme, theme), defaultTheme)
}

export function NekoChartTheme({ children, colorsScale, theme, dark }) {
  return (
    <ChartThemeContext.Provider
      value={{
        theme,
        colorsScale,
        dark,
      }}
    >
      {children}
    </ChartThemeContext.Provider>
  )
}
