export function getDefaultTheme(dark) {
  return {
    gridColor: dark ? '#FFFFFF40' : 'rgba(50, 57, 94, 0.10)',
    axisColor: dark ? '#FFFFFF40' : 'rgba(50, 57, 94, 0.10)',

    labelSize: 9,
    labelColor: dark ? '#FFFFFF40' : 'rgba(50, 57, 94, 0.45)',
    valueSize: 9,
    valueColor: dark ? '#ffffff97' : 'rgba(50, 57, 94, 0.45)',
    legendSize: 9,
    legendColor: dark ? '#ffffff' : 'rgba(50, 57, 94, 0.45)',
    legendPointSize: 7,
    pointSize: 3,
  }
}
