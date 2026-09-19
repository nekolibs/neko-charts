# neko-charts

Cross-platform chart library (`@neko-os/charts`). Works on React (web), React Native, and React Native Web. Same cross-platform strategy as neko-ui.

## Structure

```
src/
├── index.js                    # Public exports
├── NekoChart.js                # Core wrapper: ResponsiveChartWrapper → Content (clones children with width/height/data/series)
├── NekoChartTheme.js           # Theme context provider, useTheme, useColorsScale hooks
├── defaultTheme.js             # Web theme defaults (font sizes, colors)
├── defaultTheme.native.js      # Native theme defaults (smaller font sizes)
├── ResponsiveChartWrapper.js   # Web: ResizeObserver, passes measured width/height + all props to children
├── ResponsiveChartWrapper.native.js  # Native: onLayout, same prop forwarding
├── ResponsiveChartWrapper.web.js     # RNW: re-exports from .native.js
├── abstractions/               # Platform SVG primitives (Svg, G, Path, Rect, Circle, Line, Polygon, SvgText)
│   ├── *.js                    # Web: plain HTML SVG elements (<svg>, <g>, <path>, etc.)
│   ├── *.native.js             # Native: react-native-svg components
│   └── *.web.js                # RNW: re-exports from .native.js
├── simple/                     # Pre-composed chart components (public API)
│   ├── SimpleBarsChart.js
│   ├── SimpleDonutChart.js
│   ├── SimpleProgressDonutChart.js
│   ├── SimpleLinesChart.js
│   ├── SimplePieChart.js
│   ├── SimpleRadarChart.js
│   ├── SimpleScattersChart.js
│   ├── SimpleStackedBarsChart.js
│   └── SimpleStackedLinesChart.js
├── parts/                      # Internal building blocks (axis, bars, lines, pie slices, legends, tooltips, labels)
├── _data/muscles/              # Body art for MuscleHeatmapChart (path data per gender/view) + muscle keys/labels
└── _helpers/                   # Pure utility functions (colors, series formatting, axis math, dates, numbers, fillDates)
```

## Architecture

### Rendering Pipeline

```
SimpleFooChart (pre-composed)
  → LegendWrapper (optional legend around chart)
    → NekoChart
      → ResponsiveChartWrapper (measures container → width/height)
        → Content (formats series, clones children with all props)
          → Wrapper/SquareWrapper (SVG root element)
            → Parts (Bars, Lines, Pie, Axis, Labels, Tooltip, etc.)
```

All props flow top-down via `React.cloneElement` at each level. `ResponsiveChartWrapper` spreads `...props` alongside measured `width`/`height` to children. New props added to any Simple chart will reach inner parts automatically.

### SVG Abstractions

`abstractions/` contains thin wrappers named `Abs{Element}` (e.g. `AbsSvg`, `AbsPath`, `AbsG`). Web versions render plain HTML SVG elements. Native versions wrap `react-native-svg` components. All chart parts import from abstractions, never directly from `react-native-svg` or use raw `<svg>` tags.

### Wrappers

- **`Wrapper`** — SVG root for rectangular charts (bars, lines). Passes `width`/`height` to children.
- **`SquareWrapper`** — SVG root for square charts (pie, donut, radar). Uses `Math.min(width, height)` and centers.
- **`LegendWrapper`** — Renders Legend before/after chart based on `legendPosition` (top/bottom/left/right). Uses neko-ui `View row` for horizontal layouts.

## Cross-Platform Conventions

Same three-file pattern as neko-ui:

- **`.js`** — Web (Vite resolves this)
- **`.native.js`** — React Native (Metro resolves this)
- **`.web.js`** — React Native Web. Always re-exports from `.native.js`. Required because RNW resolves `.web.js` > `.native.js` > `.js`, and without it RNW picks up the web version.

Platform-specific files exist for: `abstractions/*`, `ResponsiveChartWrapper`, `defaultTheme`.

Everything else (parts, simple charts, helpers) is shared `.js` — no platform code, uses abstractions for SVG.

## Props Pattern

Simple charts accept all props and spread them through the tree:

```jsx
<SimplePieChart
  data={[{ x: 'A', y: 30 }, { x: 'B', y: 70 }]}
  sliceSpacing={3}       // → Pie
  cornerRadius={10}      // → Pie
  innerRadiusRatio={0.5} // → Pie (makes donut)
  legendPosition="right" // → LegendWrapper
  colorsScale={[...]}    // → any part using useColorsScale
  theme={{...}}          // → any part using useTheme
/>
```

Parts pick what they need from props. Unknown props pass through harmlessly.

## Theming

`NekoChartTheme` provider wraps charts to set `colorsScale`, `theme` overrides, and `dark` mode. Parts call `useTheme(customTheme)` which merges: custom → context → defaults. `useColorsScale(custom)` returns custom || context || built-in 8-color palette.

Web and native have separate `defaultTheme` files (native uses smaller font sizes).

## Build

```sh
yarn build    # babel src → dist (preserves .native.js/.web.js extensions via --copy-files)
yarn watch    # same, with --watch
yarn dev      # build then watch
```

Babel config uses `metro-react-native-babel-preset` with ESM output (`disableImportExportTransform: true`). The `babel-plugin-module-resolver` devDependency is currently unused (empty plugins array).

## Dependencies

- **peerDependencies**: `@neko-os/ui`, `react`, `react-native`, `dayjs`, `ramda`
- **dependencies**: `prop-types` (legacy, used in some parts)
- Native consumers also need `react-native-svg` (used by abstractions)

## Key Implementation Details

- **Pie slice spacing**: Translates each slice outward along its angular bisector by `sliceSpacing` pixels. Outer radius reduced by same amount to compensate. Produces even gaps (not angular reduction which widens at edges).
- **Pie corner radius**: Quadratic bezier curves (`Q` SVG command) at corners where straight edges meet arcs. `maxCr` is clamped to half the arc length to prevent overlap on small slices. Works for both pie (center point) and donut (inner/outer arcs) shapes.
- **Legend layout**: `LegendWrapper` uses neko-ui `View row={vertical}` modifier (not `style.flexDirection`), because neko-ui View's base `flexDirection: column` overrides style prop. Chart container uses `flex: 4` with `alignSelf: 'stretch'` to prevent collapse in row layouts.
- **Date gap-filling** (`_helpers/fillDates.js`): When `fillEmptyDates=true` is passed to any chart, `NekoChart.js → Content` calls `fillSeriesDates(series, { xMin, xMax, datesPeriod, fillValue })` after `formatChartSeries`. Detects period from smallest gap between sorted dates (hour/day/week/month/quarter/year). Generates ISO date sequence between bounds, fills missing points per-series with `fillValue` (default `null`). Multi-series uses union of all x values. Non-date x values pass through unchanged. All parts (Bars, Lines, Axis, etc.) automatically consume the filled `series` via prop spreading — no part-level changes needed.
- **Bar corner rounding** (`_helpers/bar.js`): `roundedBarPath(x, y, w, h, r, { top, bottom })` clamps radius to `min(r, w/2, h/2)` internally to prevent small bars from rendering as ellipses (which `<rect rx>` would do). Returns SVG path with rounded corners only on specified sides. Used by both Bars and StackedBars — StackedBars passes `top: isLastSegment, bottom: isFirstSegment` so middle segments stay flat.
- **Bar spacing**: Dynamic default `Math.max(2, Math.min(groupWidth * 0.15, 15))` — scales with number of bars and chart width. Override with `barSpacing` prop. Applied consistently across Bars, StackedBars, BarsLabels, StackedBarsLabelsChart to keep labels aligned with bars.
- **X label thinning** (`Axis.js`): Uses `estimateLabelWidth(formattedLabels, fontSize)` from `_helpers/colors.js` — estimates pixel width from longest label × `fontSize * 0.6` + gap. Avoids hiding short labels (e.g. "Mon", "3w") which old hardcoded 60px minimum would skip.
- **Muscle heatmap** (`simple/MuscleHeatmapChart.js`): Body map with per-muscle fill. Does NOT go through `NekoChart` — `formatChartSeries` requires `y`, and the datum shape here is `{ muscle, value?, color?, side? }`. Uses `LegendWrapper` (with `LegendComponent={HeatmapLegend}`) → `ResponsiveChartWrapper` → `Wrapper` → `MuscleMap` + `MuscleMapTooltip`.
  - **Art** lives in `_data/muscles/{male,female}{Front,Back}.js` as `{ bounds, outline: [d], parts: [{ key, side?, d }] }`. The renderer only knows this contract, so swapping the art means replacing these 4 files. Current paths come from react-native-body-highlighter (MIT, see `THIRD_PARTY_NOTICES.md`); geometry is untouched, `side` was remapped to the anatomical (subject's own) left/right so the same limb matches in front and back views.
  - **No `viewBox`**: the svg stays in pixel space so the shared `Tooltip` part isn't scaled. Each body is an `AbsG` with `translate() scale()` computed by `getBodyLayout` (`_helpers/muscles.js`) from the data `bounds`; `view="both"` lays front + back side by side with one common scale. Outline `strokeWidth` is divided by that scale to stay constant on screen.
  - **Fill** (`getMuscleFill`): datum `color` (any theme token or css color) wins; otherwise `value` → `t` in `min..max` (`max` defaults to the highest value, `steps` quantizes) → base `color` at `fillOpacity 0.2–1`, or a bucket of `colorsScale` when given (`steps` then takes the first N scale colors, since presets are categorical). No datum or `t <= 0` → `bodyColor`. A side-specific datum overrides the both-sides datum.
  - **Interaction**: handlers sit on each `AbsPath` (`AbsG` has no `onPress` mapping). `onMusclePress({ muscle, side, value, datum })` works on all platforms; hover highlight and tooltip are web-only like the other tooltips. `MuscleMap` is `React.memo`'d so tooltip mouse-move updates don't re-render the ~160 paths.
  - Keys: `MUSCLE_KEYS`, `BODY_PART_KEYS`, `MUSCLE_LABELS` exported from `_data/muscles/keys.js` (kept separate from the path data so importing labels doesn't pull the art). Unknown `muscle` keys in data are ignored.
- **Chart top padding**: `CHART_PADDING_TOP = 8` default (minimal), `CHART_PADDING_TOP_LABELS = 20` (when `values` enabled in Simple charts). Override via `chartPaddingTop` prop. All parts use `chartPaddingTop ?? CHART_PADDING_TOP` for consistent Y scaling.
