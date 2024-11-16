// Basic Imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { Dimensions, Image, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import logoSplash from '../../assets/logoSplash.png';
import GlobalStyles from '../../styles/styles';
import ContextModule from '../../utils/contextModule';
import { getAsyncStorageValue } from '../../utils/utils';

class SplashLoading extends Component {
  constructor(props) {
    super(props);
  }

  static contextType = ContextModule;

  async componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      // DEBUG ONLY
      //await this.erase();
      if (true) {
        const balances = await getAsyncStorageValue('balances');
        const balancesCard = await getAsyncStorageValue('balancesCard');
        const usdConversion = await getAsyncStorageValue('usdConversion');
        this.context.setValue({
          balances: balances ?? this.context.value.balances,
          usdConversion: usdConversion ?? this.context.value.usdConversion,
          balancesCard: balancesCard ?? this.context.value.balancesCard,
        });
        this.props.navigation.navigate('Main'); // Main
      } else {
        //this.props.navigation.navigate('Setup');
      }
    });
    this.props.navigation.addListener('blur', async () => { });
  }

  async erase() {
    // DEV ONLY - DON'T USE IN PRODUCTION
    try {
      await EncryptedStorage.clear();
      await AsyncStorage.clear();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center' }]}>
        <Image
          resizeMode="contain"
          source={logoSplash}
          alt="Main Logo"
          style={{
            width: Dimensions.get('window').width,
          }}
        />
      </View>
    );
  }
}

export default SplashLoading;
