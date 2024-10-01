import React from 'react';
import { View, Text,StyleSheet } from 'react-native';

const Home = () => {
  
  return (
    <View style={style.text}>
      <Text>Pantalla de Inicio</Text>
    </View>
  );
};

const style=StyleSheet.create({
  text:{
    flex: 1, justifyContent: 'center', alignItems: 'center'
  }
})

export default Home;
