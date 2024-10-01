import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Reportes = () => {
  return (
    <View style={style.text}>
      <Text >Reportes</Text>

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