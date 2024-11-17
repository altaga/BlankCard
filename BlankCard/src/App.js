import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import Main from './screens/main/main';
import Setup from './screens/setup/setup';
import SplashLoading from './screens/splashLoading/splashLoading';
import AppStateListener from './utils/appStateListener';
import { ContextProvider } from './utils/contextModule';
import DepositWallet from './screens/depositWallet/depositWallet';
import DepositWalletCard from './screens/depositWalletCard/depositWallet';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {}, []);
  return (
    <ContextProvider>
      <NavigationContainer>
        <AppStateListener />
        <StatusBar barStyle="light-content" />
        {
          // <TransactionsModal />
        }
        <Stack.Navigator
          initialRouteName="SplashLoading"
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
          }}>
          <Stack.Screen name="SplashLoading" component={SplashLoading} />
          {
            // Setup
          }
          <Stack.Screen name="Setup" component={Setup} />
          {
            // Main
          }
          <Stack.Screen name="Main" component={Main} />
          {
            // Wallet Screens
          }
          <Stack.Screen name="DepositWallet" component={DepositWallet} />
          <Stack.Screen name="DepositWalletCard" component={DepositWalletCard} />
        </Stack.Navigator>
      </NavigationContainer>
    </ContextProvider>
  );
}
