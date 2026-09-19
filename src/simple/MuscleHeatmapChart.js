import { useCallback, useMemo, useState } from 'react'

import { MUSCLE_LABELS } from '../_data/muscles/keys'
import {
  getBodies,
  getBodyLayout,
  getHeatScale,
  getMuscleDomain,
  getViewAspectRatio,
  indexMuscleData,
  isSideSpecific,
} from '../_helpers/muscles'
import { useColorsScale, useResolveColor } from '../NekoChartTheme'
import { HeatmapLegend } from '../parts/HeatmapLegend'
import { LegendWrapper } from '../parts/LegendWrapper'
import { MuscleMap } from '../parts/MuscleMap'
import { MuscleMapTooltip } from '../parts/MuscleMapTooltip'
import { Wrapper } from '../parts/Wrapper'
import ResponsiveChartWrapper from '../ResponsiveChartWrapper'

const SIDE_LABELS = { left: 'Left', right: 'Right' }

function getMousePosition(e) {
  const svg = e.currentTarget.ownerSVGElement || e.currentTarget
  const rect = svg.getBoundingClientRect()
  const event = e.nativeEvent || e
  return { x: event.clientX - rect.left, y: event.clientY - rect.top }
}

function Content({
  width,
  height,
  bodies,
  data,
  color = 'red',
  colorsScale,
  min,
  max,
  steps,
  bodyColor = 'text4_op30',
  outline = false,
  outlineColor = 'text4',
  outlineWidth,
  tooltip,
  muscleLabels,
  sideLabels,
  valueLabel = 'Value',
  formatValue,
  onMusclePress,
  tooltipWidth,
  tooltipPadding,
  theme,
}) {
  const resolve = useResolveColor()
  const scaleColors = useColorsScale(colorsScale)
  const [hovered, setHovered] = useState(null)
  const [position, setPosition] = useState(null)

  const index = useMemo(() => indexMuscleData(data), [data])
  const domain = useMemo(() => getMuscleDomain(data, min, max), [data, min, max])
  const layout = useMemo(() => getBodyLayout(bodies, width, height), [bodies, width, height])
  const scale = useMemo(() => (colorsScale ? getHeatScale(scaleColors, steps) : undefined), [colorsScale, scaleColors, steps])

  const onMuscleHover = useCallback((target, e) => {
    setHovered(target)
    setPosition(getMousePosition(e))
  }, [])
  const onMuscleHoverOut = useCallback(() => setHovered(null), [])
  const onMouseMove = useCallback((e) => setPosition(getMousePosition(e)), [])

  let title
  let items = []
  if (hovered) {
    const side = isSideSpecific(index, hovered.muscle) && { ...SIDE_LABELS, ...sideLabels }[hovered.side]
    const label = { ...MUSCLE_LABELS, ...muscleLabels }[hovered.muscle] || hovered.muscle
    title = side ? `${label} (${side})` : label
    if (Number.isFinite(hovered.value)) {
      items = [{ label: valueLabel, value: formatValue ? formatValue(hovered.value) : hovered.value }]
    }
  }

  return (
    <Wrapper width={width} height={height}>
      <MuscleMap
        layout={layout}
        index={index}
        domain={domain}
        steps={steps}
        color={resolve(color)}
        scale={scale}
        resolve={resolve}
        bodyColor={resolve(bodyColor)}
        outline={outline}
        outlineColor={resolve(outlineColor)}
        outlineWidth={outlineWidth}
        hovered={hovered}
        onMuscleHover={tooltip || onMusclePress ? onMuscleHover : undefined}
        onMuscleHoverOut={onMuscleHoverOut}
        onMouseMove={tooltip ? onMouseMove : undefined}
        onMusclePress={onMusclePress}
      />
      <MuscleMapTooltip
        hide={!tooltip}
        title={title}
        items={items}
        position={position}
        tooltipWidth={tooltipWidth}
        tooltipPadding={tooltipPadding}
        theme={theme}
      />
    </Wrapper>
  )
}

export function MuscleHeatmapChart({
  legend = false,
  legendPosition = 'bottom',
  tooltip = false,
  view = 'both',
  gender = 'male',
  width,
  height,
  ...props
}) {
  const bodies = useMemo(() => getBodies(gender, view), [gender, view])
  const ratio = getViewAspectRatio(bodies)
  if (width > 0 && !(height > 0)) height = Math.round(width / ratio)
  if (height > 0 && !(width > 0)) width = Math.round(height * ratio)

  const allProps = { ...props, width, height, tooltip, bodies }

  return (
    <LegendWrapper legendPosition={legend ? legendPosition : undefined} LegendComponent={HeatmapLegend} {...allProps}>
      <ResponsiveChartWrapper width={width} height={height}>
        <Content {...allProps} />
      </ResponsiveChartWrapper>
    </LegendWrapper>
  )
}
