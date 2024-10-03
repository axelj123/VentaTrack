// screens/Home.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';



const Home = () => {
  return (
    <View style={styles.container}>
 

      <View style={styles.TitleSeccion}>
        <Text style={styles.TextTitle}>Dashboard</Text>
       
      </View>


      <View style={styles.dashboard}>
        <Text style={styles.month}>January</Text>
        <Text style={styles.amount}>$500</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '70%' }]} />
        </View>
        <Text style={styles.target}>Daily spend target: $16.67</Text>
      </View>

      


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
    backgroundColor: '#007BFF',
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
  },
 
  month: {
    fontSize: 18,
    color: '#fff',
  },
  amount: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginVertical: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#28A745', // Color del progreso
    borderRadius: 4,
  },
  target: {
    color: '#fff',
  },


});

export default Home;
