import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CustomDropdown = ({ 
  data, 
  value, 
  onChange, 
  placeholder = "Seleccione una opción",
  icon,
  containerStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(value);

  const toggleDropdown = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const onItemPress = useCallback((item) => {
    setSelectedItem(item);
    onChange(item);
    setIsOpen(false);
  }, [onChange]);

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <Image source={icon} style={styles.icon} />;
    }
    return icon;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity 
        style={[
          styles.dropdownButton,
          isOpen && styles.dropdownButtonOpen
        ]} 
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <View style={styles.selectedItemContainer}>
          {icon && renderIcon()}
          <Text style={styles.selectedItemText}>
            {selectedItem?.label || placeholder}
          </Text>
        </View>
        <MaterialIcons 
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={24} 
          color="#666"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View style={[
            styles.dropdownListContainer,
            {
              top: 0, // Ajusta esto según la posición de tu dropdown
              width: '100%'
            }
          ]}>
            <ScrollView 
              style={styles.dropdownList}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {data.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    selectedItem?.value === item.value && styles.selectedDropdownItem
                  ]}
                  onPress={() => onItemPress(item)}
                >
                  <View style={styles.itemContentContainer}>
                    {item.icon && (
                      <View style={styles.itemIconContainer}>
                        {typeof item.icon === 'string' ? (
                          <Image source={item.icon} style={styles.itemIcon} />
                        ) : (
                          item.icon
                        )}
                      </View>
                    )}
                    <Text style={[
                      styles.dropdownItemText,
                      selectedItem?.value === item.value && styles.selectedItemText
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
    marginVertical: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownButtonOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  selectedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  selectedItemText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownListContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16, // Ajusta esto según tus necesidades
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '50%',
  },
  dropdownList: {
    width: '100%',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedDropdownItem: {
    backgroundColor: '#F8F8F8',
  },
  itemContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    width: 20,
    height: 20,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
});

export default CustomDropdown;