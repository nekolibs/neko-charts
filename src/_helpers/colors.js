export function getColorFromScale(scale, index) {
  return scale[index % scale.length]
}

export function resolveColor(themeColors, value) {
  if (!value || typeof value !== 'string') return value
  return themeColors[value] || value
}

/**
 * Estimate minimum pixel width needed for a label based on text length and font size.
 * Uses average character width (~0.6 × fontSize) plus gap between labels.
 */
export function estimateLabelWidth(labels, fontSize, gap = 8) {
  if (!labels?.length) return 30
  const avgCharWidth = fontSize * 0.6
  const maxLen = Math.max(...labels.map((l) => String(l).length))
  return Math.max(maxLen * avgCharWidth + gap, 20)
}
