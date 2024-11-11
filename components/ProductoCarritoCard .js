// components/ProductoCarritoCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProductoCarritoCard = ({ producto, index, incrementarCantidad, decrementarCantidad, onDelete }) => {
    return (
      <View key={index} style={styles.productCard}>
        <View style={styles.productImage}>
          {/* Mostrar la imagen del producto */}
          <Image source={{ uri: producto.imagen }} style={styles.imagePlaceholder} />
        </View>
        <View style={styles.productInfo}>
          {/* Mostrar el nombre del producto */}
          <Text style={styles.productName}>{producto.title || 'Nombre no disponible'}</Text>
          {/* Mostrar el código del producto */}
          <Text style={styles.productCode}>Código: {producto.id || 'N/A'}</Text>
          {/* Mostrar el precio */}
          <Text style={styles.productPrice}>S/.{producto.price || 'N/A'}</Text>
        </View>
        <View style={styles.quantityControl}>
          {/* Control de cantidad */}
          <TouchableOpacity onPress={() => decrementarCantidad(index)}>
            <Icon name="remove-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{producto.quantity || 0}</Text>
          <TouchableOpacity onPress={() => incrementarCantidad(index)}>
            <Icon name="add-circle-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(index)}>
          {/* Botón de eliminar */}
          <Icon name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  productCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 80,
    marginRight: 16,
  },
  imagePlaceholder: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCode: {
    color: '#999',
  },
  productPrice: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  deleteButton: {
    padding: 4,
  },
});

export default ProductoCarritoCard;
