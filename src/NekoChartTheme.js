import { mergeDeepLeft } from 'ramda'
import React, { useCallback, useMemo } from 'react'

import { useTheme as useUITheme, useColors } from '@neko-os/ui'

import { buildChartThemeFromUI, buildColorsScaleFromUI, getColorsScalePreset } from './buildChartTheme'
import { resolveColor } from './_helpers/colors'

const ChartThemeContext = React.createContext()

export const useChartTheme = () => React.useContext(ChartThemeContext) || {}

export function useResolveColor() {
  const themeColors = useColors()
  return useCallback((value) => resolveColor(themeColors, value), [themeColors])
}

export function useColorsScale(customColors) {
  const { colorsScale } = useChartTheme()
  const uiTheme = useUITheme()
  const themeColors = useColors()

  return useMemo(() => {
    const input = customColors || colorsScale
    if (typeof input === 'string') return getColorsScalePreset(input, themeColors)
    if (Array.isArray(input)) return input.map((c) => resolveColor(themeColors, c))
    return buildColorsScaleFromUI(uiTheme)
  }, [customColors, colorsScale, uiTheme, themeColors])
}

export function useTheme(customTheme) {
  const { theme } = useChartTheme()
  const uiTheme = useUITheme()
  const defaultTheme = useMemo(() => buildChartThemeFromUI(uiTheme), [uiTheme])
  return mergeDeepLeft(mergeDeepLeft(customTheme, theme), defaultTheme)
}

export function NekoChartTheme({ children, colorsScale, theme }) {
  return (
    <ChartThemeContext.Provider value={{ theme, colorsScale }}>
      {children}
    </ChartThemeContext.Provider>
  )
}
