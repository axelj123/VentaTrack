/* CardsItems.js */

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const CardsItems = ({ title, price, image, descripcion,stock, navigation }) => {

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
          onPress={() => navigation.navigate('VerItem', { title, price, image, descripcion,stock })}
        >
          <Text style={styles.buttonText}>Ver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items at the top
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between', // Ensure even spacing between elements
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B90909', // Dark red color
    marginBottom: 5,
  },
  descripcion: {
    fontSize: 12,
    fontWeight: '400',
    color: '#B90909', // Dark red color
    marginBottom: 10,
  },
  priceStockContainer: {
    flexDirection: 'row', // Arrange price and stock horizontally
    justifyContent: 'space-between', // Space them apart
    alignItems: 'center', // Align items vertically in the center
    marginBottom: 15, 
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#B90909', // Dark red color
  },
  stock: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B90909', // Dark red color
  },
  buttonContainer: {
    backgroundColor: '#B90909', // Dark red color
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start', // Align the button to the left
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CardsItems;
