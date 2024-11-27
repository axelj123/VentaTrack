import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';

const CardsItems = ({ 
  productoId, 
  title, 
  price, 
  purchasePrice, 
  image, 
  descripcion, 
  stock, 
  navigation, 
  buttonText, 
  onPress 
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('VerItem', { 
        Producto_id: productoId, 
        title, 
        price, 
        purchasePrice, 
        image, 
        descripcion, 
        stock 
      });
    }
  };
  const formatStockNumber = (stockNumber) => {
    if (stockNumber >= 1000000) {
      return `${(stockNumber / 1000000).toFixed(1)}M`;
    } else if (stockNumber >= 1000) {
      return `${(stockNumber / 1000).toFixed(1)}K`;
    } else {
      return stockNumber.toString();
    }
  };
  const formatPriceNumber = (priceNumber) => {
    if (priceNumber >= 1000000) {
      return `S/. ${(priceNumber / 1000000).toFixed(1)}M`;
    } else if (priceNumber >= 1000) {
      return `S/. ${(priceNumber / 1000).toFixed(1)}K`;
    } else {
      return `S/. ${priceNumber.toFixed(2)}`;
    }
  };
  // Enhanced stock status logic with more detailed ranges

  const getStockStatus = () => {
    const formattedStock = formatStockNumber(stock);

    if (stock <= 0) {
      return {
        text: 'Sin stock',
        color: '#EF4444',
        backgroundColor: '#FEE2E2',
        borderColor: '#FECACA'
      };
    }
    if (stock <= 3) {
      return {
        text: `¡Últimas ${formattedStock} unid.!`,
        color: '#DC2626',
        backgroundColor: '#FEF2F2',
        borderColor: '#FEE2E2'
      };
    }
    if (stock <= 5) {
      return {
        text: `Stock bajo: ${formattedStock}`,
        color: '#F59E0B',
        backgroundColor: '#FEF3C7',
        borderColor: '#FDE68A'
      };
    }
    if (stock <= 10) {
      return {
        text: `Stock: ${formattedStock} unid.`,
        color: '#059669',
        backgroundColor: '#D1FAE5',
        borderColor: '#A7F3D0'
      };
    }
    return {
      text: `Stock: ${formattedStock}`,
      color: '#059669',
      backgroundColor: '#ECFDF5',
      borderColor: '#D1FAE5'
    };
  };

  const stockStatus = getStockStatus();

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        <View 
          style={[
            styles.stockBadge,
            {
              backgroundColor: stockStatus.backgroundColor,
              borderColor: stockStatus.borderColor,
            }
          ]}
        >
          <View style={[styles.stockDot, { backgroundColor: stockStatus.color }]} />
          <Text style={[styles.stockText, { color: stockStatus.color }]}>
            {stockStatus.text}
          </Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.descripcion} numberOfLines={2}>
            {descripcion}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceSection}>
            <Text style={styles.priceAmount}>{formatPriceNumber(price)}</Text>
          </View>

     
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    marginHorizontal: '1.5%',
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  headerContainer: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  descripcion: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 1,
  },
  priceSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B21A8',
    marginTop: 2,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B21A8',
    letterSpacing: -0.5,
  },
  buttonContainer: {
    backgroundColor: '#6B21A8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#6B21A8',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default CardsItems;