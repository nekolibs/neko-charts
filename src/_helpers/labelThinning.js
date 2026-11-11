const hasValue = (point) => point?.y !== null && point?.y !== undefined

/**
 * Indexes of the points that get a value label: at most `labelsToShow` of the points that
 * actually have a value. Thinning counts real points, not slots, so the empty slots that
 * `fillEmptyDates` adds never swallow the labels of the points around them.
 */
export function thinLabelIndexes(data = [], labelsToShow = 1) {
  const valued = []
  data.forEach((point, i) => {
    if (hasValue(point)) valued.push(i)
  })
  const interval = Math.max(1, Math.ceil(valued.length / Math.max(1, labelsToShow)))
  return new Set(valued.filter((_, ordinal) => ordinal % interval === 0))
}
