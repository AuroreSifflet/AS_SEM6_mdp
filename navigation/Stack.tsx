import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* import { RootStackParamList } from './interface'; */
import ConnexionScreen from '../screen/ConnexionScreen';
import InscriptionScreen from '../screen/InscriptionScreen';
import HomeConnectedScreen from '../screen/HomeConnectedScreen';
import AddPassword from '../screen/Password/AddPassword';
import ShowPassword from '../screen/Password/ShowPassword';

export type RootStackParamList = {
    InscriptionScreen: undefined;
    ConnexionScreen: undefined;
    HomeConnectedScreen:  {
    identifiantEmail: string,
    };
    AddPassword: undefined;
    ShowPassword: undefined;
   };

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ConnexionScreen" component={ConnexionScreen} />
        <Stack.Screen name="AddPassword" component={AddPassword} />
        <Stack.Screen name="ShowPassword" component={ShowPassword} />
        <Stack.Screen name="InscriptionScreen" component={InscriptionScreen} />
        <Stack.Screen name="HomeConnectedScreen" component={HomeConnectedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default StackNav;