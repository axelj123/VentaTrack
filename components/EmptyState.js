import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmptyState = ({ 
  title = 'No hay productos disponibles',
  description = 'Por el momento no hay productos que mostrar. Por favor, intenta buscar con otros filtros o vuelve más tarde.',
  buttonText = 'Actualizar página',
  iconName = 'cube-outline',
  iconSize = 40,
  iconColor = '#6200EE',
  buttonColor = '#6B21A8',
  onRefresh,
  onPress,
  containerStyle,
  iconContainerStyle,
  titleStyle,
  descriptionStyle,
  buttonStyle,
  buttonTextStyle,
}) => {
  const handlePress = onPress || onRefresh;

  return (
    <View style={[styles.emptyContainer, containerStyle]}>
      <View style={[styles.iconContainer, iconContainerStyle]}>
        <Ionicons 
          name={iconName} 
          size={iconSize} 
          color={iconColor} 
        />
      </View>
      
      <Text style={[styles.titleText, titleStyle]}>
        {title}
      </Text>
      
      <Text style={[styles.descriptionText, descriptionStyle]}>
        {description}
      </Text>
      
      {handlePress && (
        <TouchableOpacity 
          style={[
            styles.refreshButton, 
            { backgroundColor: buttonColor },
            buttonStyle
          ]}
          onPress={handlePress}
        >
          <Text style={[styles.buttonText, buttonTextStyle]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 8,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyState;