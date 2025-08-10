import React from 'react'
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native'
import { Colors } from 'react-native-ui-lib'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export function ChartTooltip({ 
  x, 
  y, 
  data, 
  renderContent,
  position = 'top',
  offsetX = 0,
  offsetY = 10,
  onClose,
  backgroundColor = 'rgba(0, 0, 0, 0.9)',
  textColor = 'white'
}) {
  
  const getTooltipPosition = () => {
    const tooltipWidth = 120
    const tooltipHeight = 80
    
    let left = x + offsetX - tooltipWidth / 2
    let top
    
    switch (position) {
      case 'bottom':
        top = y + offsetY + 10
        break
      case 'top':
        top = y - offsetY - tooltipHeight - 10
        break
      case 'auto':
      default:
        // Auto position based on available space
        const spaceAbove = y - 10
        const spaceBelow = screenHeight - y - 10
        
        if (spaceAbove > tooltipHeight + 20) {
          top = y - offsetY - tooltipHeight - 10
        } else {
          top = y + offsetY + 10
        }
        break
    }
    
    // Keep within screen bounds
    left = Math.max(10, Math.min(left, screenWidth - tooltipWidth - 10))
    top = Math.max(10, Math.min(top, screenHeight - tooltipHeight - 10))
    
    return { left, top }
  }
  
  const { left, top } = getTooltipPosition()
  
  // Calculate arrow position relative to tooltip
  const arrowPosition = x - left - 6
  const isArrowVisible = arrowPosition >= 6 && arrowPosition <= 108 // Within tooltip bounds
  
  const defaultContent = () => (
    <View style={styles.content}>
      {data.serie && (
        <Text style={[styles.label, { color: textColor }]}>
          {data.serie}
        </Text>
      )}
      <Text style={[styles.value, { color: textColor }]}>
        {data.value}
      </Text>
      {data.percentage && (
        <Text style={[styles.subtitle, { color: textColor }]}>
          {data.percentage}
        </Text>
      )}
      {data.label && (
        <Text style={[styles.subtitle, { color: textColor }]}>
          {data.label}
        </Text>
      )}
    </View>
  )

  return (
    <Pressable 
      style={StyleSheet.absoluteFillObject}
      onPress={onClose}
      accessible={false}
    >
      <View 
        style={[
          styles.container,
          { 
            left, 
            top, 
            backgroundColor 
          }
        ]}
        pointerEvents="none"
      >
        {renderContent ? renderContent(data) : defaultContent()}
        
        {/* Arrow */}
        {isArrowVisible && position !== 'bottom' && (
          <View 
            style={[
              styles.arrowDown, 
              { 
                left: arrowPosition,
                borderTopColor: backgroundColor 
              }
            ]} 
          />
        )}
        
        {isArrowVisible && position === 'bottom' && (
          <View 
            style={[
              styles.arrowUp, 
              { 
                left: arrowPosition,
                borderBottomColor: backgroundColor 
              }
            ]} 
          />
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    opacity: 0.8,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    opacity: 0.7,
    marginTop: 2,
  },
  arrowDown: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  arrowUp: {
    position: 'absolute',
    top: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
})