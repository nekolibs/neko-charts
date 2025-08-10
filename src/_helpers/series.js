import {
  isEmpty,
  allPass,
  chain,
  complement,
  groupBy,
  has,
  head,
  map,
  mapObjIndexed,
  omit,
  pick,
  pipe,
  prop,
  sortBy,
  toPairs,
  values,
} from 'ramda'

const hasValue = (v) => v !== undefined && !isEmpty(v)

// Shape 0 (final): [{serie: "A", data: [{x: 1, y: 2}, {...}], ...}
// Shape 1: [{x: 1, y: 2}, {x: 2, y: 5}] (Single line)
// Shape 2: [{serie: "A", x: 1, y: 2}, {serie: "A", x: 2, y: y}, {serie: "B", x: 1, y: 3}, ...]
// Shape 3: [{x: 1, "A": 2, "B": 5}, {x: 2, "A": 5, "B": 2}]

export const formatChartSeries = (input) => {
  if (!Array.isArray(input) || input.length === 0) return []

  // Check if already in final shape (Shape 0): [{serie: "A", data: [{x: 1, y: 2}, ...]}]
  const isShape0 =
    input[0]?.data &&
    Array.isArray(input[0].data) &&
    input[0].data[0]?.x !== undefined &&
    input[0].data[0]?.y !== undefined
  if (isShape0) return input

  const shape1 = hasValue(input[0]?.x) && hasValue(input[0]?.y) && !hasValue(input[0]?.serie)
  if (shape1) return [{ data: input }]

  let index = 0
  const toOutput = pipe(
    mapObjIndexed((pts, name) => ({
      name,
      data: sortBy(prop('x'), pts).map((item) => ({ ...item, serie: name, serieIndex: index })),
      index: index++,
    })),
    values,
    sortBy(prop('name'))
  )

  const shape2 = allPass([has('x'), complement(has('serie'))])(head(input))
  if (shape2) {
    const expandw = (row) =>
      pipe(
        omit(['x']),
        toPairs,
        map(([name, y]) => ({ name, x: row.x, y }))
      )(row)

    const grouped = pipe(chain(expandw), groupBy(prop('name')))(input)

    return toOutput(grouped)
  }

  const grouped = groupBy(prop('serie'), input)
  const stripped = map(map(pick(['x', 'y'])), grouped)

  return toOutput(stripped)
}
