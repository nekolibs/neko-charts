export function getColorFromScale(scale, index) {
  return scale[index % scale.length]
}

export function resolveColor(themeColors, value) {
  if (!value || typeof value !== 'string') return value
  return themeColors[value] || value
}
