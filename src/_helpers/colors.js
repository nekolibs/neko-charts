export function getColorFromScale(scale, index) {
  return scale[index % scale.length]
}
