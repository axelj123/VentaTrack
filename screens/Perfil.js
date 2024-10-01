import { View, Text, StyleSheet} from 'react-native'
import React from 'react'

const Perfil = () => {
  return (
    <View style={style.text}>
      <Text>Perfil</Text>
    </View>
  )
}
const style=StyleSheet.create({
    text:{
        flex: 1, justifyContent: 'center', alignItems: 'center'

    }
})

export default Perfil