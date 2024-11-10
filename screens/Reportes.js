import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import { useToast } from '../components/ToastContext'; // Importamos el hook

const Reportes = () => {

  const { showToast } = useToast(); // Usamos el hook para acceder al showToast

  const handleClick = () => {
    showToast('¡Producto guardado correctamente!', 'success');
  }
  return (
    <View style={style.text}>
      <Text >Reportes</Text>
      <View>
      <Button title="Guardar Producto" onPress={handleClick} />
    </View>
    </View>
  )
}
const style=StyleSheet.create({
text:{
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center'
},

})
export default Reportes