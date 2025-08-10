import { mergeDeepLeft } from 'ramda'
import React from 'react'

const ChartThemeContext = React.createContext()

export const useChartTheme = (customTheme = {}) => {
  return React.useContext(ChartThemeContext) || {}
}

export function useColorsScale(customColors) {
  const defaultColors = [
    '#09A1AB', // Blue
    '#43D658', // Green
    '#F9AA33', // Yellow
    '#F57373', // Red
    '#1685FB', // Bright Blue
  ]
  const { colorsScale } = useChartTheme()

  return customColors || colorsScale || defaultColors
}

export function useTheme(customTheme) {
  const { theme, dark } = useChartTheme()

  const defaultTheme = {
    gridColor: dark ? '#FFFFFF40' : '#1B1C1D40',
    axisColor: dark ? '#FFFFFF40' : '#1B1C1D40',

    labelSize: 9,
    labelColor: dark ? '#FFFFFF40' : '#1B1C1D40',
    valueSize: 9,
    valueColor: dark ? '#ffffff97' : '#1B1C1D97',
    legendSize: 9,
    legendColor: dark ? '#ffffff' : '#1B1C1D',
    legendPointSize: 7,
    pointSize: 3,
  }

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
