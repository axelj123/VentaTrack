import React from 'react';
import { View, Text, StyleSheet,Image} from 'react-native';

function ViewItem({ route } ) {
    const { title, price, image, descripcion } = route.params; 


    return (
        <View style={styles.container}>
          <Text style={styles.text}>Título: {title}</Text>
          <Text style={styles.text}>Precio: {price}</Text>
          <Text style={styles.text}>Descripción: {descripcion}</Text>
          <Image source={image} style={styles.image} />
        </View>
      );
      
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  image: {
    width: 100, 
    height: 100, 
    marginTop: 10,
  },
});

export default ViewItem;
