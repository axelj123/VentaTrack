import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import RegistroAuto from './screens/RegistroAuto';
import Login from './screens/Login'; // Asegúrate de que la ruta sea correcta

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LOGIN" component={Login} />
        <Stack.Screen name="HOME" component={HomeScreen} />
        <Stack.Screen name="REGISTRO" component={RegistroAuto} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
