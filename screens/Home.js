// screens/Home.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';



const Home = () => {
  return (
    <View style={styles.container}>
 



    </View>
  );
};

const styles = StyleSheet.create({
  TitleSeccion:{
    backgroundColor: '#f5f5f5',
    marginTop:40,
    marginBottom:20,

  },
  TextTitle:{
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  dashboard: {
    backgroundColor: '#4a39ff',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    width:200,
  },
 
  month: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',

  },
  



});

export default Home;
