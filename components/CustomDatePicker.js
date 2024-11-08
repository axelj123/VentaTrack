import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, Easing } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CustomDatePicker = ({
  containerStyle,
  placeholder = "Seleccione fecha",
  onDateChange,
  errorMessage = "Este campo es obligatorio",
  focusedBorderColor = '#6200EE',
  unfocusedBorderColor = '#ccc',
  placeholderTextColor = '#aaa',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [date, setDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState(false);
  const labelPosition = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    setError(false);
    animatedLabel(1); // Mueve la etiqueta inmediatamente al enfocar
    setShowPicker(true); // Muestra el DatePicker al enfocar
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!date) {
      setError(true);
      animatedLabel(0); // Vuelve la etiqueta a la posición inicial si no hay fecha
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setError(false);
      onDateChange && onDateChange(selectedDate);
    } else if (!date) {
      animatedLabel(0);
    }
  };

  const animatedLabel = (toValue) => {
    Animated.timing(labelPosition, {
      toValue,
      duration: 300, // Aumenta la duración para una animación más suave
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease), // Suaviza la transición usando Easing correctamente
    }).start();
  };

  const labelStyle = {
    left: 10,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -8], // Ajusta la posición de la etiqueta
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12], // Tamaño de la fuente
    }),
    color: isFocused || date ? focusedBorderColor : placeholderTextColor,
  };

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.innerContainer,
          {
            borderColor: error ? 'red' : (isFocused ? focusedBorderColor : unfocusedBorderColor),
          },
        ]}
      >
        {!date && !isFocused && ( // Muestra el placeholder solo si no hay fecha y no está enfocado
          <Text style={[styles.placeholderText, { color: placeholderTextColor }]}>
            {placeholder}
          </Text>
        )}
        <TouchableOpacity onPress={handleFocus} style={styles.dateInput}>
          <Text style={{ color: date ? '#000' : 'transparent' }}>
            {date ? date.toLocaleDateString() : placeholder}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            onBlur={handleBlur}
          />
        )}
        {isFocused || date ? ( // Solo muestra la etiqueta animada si está enfocado o hay una fecha seleccionada
          <Animated.Text style={[styles.label, labelStyle]}>{placeholder}</Animated.Text>
        ) : null}
      </View>
      {error && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  label: {
    position: 'absolute',
    paddingHorizontal: 2,
    backgroundColor: 'white',
  },
  placeholderText: {
    position: 'absolute',
    left: 10,
    top: 12,
    fontSize: 14,
  },
  dateInput: {
    height: '100%',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 5,
    fontSize: 11,
    color: 'red',
  },
});

export default CustomDatePicker;
