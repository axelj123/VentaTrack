/* CardsItems.js */

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const CardsItems = ({ productoId, title, price, image, descripcion, stock, navigation, buttonText, onPress }) => {

  const handlePress = () => {
    if (onPress) {
      onPress();  // Si se pasa una función onPress, se ejecuta
    } else {
      // Si no se pasa, ejecutamos la navegación predeterminada
      navigation.navigate('VerItem', { Producto_id: productoId, title, price, image, descripcion, stock });
    }
  };

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>

        <View style={styles.priceStockContainer}>
          <Text style={styles.price}>S/.{price}</Text>
          <Text style={styles.stock}>Stock: {stock}</Text>
        </View>

        <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={handlePress} // Llamamos a handlePress
        >
          <Text style={[styles.buttonText, buttonText && { color: '#fff' }]}>{buttonText || 'Ver'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '45%',
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 14,
    color: '#555',
    marginVertical: 5,
  },
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B90909',
  },
  stock: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    backgroundColor: '#B90909',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CardsItems;
