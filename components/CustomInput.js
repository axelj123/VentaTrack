import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomInput = ({
  containerStyle,
  placeholder,
  onChangeText,
  errorMessage = "Este campo es obligatorio",
  focusedBorderColor = '#6200EE',       // Color del borde en foco
  unfocusedBorderColor = '#ccc',        // Color del borde sin foco
  placeholderTextColor = '#aaa',        // Color del texto del placeholder
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');
  const [showPassword, setShowPassword] = useState(props.secureTextEntry);
  const [error, setError] = useState(false);
  const labelPosition = useRef(new Animated.Value(text ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    setError(false); // Oculta el error al enfocar
    animatedLabel(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!text) {
      setError(true); // Muestra el error si el campo está vacío
      animatedLabel(0);
    }
  };

  const handleTextChange = (inputText) => {
    setText(inputText);
    setError(false); // Oculta el error mientras se escribe
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
    backgroundColor: 'white',
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -10],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 12],
    }),
    color: isFocused ? focusedBorderColor : placeholderTextColor,  // Usa el color del texto del placeholder
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
        <Animated.Text style={[styles.label, labelStyle]}>{placeholder}</Animated.Text>
        <View style={styles.inputContainer}>
          <TextInput
            {...props}
            style={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleTextChange}
            value={text}
            placeholderTextColor={placeholderTextColor} // Aplica el color del texto del placeholder
            textAlignVertical="center"
            textContentType={props.secureTextEntry ? 'newPassword' : props.secureTextEntry}
            secureTextEntry={showPassword}
          />
          {props.secureTextEntry && !!text && (
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
  input: {
    flex: 1,
    fontSize: 14,
    paddingLeft: 10,
  },
  errorText: {
    marginTop: 5,
    fontSize: 11,
    color: 'red',
  },
});

export default CustomInput;
