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
        backgroundColor: '#2c64fc',
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

          if (route.name === 'HOME') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'REPORTES') {
            iconName = focused ? 'document' : 'document-outline';
          } else if (route.name === 'CONFIGURACIONES') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

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

          borderTopWidth: 0,

          height: 90,
        },
        tabBarActiveTintColor: '#2c64fc', 
      })}
    >
      <Tab.Screen    options={{ headerShown: false }} name="HOME" component={HomeScreen} />
    
      <Tab.Screen   options={{ headerShown: false }} name="Perfil" component={Perfil} />
      <Tab.Screen
        name="ADD"
        component={RegistroAuto}
        options={{
          tabBarButton: (props) => <AddButton {...props} />,
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add" size={40} color="#fff" />
          ),
        }}
      />
      <Tab.Screen   options={{ headerShown: false }} name="REPORTES" component={Reportes} />
      <Tab.Screen   options={{ headerShown: false }} name="CONFIGURACIONES" component={Configuraciones} />
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
