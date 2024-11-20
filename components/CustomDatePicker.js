import React, { useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, Easing } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CustomDatePicker = ({
  containerStyle,
  placeholder = "Seleccione fecha",
  onDateChange,
  value,
  errorMessage = "Este campo es obligatorio",
  focusedBorderColor = '#6200EE',
  unfocusedBorderColor = '#ccc',
  placeholderTextColor = '#aaa',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState(false);
  const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    if (value) {
      // Si `value` es una cadena (por ejemplo, al cargar de AsyncStorage), conviértelo a un objeto `Date`
      if (typeof value === 'string' || !(value instanceof Date)) {
        onDateChange(new Date(value)); // Actualiza `value` para que sea un objeto `Date`
      } else {
        animatedLabel(1); // Mueve la etiqueta hacia arriba si hay un valor inicial
      }
    } else {
      animatedLabel(0);
      setIsFocused(false);
      setError(false);
    }
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    setError(false);
    animatedLabel(1);
    setShowPicker(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      setError(true);
      animatedLabel(0);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setError(false);
      onDateChange && onDateChange(selectedDate);
    } else if (!value) {
      animatedLabel(0);
    }
    setIsFocused(false);
  };

  const animatedLabel = (toValue) => {
    Animated.timing(labelPosition, {
      toValue,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  const labelStyle = {
    left: 10,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -8],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
    color: isFocused || value ? focusedBorderColor : placeholderTextColor,
  };

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.innerContainer,
          {
            borderColor: error ? 'red' : (isFocused ? focusedBorderColor : unfocusedBorderColor),
            backgroundColor: 'white',
          },
        ]}
      >
        {!value && !isFocused && ( // Muestra el placeholder solo si no hay fecha y no está enfocado
          <Text style={[styles.placeholderText, { color: placeholderTextColor }]}>
            {placeholder}
          </Text>
        )}
        <TouchableOpacity onPress={handleFocus} style={styles.dateInput}>
          <Text style={{ color: value ? '#000' : 'transparent' }}>
            {value instanceof Date ? value.toLocaleDateString() : placeholder}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            onBlur={handleBlur}
          />
        )}
        {isFocused || value ? (
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
