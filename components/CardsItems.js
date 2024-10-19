/*CardsItems.js*/

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const CardsItems = ({ title, price, image, descripcion, navigation }) => {
  
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>

        <Text style={styles.price}>{price}</Text>
      </View>
      
      <TouchableOpacity 
  style={styles.buttonContainer} 
  onPress={() => navigation.navigate('VerItem',{ title, price, image, descripcion })}>
  <Text style={styles.buttonText}>Ver</Text>
</TouchableOpacity>

   
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
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0000', // Dark red color
    marginBottom: 5,
  },
  descripcion: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8B0000', // Dark red color
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    marginBottom: 15,
    color: '#8B0000', // Dark red color

    fontWeight: '800',
  },
  buttonContainer: {
    backgroundColor: '#8B0000', // Dark red color
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CardsItems;