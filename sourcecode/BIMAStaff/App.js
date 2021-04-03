import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/components/login';
import Dashboard from './app/components/dashboard';
import Inventory from './app/components/Inventory';
import POSMain from './app/components/posmain';
import POSScan from './app/components/posscan';
import AddToCart from './app/components/addtocart';
import AlertManager from './app/components/alertmanager';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#2F5D8C',
        },
        headerTintColor: '#F9F9F9',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={
          {title: 'Login'},
          {headerLeft: null} 
        }
      />
      <Stack.Screen 
       name="Main Menu" 
       component={Dashboard} 
       options={
         { title: 'Main Menu' },
         {headerLeft: null} 
       }
      />
      <Stack.Screen 
       name="Inventory" 
       component={Inventory} 
       options={
         { title: 'Inventory' }
       }
      />
      <Stack.Screen 
       name="POS" 
       component={POSMain} 
       options={
         { title: 'POS' }
       }
      />
      <Stack.Screen 
       name="POS Scan" 
       component={POSScan} 
       options={
         { title: 'POS Scan' }
       }
      />
      <Stack.Screen 
       name="Add To Cart" 
       component={AddToCart} 
       options={
         { title: 'Add To Cart' }
       }
      />
     <Stack.Screen 
      name="Alert Manager" 
      component={AlertManager} 
      options={
        { title: 'Alert Manager' }
      }
     />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}