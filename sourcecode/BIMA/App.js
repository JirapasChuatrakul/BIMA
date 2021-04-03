import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/components/login';
import Signup from './app/components/signup';
import Dashboard from './app/components/dashboard';
import Inventory from './app/components/Inventory';
import AddItem from './app/components/additem';
import POSMain from './app/components/posmain';
import POSScan from './app/components/posscan';
import AddToCart from './app/components/addtocart';
import History from './app/components/history';
import Summary from './app/components/summary';
import Notification from './app/components/notification';
import SignupStaff from './app/components/signupstaff';
//import AlertManager from './app/components/alertmanager'; //For Development test only

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#D55E2D',
        },
        headerTintColor: '#F9F9F9',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="Signup" 
        component={Signup} 
        options={{ title: 'Signup' }}
      />
      <Stack.Screen 
        name="SignupStaff" 
        component={SignupStaff} 
        options={{ title: 'SignupStaff' }}
      />       
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
       name="Add Item" 
       component={AddItem} 
       options={
         { title: 'Add Item' }
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
       name="History" 
       component={History} 
       options={
         { title: 'History' }
       }
      />
     <Stack.Screen 
      name="Summary Page" 
      component={Summary} 
      options={
        { title: 'Summary Page' }
      }
     />
     <Stack.Screen 
      name="Notification" 
      component={Notification} 
      options={
        { title: 'Notification' }
      }
     />
    {/* ***For Development Test Only*** */}
     {/* <Stack.Screen 
      name="Alert Manager" 
      component={AlertManager} 
      options={
        { title: 'Alert Manager' }
      }
     /> */}
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