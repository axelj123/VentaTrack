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
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.modalTitle}>{product?.title}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Precio:</Text>
              <Text style={styles.price}>S/. {product?.price}</Text>
            </View>

            <View style={styles.stockContainer}>
              <MaterialIcons name="inventory" size={20} color="#6B21A8" />
              <Text style={styles.stock}>Stock disponible: {product?.stock}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.quantityLabel}>Cantidad:</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={[styles.quantityButton, quantity === '1' && styles.quantityButtonDisabled]} 
                onPress={() => adjustQuantity(-1)}
                disabled={quantity === '1'}
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
                style={[styles.quantityButton, parseInt(quantity) >= product?.stock && styles.quantityButtonDisabled]} 
                onPress={() => adjustQuantity(1)}
                disabled={parseInt(quantity) >= product?.stock}
              >
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalLabel}>Subtotal:</Text>
              <Text style={styles.subtotal}>
                S/. {(parseFloat(quantity || 0) * (product?.price || 0)).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddToCart}
            >
              <MaterialIcons name="shopping-cart" size={24} color="white" style={styles.cartIcon} />
              <Text style={styles.addButtonText}>Agregar al carrito</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', // Modal desde abajo
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: '50%',
    width: '100%',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 16,
  },
  content: {
    padding: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B21A8',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  stock: {
    fontSize: 14,
    color: '#6B21A8',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  quantityButton: {
    backgroundColor: '#6B21A8',
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 12,
    minWidth: 80,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: 'white',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  subtotalLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  subtotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B21A8',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addButton: {
    backgroundColor: '#6B21A8',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6B21A8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cartIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ProductModal;