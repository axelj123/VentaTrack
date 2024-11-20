import React, { useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomInput = ({
  containerStyle,
  placeholder,
  onChangeText,
  errorMessage = "Este campo es obligatorio",
  focusedBorderColor = '#6200EE',
  unfocusedBorderColor = '#ccc',
  placeholderTextColor = '#aaa',
  value,
  reset,
  isTextArea = false,
  showError = false, // Nueva propiedad para controlar el mensaje de error
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(props.secureTextEntry);
  const labelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    if (reset) {
      animatedLabel(value ? 1 : 0);
    }
  }, [reset]);

  useEffect(() => {
    if (value) {
      animatedLabel(1);
    } else {
      animatedLabel(0);
    }
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    animatedLabel(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      animatedLabel(0);
    }
  };

  const handleTextChange = (inputText) => {
    if (onChangeText) {
      onChangeText(inputText);
    }
    animatedLabel(inputText ? 1 : (isFocused ? 1 : 0));
  };

  const animatedLabel = (toValue) => {
    Animated.timing(labelPosition, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const labelStyle = {
    left: 10,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [isTextArea ? 12 : 12, -10],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
    color: isFocused ? focusedBorderColor : placeholderTextColor,
  };

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.innerContainer,
          isTextArea && styles.textAreaContainer,
          {
            borderColor: showError ? 'red' : (isFocused ? focusedBorderColor : unfocusedBorderColor),
            backgroundColor: 'white',
          },
        ]}
      >
        <Animated.Text style={[styles.label, labelStyle]}>{placeholder}</Animated.Text>
        <View style={[styles.inputContainer, isTextArea && styles.textAreaInputContainer]}>
          <TextInput
            {...props}
            style={[styles.input, isTextArea && styles.textAreaInput]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleTextChange}
            value={value}
            placeholderTextColor={placeholderTextColor}
            textAlignVertical={isTextArea ? "top" : "center"}
            multiline={isTextArea}
            numberOfLines={isTextArea ? 4 : 1}
            textContentType={props.secureTextEntry ? 'newPassword' : props.secureTextEntry}
            secureTextEntry={showPassword}
          />
          {props.secureTextEntry && !!value && (
            <View>
              <TouchableOpacity
                style={{ width: 24 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon name={!showPassword ? "eye-outline" : "eye-off-outline"} color="gray" size={24} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};
const styles = StyleSheet.create({
  innerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
  },
  textAreaContainer: {
    height: 100,
    justifyContent: 'flex-start',
    paddingTop: 12,
  },
  label: {
    position: 'absolute',
    paddingHorizontal: 1,
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  textAreaInputContainer: {
    alignItems: 'flex-start',
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingLeft: 10,
  },
  textAreaInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  errorText: {
    marginTop: 5,
    fontSize: 11,
    color: 'red',
  },
});

export default CustomInput;