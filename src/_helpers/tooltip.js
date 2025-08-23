/**
 * Calculate dynamic tooltip width based on content
 * @param {Object} params - Parameters for width calculation
 * @param {string} params.title - Tooltip title
 * @param {Array} params.items - Array of tooltip items with label and value
 * @param {number} params.fontSize - Base font size for title
 * @param {number} params.padding - Tooltip padding
 * @param {number} params.fixedWidth - Optional fixed width override
 * @returns {number} Calculated tooltip width
 */
export function calculateTooltipWidth({ 
  title, 
  items = [], 
  fontSize = 12, 
  padding = 8, 
  fixedWidth 
}) {
  if (fixedWidth) return fixedWidth
  
  // Estimate character widths (rough approximation)
  const charWidth = fontSize * 0.6
  const smallCharWidth = (fontSize - 1) * 0.6
  
  // Calculate title width
  const titleWidth = title ? title.toString().length * charWidth : 0
  
  // Calculate max item width (label + value + spacing)
  const maxItemWidth = items.reduce((max, item) => {
    const labelWidth = item.label ? item.label.toString().length * smallCharWidth : 0
    const valueWidth = item.value ? item.value.toString().length * smallCharWidth : 0
    const colorIndicatorWidth = item.color ? 20 : 0 // 8px rect + 12px spacing
    const spaceBetween = 15 // Space between label and value
    
    return Math.max(max, colorIndicatorWidth + labelWidth + valueWidth + spaceBetween)
  }, 0)
  
  // Return the larger of title or items width, plus padding
  const contentWidth = Math.max(titleWidth, maxItemWidth) + padding * 2
  
  // Ensure minimum width and add some buffer
  return Math.max(80, Math.min(300, contentWidth + 20))
}

/**
 * Calculate tooltip width from hover data (for XAxis tooltips)
 * @param {Object} data - Hover data from AxisInteractive
 * @param {number} fontSize - Base font size
 * @param {number} padding - Tooltip padding
 * @param {number} fixedWidth - Optional fixed width override
 * @returns {number} Calculated tooltip width
 */
export function calculateTooltipWidthFromData(data, fontSize = 12, padding = 8, fixedWidth) {
  if (fixedWidth) return fixedWidth
  if (!data) return 120 // Default width
  
  const items = data.values?.map(value => ({
    label: value.serie,
    value: value.y,
    color: true // XAxis tooltips always have colors
  })) || []
  
  return calculateTooltipWidth({
    title: data.x,
    items,
    fontSize,
    padding,
    fixedWidth
  })
}

/**
 * Smart tooltip positioning to keep it within bounds
 * @param {Object} params - Positioning parameters
 * @returns {Object} Calculated { x, y } position
 */
export function calculateTooltipPosition({
  mouseX,
  mouseY,
  tooltipWidth,
  tooltipHeight,
  containerWidth,
  containerHeight,
  padding = 8,
  offsetX = 10,
  offsetY = 0
}) {
  let tooltipX = mouseX + offsetX
  let tooltipY = mouseY + offsetY - tooltipHeight / 2

  // Check if tooltip would overflow on the right
  if (tooltipX + tooltipWidth + padding > containerWidth) {
    tooltipX = mouseX - tooltipWidth - Math.abs(offsetX)
  }

  // If still overflowing on the left, position at edge
  if (tooltipX < padding) {
    tooltipX = mouseX < containerWidth / 2 
      ? padding 
      : containerWidth - tooltipWidth - padding
  }

  // Adjust Y position to stay within bounds
  if (tooltipY < padding) {
    tooltipY = padding
  }
  if (tooltipY + tooltipHeight + padding > containerHeight) {
    tooltipY = containerHeight - tooltipHeight - padding
  }

  return { x: tooltipX, y: tooltipY }
}