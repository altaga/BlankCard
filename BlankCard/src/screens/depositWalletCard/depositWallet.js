import Clipboard from '@react-native-clipboard/clipboard';
import React, { Component } from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/header';
import GlobalStyles, { mainColor, ratio } from '../../styles/styles';
import ContextModule from '../../utils/contextModule';

class DepositWalletCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      component: null,
    };
  }

  static contextType = ContextModule;

  componentDidMount() {
    setInterval(() => {
      if (this.state.progress < 1) {
        this.setState({
          progress: this.state.progress + 0.05,
        });
      }
    }, 1);
    setTimeout(() => {
      const QrAddress = require('./components/qrAddress').default;
      this.setState({
        component: <QrAddress />,
      });
    }, 1000);
  }

  render() {
    const publicKey = this.context.value.publicKeyCard;
    return (
      <SafeAreaView style={[GlobalStyles.container]}>
        <Header />
        <View
          style={[
            GlobalStyles.mainFull,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 20,
            },
          ]}>
          <Text style={GlobalStyles.title}>
            Receive ETH{'\n'}or ERC20 Tokens
          </Text>
          {this.state.component === null ? (
            <View
              style={{
                aspectRatio: 1,
                width:
                  Dimensions.get('screen').width * (ratio > 1.7 ? 0.8 : 0.5),
                margin: 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Progress.Pie progress={this.state.progress} size={180} color={mainColor}/>
              <Text style={{color: 'white', fontSize: 16}}>Loading {Math.floor(this.state.progress * 100)}%</Text>
            </View>
          ) : (
            this.state.component
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                width: '85%',
              }}>
              {publicKey.substring(
                Math.floor((publicKey.length * 0) / 2),
                Math.floor((publicKey.length * 1) / 2),
              ) +
                '\n' +
                publicKey.substring(
                  Math.floor((publicKey.length * 1) / 2),
                  Math.floor((publicKey.length * 2) / 2),
                )}
            </Text>
            <Pressable
              onPress={() => {
                Clipboard.setString(publicKey);
                ToastAndroid.show(
                  'Address copied to clipboard',
                  ToastAndroid.LONG,
                );
              }}
              style={{
                width: '15%',
                alignItems: 'flex-start',
              }}>
              <IconIonicons name="copy" size={30} color={'white'} />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              width: '100%',
            }}>
            <Pressable
              style={[GlobalStyles.buttonStyle]}
              onPress={() => this.props.navigation.goBack()}>
              <Text style={[GlobalStyles.buttonText]}>Return</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default DepositWalletCard;
