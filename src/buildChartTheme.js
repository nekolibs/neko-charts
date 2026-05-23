export function buildChartThemeFromUI(uiTheme) {
  const { colors, texts } = uiTheme

  return {
    gridColor: colors.text4_op90,
    axisColor: colors.text4_op90,
    labelSize: texts.xs.fontSize,
    labelColor: colors.text4,
    valueSize: texts.sm.fontSize,
    valueColor: colors.text3,
    legendSize: texts.sm.fontSize,
    legendColor: colors.text2,
    legendPointSize: 9,
    pointSize: 2,
    tooltipSize: texts.p.fontSize,
    tooltipLineColor: colors.text4,
    tooltipBGColor: colors.text,
    tooltipColor: colors.overlayBG,
  }
}

export function buildColorsScaleFromUI(uiTheme) {
  const c = uiTheme.colors
  return [
    c.blue,
    c.green,
    c.cyan,
    c.orange,
    c.purple,
    c.indigo,
    c.red,
    c.pink,
    c['blue+10'],
    c['green+10'],
    c['cyan+10'],
    c['orange+10'],
    c['purple+10'],
    c['indigo+10'],
    c['red+10'],
    c['pink+10'],
  ]
}

function shades(c, name) {
  return [c[name], c[`${name}+10`], c[`${name}-10`], c[`${name}+20`], c[`${name}-20`]]
}

export function getColorsScalePreset(name, colors) {
  const presets = {
    default: [
      colors.blue,
      colors.green,
      colors.cyan,
      colors.orange,
      colors.purple,
      colors.indigo,
      colors.red,
      colors.pink,
      colors['blue+10'],
      colors['green+10'],
      colors['cyan+10'],
      colors['orange+10'],
      colors['purple+10'],
      colors['indigo+10'],
      colors['red+10'],
      colors['pink+10'],
    ],
    blues: shades(colors, 'blue'),
    greens: shades(colors, 'green'),
    reds: shades(colors, 'red'),
    primary: shades(colors, 'primary'),
    semaphore: [
      colors.green,
      colors.yellow,
      colors.red,
      colors['green+10'],
      colors['yellow+10'],
      colors['red+10'],
      colors['green+20'],
      colors['yellow+20'],
      colors['red+20'],
    ],
    warm: [
      colors.red,
      colors.orange,
      colors.yellow,
      colors.pink,
      colors['red+10'],
      colors['orange+10'],
      colors['yellow+10'],
      colors['pink+10'],
    ],
    cool: [
      colors.blue,
      colors.cyan,
      colors.indigo,
      colors.navy,
      colors['blue+10'],
      colors['cyan+10'],
      colors['indigo+10'],
      colors['navy+10'],
    ],
    pastel: [
      colors['blue-20'],
      colors['green-20'],
      colors['cyan-20'],
      colors['orange-20'],
      colors['purple-20'],
      colors['indigo-20'],
      colors['red-20'],
      colors['pink-20'],
      colors['yellow-20'],
      colors['lylac-20'],
      colors['brown-20'],
      colors['navy-20'],
    ],
    earth: [
      colors.brown,
      colors.green,
      colors.navy,
      colors.gray,
      colors.orange,
      colors['brown+10'],
      colors['green+10'],
      colors['navy+10'],
      colors['gray+10'],
      colors['orange+10'],
    ],
  }

  return presets[name] || presets.default
}
