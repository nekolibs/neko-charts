export function getDefaultTheme(dark) {
  return {
    gridColor: dark ? '#FFFFFF40' : 'rgba(50, 57, 94, 0.10)',
    axisColor: dark ? '#FFFFFF40' : 'rgba(50, 57, 94, 0.10)',

    labelSize: 10,
    labelColor: dark ? '#FFFFFF40' : 'rgba(50, 57, 94, 0.45)',
    valueSize: 12,
    valueColor: dark ? '#ffffff97' : 'rgba(50, 57, 94, 0.45)',
    legendSize: 12,
    legendColor: dark ? '#ffffff' : 'rgba(50, 57, 94, 0.45)',
    legendPointSize: 9,
    pointSize: 2,

    tooltipSize: 14,
    tooltipLineColor: dark ? '#FFFFFF40' : 'rgba(50, 57, 94, 0.45)',
    tooltipBGColor: dark ? '#FFFFFF40' : '#2a2a2a',
    tooltipColor: dark ? 'rgba(50, 57, 94, 0.45)' : '#ffffff',
  }
}
