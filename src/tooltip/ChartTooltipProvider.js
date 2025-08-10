import React, { createContext, useContext, useState, useCallback } from 'react'
import { View } from 'react-native'
import { ChartTooltip } from './ChartTooltip'

const TooltipContext = createContext()

export const useTooltip = () => {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error('useTooltip must be used within ChartTooltipProvider')
  }
  return context
}

export function ChartTooltipProvider({ 
  children, 
  renderTooltip,
  enabled = true,
  position = 'top', // 'top', 'bottom', 'auto'
  offsetX = 0,
  offsetY = 10,
  style
}) {
  const [tooltip, setTooltip] = useState(null)
  
  const showTooltip = useCallback((data) => {
    if (enabled) {
      setTooltip(data)
    }
  }, [enabled])
  
  const hideTooltip = useCallback(() => {
    setTooltip(null)
  }, [])
  
  const updateTooltip = useCallback((data) => {
    if (enabled && tooltip) {
      setTooltip(data)
    }
  }, [enabled, tooltip])

  return (
    <TooltipContext.Provider value={{ 
      showTooltip, 
      hideTooltip, 
      updateTooltip,
      tooltip,
      enabled 
    }}>
      <View style={[{ flex: 1 }, style]}>
        {children}
        {tooltip && enabled && (
          <ChartTooltip 
            {...tooltip}
            position={position}
            offsetX={offsetX}
            offsetY={offsetY}
            renderContent={renderTooltip}
            onClose={hideTooltip}
          />
        )}
      </View>
    </TooltipContext.Provider>
  )
}