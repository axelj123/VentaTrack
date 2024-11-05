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
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 10,
    margin: 10, // Add margin for spacing between cards
    width: '45%', // Make the card occupy about half the screen width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'column', // Stack image and text vertically
    alignItems: 'center', // Center items horizontally
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center', // Center text in the middle of the card
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  stock: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  buttonContainer: {
    backgroundColor: '#B90909',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default CardsItems;
