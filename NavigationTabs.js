// Navigation/Tabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/Home';
import RegistroAuto from './screens/RegistroAuto';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Registro" component={RegistroAuto} />
    </Tab.Navigator>
  );
};

export default Tabs;
