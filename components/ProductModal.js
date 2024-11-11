import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ProductModal = ({ 
  visible, 
  onClose, 
  product, 
  onAddToCart 
}) => {
  const [quantity, setQuantity] = useState('1');

  const handleAddToCart = () => {
    const numQuantity = parseInt(quantity);
    if (numQuantity <= 0) {
      Alert.alert('Error', 'La cantidad debe ser mayor a 0');
      return;
    }
    if (numQuantity > product.stock) {
      Alert.alert('Error', 'No hay suficiente stock disponible');
      return;
    }
    
    onAddToCart({
      ...product,
      quantity: numQuantity,
      subtotal: numQuantity * product.price
    });
    setQuantity('1');
    onClose();
  };

  const adjustQuantity = (amount) => {
    const newQuantity = Math.max(1, Math.min(parseInt(quantity) + amount, product.stock));
    setQuantity(newQuantity.toString());
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons name="close" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{product?.title}</Text>
          <Text style={styles.price}>Precio: ${product?.price}</Text>
          <Text style={styles.stock}>Stock disponible: {product?.stock}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => adjustQuantity(-1)}
            >
              <MaterialIcons name="remove" size={24} color="white" />
            </TouchableOpacity>

            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={(text) => {
                const num = parseInt(text) || 0;
                if (num <= product?.stock) {
                  setQuantity(text);
                }
              }}
              keyboardType="numeric"
              maxLength={4}
            />

            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={() => adjustQuantity(1)}
            >
              <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtotal}>
            Subtotal: ${(parseFloat(quantity || 0) * (product?.price || 0)).toFixed(2)}
          </Text>

          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addButtonText}>Agregar al carrito</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10
  },
  price: {
    fontSize: 18,
    marginBottom: 10
  },
  stock: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  quantityButton: {
    backgroundColor: '#B90909',
    borderRadius: 25,
    padding: 8
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 10,
    minWidth: 60,
    textAlign: 'center',
    fontSize: 18
  },
  subtotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20
  },
  addButton: {
    backgroundColor: '#B90909',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ProductModal;