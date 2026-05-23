import React, { useState, useRef, useEffect } from 'react'

export default function ResponsiveChartWrapper({ children, style = {}, width: fixedWidth, height: fixedHeight, ...props }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const ref = useRef(null)
  const isFixed = fixedWidth > 0 && fixedHeight > 0

  useEffect(() => {
    if (isFixed || !ref.current) return

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (width !== dimensions.width || height !== dimensions.height) {
        setDimensions({ width, height })
      }
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isFixed])

  if (isFixed) {
    return (
      <div style={{ width: fixedWidth, height: fixedHeight, display: 'flex', flexDirection: 'column', ...style }}>
        {React.cloneElement(children, { ...props, width: fixedWidth, height: fixedHeight })}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        alignSelf: 'stretch',
        minHeight: 50,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {dimensions.width > 0 &&
        dimensions.height > 0 &&
        React.cloneElement(children, {
          ...props,
          width: dimensions.width,
          height: dimensions.height,
        })}
    </div>
  )
}
