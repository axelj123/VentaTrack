import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';

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
import SplashScreen from './screens/Splashscreen';
import NuevoCliente from './screens/NuevoCliente';
import Clientes from './screens/Clientes';
import GetStarted  from './screens/GetStarted';
import Register from './screens/Register';
import OnboardingFlow from './screens/OnboardingFlow';
import EditClientScreen from './components/EditClientScreen';
import VentaExitosa from './screens/VentaExitosa';
import TicketView from './screens/TicketView';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        width: 50,
        height: 50,
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

          borderTopWidth: 0,
          height: 50,
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
            <Ionicons name="cart" size={30} color="#fff" />
          ),
        }}
      />

      <Tab.Screen options={{ headerShown: false }} name="Reportes" component={Reportes} />
      <Tab.Screen options={{ headerShown: false }} name="Configuraciones" component={Configuraciones} />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const value = await AsyncStorage.getItem('hasCompletedOnboarding');
        setIsOnboardingComplete(value === 'true');
      } catch (error) {
        console.error('Error verificando el estado de onboarding:', error);
        setIsOnboardingComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboardingComplete ? (
          <>
            <Stack.Screen name="GetStarted" component={GetStarted} />
            <Stack.Screen name="OnboardingFlow" component={OnboardingFlow} />
            <Stack.Screen name="Register" component={Register} />
            {/* Agregamos las rutas del TabNavigator aquí también */}
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="LOGIN" component={Login} />
            <Stack.Screen name="RegistrarProducto" component={NuevoProducto} />
            <Stack.Screen name="VerItem" component={ViewItem} />
            <Stack.Screen name="DetalleVenta" component={DetalleVenta} />
            <Stack.Screen name="Notificaciones" component={Notificaciones} />
            <Stack.Screen name="NuevoCliente" component={NuevoCliente} />
            <Stack.Screen name="Clientes" component={Clientes} />
            <Stack.Screen name="EditClientScreen" component={EditClientScreen} />
            <Stack.Screen name="VentaExitosa" component={VentaExitosa} />
            <Stack.Screen name="TicketView" component={TicketView} />

          </>
        ) : (
          <>
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="LOGIN" component={Login} />
            <Stack.Screen name="RegistrarProducto" component={NuevoProducto} />
            <Stack.Screen name="VerItem" component={ViewItem} />
            <Stack.Screen name="DetalleVenta" component={DetalleVenta} />
            <Stack.Screen name="Notificaciones" component={Notificaciones} />
            <Stack.Screen name="NuevoCliente" component={NuevoCliente} />
            <Stack.Screen name="Clientes" component={Clientes} />
            <Stack.Screen name="EditClientScreen" component={EditClientScreen} />
            <Stack.Screen name="VentaExitosa" component={VentaExitosa} />
            <Stack.Screen name="TicketView" component={TicketView} />

            
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
