# Neko Charts

Universal React Native charts library (works on react-native, react-native-web and react).

https://nekocharts.surge.sh/guides/install

## Date Gap-Filling

Opt-in feature to auto-fill missing dates in your data. Useful when you have sparse data points and want continuous x-axis representation.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fillEmptyDates` | boolean | `false` | Activate fill mode |
| `datesPeriod` | `'hour' \| 'day' \| 'week' \| 'month' \| 'quarter' \| 'year'` | auto-detect | Step size for fill |
| `xMin` | string \| Date | min of data | Lower bound (extends fill range) |
| `xMax` | string \| Date | max of data | Upper bound (extends fill range) |
| `fillValue` | any | `null` | Y value for filled (missing) points |

### Examples

```jsx
// Auto-detect period from data gaps
<BarsChart data={[{x:'2024-01-01',y:5},{x:'2024-01-04',y:3}]} fillEmptyDates />
// → 4 bars (Jan 1-4), bars at Jan 2/3 invisible (y=null)

// Explicit period
<LinesChart data={data} fillEmptyDates datesPeriod="week" />

// Explicit bounds extend the range
<BarsChart data={data} fillEmptyDates xMin="2024-01-01" xMax="2024-01-31" />

// Lines should use fillValue={0} until null-gap handling lands
<LinesChart data={data} fillEmptyDates fillValue={0} />
```

### Behavior

- **Auto-detect period**: examines smallest gap between sorted dates, picks coarsest matching unit
- **Multi-series**: union of all series' min/max dates, all series padded to same x sequence
- **Non-date x values**: no-op, data passes through unchanged
- **Bars + null**: renders as zero-height (invisible bar at missing date)
- **Lines + null**: currently connects across gaps. Use `fillValue={0}` for visible flat baseline
