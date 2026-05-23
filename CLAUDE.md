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
└── _helpers/                   # Pure utility functions (colors, series formatting, axis math, dates, numbers)
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
