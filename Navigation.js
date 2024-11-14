import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/Home';
import NuevoProducto from './screens/NuevoProducto';
import Login from './screens/Login';
import Reportes from './screens/Reportes';
import Configuraciones from './screens/Configuraciones';
import Inventario from './screens/Inventario';
import ViewItem from './screens/ViewItem';
import VentaProducto from './screens/VentaProducto';
import DetalleVenta from './screens/DetalleVenta';
import Notificaciones from './screens/Notificaciones';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const AddButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5,
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 35,
        backgroundColor: '#EFB810',
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;

          if (route.name === 'HOME') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Inventario') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'Reportes') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'Configuraciones') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={'white'} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          right: 20,
          elevation: 0,
          backgroundColor: '#211132',
          borderRadius: 15,

          borderTopWidth: 0,
          margin: 10,
          height: 60,
        },
        tabBarActiveTintColor: 'white',
      })}
    >
      <Tab.Screen options={{ headerShown: false }} name="HOME" component={HomeScreen} />

      <Tab.Screen options={{ headerShown: false }} name="Inventario" component={Inventario} />
      <Tab.Screen
        name="VentaProducto"
        component={VentaProducto}
        options={{
          headerShown: false, tabBarButton: (props) => <AddButton {...props} />,
          tabBarStyle: { display: 'none' }, tabBarIcon: ({ focused }) => (
            <Ionicons name="cart" size={40} color="#fff" />
          ),
        }}
      />

      <Tab.Screen options={{ headerShown: false }} name="Reportes" component={Reportes} />
      <Tab.Screen options={{ headerShown: false }} name="Configuraciones" component={Configuraciones} />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LOGIN" component={Login} />
        <Stack.Screen name="MAIN" component={TabNavigator} />
        <Stack.Screen name="RegistrarProducto" component={NuevoProducto} />
        <Stack.Screen name="VerItem" component={ViewItem} />
        <Stack.Screen name="DetalleVenta" component={DetalleVenta} />
        <Stack.Screen name="Notificaciones" component={Notificaciones} />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
