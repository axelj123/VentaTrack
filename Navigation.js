import { View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/Home';
import RegistroAuto from './screens/RegistroAuto';
import Login from './screens/Login';
import Reportes from './screens/Reportes';
import Configuraciones from './screens/Configuraciones';
import Perfil from './screens/Perfil';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Componente personalizado para el botón central "Agregar"
const AddButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -30, // Posición flotante
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
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'tomato',
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
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Definir los iconos para cada pantalla
          if (route.name === 'HOME') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'REPORTES') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'CONFIGURACIONES') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // Retornar el componente Ionicons con el nombre y tamaño del icono
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#fff',
          borderRadius: 15,
          height: 90,
        },
        tabBarActiveTintColor: 'tomato', // Color cuando la pestaña está activa
        tabBarInactiveTintColor: 'gray', // Color cuando la pestaña no está activa
      })}
    >
      <Tab.Screen name="HOME" component={HomeScreen} />
    
      <Tab.Screen name="Perfil" component={Perfil} />
      <Tab.Screen
        name="ADD"
        component={RegistroAuto} // Esta pantalla es la de agregar
        options={{
          tabBarButton: (props) => <AddButton {...props} />,
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add" size={40} color="#fff" />
          ),
        }}
      />
      <Tab.Screen name="REPORTES" component={Reportes} />
      <Tab.Screen name="CONFIGURACIONES" component={Configuraciones} />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LOGIN" component={Login} />
        <Stack.Screen name="MAIN" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
