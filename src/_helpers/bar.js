/**
 * Creates an SVG path for a bar with rounded corners on specified sides.
 *
 * @param {number} x - Left edge
 * @param {number} y - Top edge
 * @param {number} w - Width
 * @param {number} h - Height
 * @param {number} r - Corner radius (unclamped — clamped internally)
 * @param {object} [options]
 * @param {boolean} [options.top=true] - Round top corners
 * @param {boolean} [options.bottom=false] - Round bottom corners
 */
export function roundedBarPath(x, y, w, h, r, { top = true, bottom = false } = {}) {
  const cr = Math.min(r, w / 2, h / 2)

  if (cr <= 0 || (!top && !bottom)) {
    return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`
  }

  const tl = top ? cr : 0
  const tr = top ? cr : 0
  const br = bottom ? cr : 0
  const bl = bottom ? cr : 0

  return [
    `M${x},${y + tl}`,
    tl ? `Q${x},${y} ${x + tl},${y}` : '',
    `L${x + w - tr},${y}`,
    tr ? `Q${x + w},${y} ${x + w},${y + tr}` : '',
    `L${x + w},${y + h - br}`,
    br ? `Q${x + w},${y + h} ${x + w - br},${y + h}` : '',
    `L${x + bl},${y + h}`,
    bl ? `Q${x},${y + h} ${x},${y + h - bl}` : '',
    'Z',
  ].filter(Boolean).join(' ')
}
