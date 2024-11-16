import {ethers} from 'ethers';
import React, {Component, Fragment} from 'react';
import {
  NativeEventEmitter,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import CreditCard from 'react-native-credit-card';
import LinearGradient from 'react-native-linear-gradient';
import Crypto from 'react-native-quick-crypto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobalStyles, {mainColor} from '../../../styles/styles';
import {
  blockchains,
  CloudPublicKeyEncryption,
  refreshRate,
} from '../../../utils/constants';
import ContextModule from '../../../utils/contextModule';
import {
  arraySum,
  epsilonRound,
  getAsyncStorageValue,
  randomNumber,
  setAsyncStorageValue,
} from '../../../utils/utils';

const generator = require('creditcard-generator');

function filterByAddress(array, key, addresses) {
  return array.filter(item => addresses.includes(item.token[key]));
}

function filterAndSortValues(data, orderList) {
  // Map to store tokens with their value, defaulting to 0
  const tokenMap = new Map(orderList.map(token => [token, '0']));

  // Populate the map with the matching token values
  data.forEach(item => {
    const tokenSymbol = item.token.symbol;
    if (tokenMap.has(tokenSymbol)) {
      tokenMap.set(tokenSymbol, item.value);
    }
  });
  // Return an array of values sorted by the order of the orderList
  return Array.from(tokenMap.values());
}

const baseTab2State = {
  refreshing: false,
  loading: false,
  onPayment: false,
  // Card
  cvc: randomNumber(111, 999),
  expiry: '1228',
  name: 'Blank Card',
  number: generator.GenCC('VISA'),
  imageFront: require('../../../assets/cardAssets/card-front.png'),
  imageBack: require('../../../assets/cardAssets/card-back.png'),
};

export default class Tab2 extends Component {
  constructor(props) {
    super(props);
    this.state = baseTab2State;
    this.provider = blockchains.map(
      x => new ethers.providers.JsonRpcProvider(x.rpc),
    );
    this.EventEmitter = new NativeEventEmitter();
    this.session;
    this.listener;
  }

  static contextType = ContextModule;

  async getLastRefresh() {
    try {
      const lastRefreshTab2 = await getAsyncStorageValue('lastRefreshTab2');
      if (lastRefreshTab2 === null) throw 'Set First Date';
      return lastRefreshTab2;
    } catch (err) {
      await setAsyncStorageValue({lastRefreshTab2: 0});
      return 0;
    }
  }

  async componentDidMount() {
    // Public Key
    const publicKey = this.context.value.publicKeyCard;
    if (publicKey) {
      // Event Emitter
      this.EventEmitter.addListener('refresh', async () => {
        await setAsyncStorageValue({lastRefreshTab2: Date.now()});
        this.refresh();
      });
      // Get Last Refresh
      const lastRefresh = await this.getLastRefresh();
      if (Date.now() - lastRefresh >= refreshRate) {
        console.log('Refreshing...');
        await setAsyncStorageValue({lastRefreshTab2: Date.now()});
        this.refresh();
      } else {
        console.log(
          `Next refresh Available: ${Math.round(
            (refreshRate - (Date.now() - lastRefresh)) / 1000,
          )} Seconds`,
        );
      }
    }
  }

  componentWillUnmount() {
    this.EventEmitter.removeAllListeners('refresh');
  }

  async refresh() {
    await this.setStateAsync({refreshing: true});
    await this.getCardBalance();
    await this.setStateAsync({refreshing: false});
  }

  async getBalancesBlockScout() {
    const publicKey = this.context.value.publicKeyCard;
    return new Promise(async resolve => {
      const myHeaders = new Headers();
      myHeaders.append('accept', 'application/json');

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(
        `${blockchains[0].api}v2/addresses/${publicKey}/token-balances`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          const addresses = blockchains[0].tokens.map(x => x.address);
          const filtered = filterByAddress(result, 'address', addresses);
          let orderList = blockchains[0].tokens.map(x => x.symbol);
          orderList.shift(); // Remove ETH
          const values = filterAndSortValues(filtered, orderList);
          const bnValues = values.map(x => ethers.BigNumber.from(x));
          resolve(bnValues);
        })
        .catch(error => console.error(error));
    });
  }

  async getBatchBalances() {
    const publicKey = this.context.value.publicKeyCard;
    const nativeBalance = await this.provider[0].getBalance(publicKey);
    const tokenBalances = await this.getBalancesBlockScout();
    const balances = [nativeBalance, ...tokenBalances];
    const balancesFinal = blockchains[0].tokens.map((y, i) => {
      return ethers.utils.formatUnits(balances[i], y.decimals);
    });
    return balancesFinal;
  }

  async getCardBalance() {
    const balancesCard = await this.getBatchBalances();
    setAsyncStorageValue({balancesCard});
    this.context.setValue({balancesCard});
  }

  encryptData(data) {
    const encrypted = Crypto.publicEncrypt(
      {
        key: CloudPublicKeyEncryption,
      },
      Buffer.from(data, 'utf8'),
    );
    return encrypted.toString('base64');
  }

  // Utils
  async setStateAsync(value) {
    return new Promise(resolve => {
      this.setState(
        {
          ...value,
        },
        () => resolve(),
      );
    });
  }

  render() {
    return (
      <View style={GlobalStyles.tab2ScrollContainer}>
        <View style={{height: 180, marginTop: 30}}>
          <CreditCard
            type={this.state.type}
            imageFront={this.state.imageFront}
            imageBack={this.state.imageBack}
            shiny={false}
            bar={false}
            number={this.state.number}
            name={this.state.name}
            expiry={this.state.expiry}
            cvc={this.state.cvc}
          />
        </View>
        <View style={{marginVertical: 20}}>
          <Pressable
            style={[
              GlobalStyles.buttonStyle,
              {backgroundColor: this.state.onPayment ? 'dimgray' : mainColor},
            ]}>
            <Text style={GlobalStyles.buttonText}>Pay</Text>
            <MaterialCommunityIcons name="nfc" size={24} color="#000000" />
          </Pressable>
        </View>
        <View style={[GlobalStyles.balanceContainer, {height:140, width:'100%'}]}>
          <LinearGradient
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
            colors={['#000000', '#1a1a1a', '#000000']}>
            <Text style={GlobalStyles.title}>Account Balance</Text>
            <Text style={[GlobalStyles.balance]}>
              {`$ ${epsilonRound(
                arraySum(
                  this.context.value.balancesCard.map(
                    (token, j) => token * this.context.value.usdConversion[j],
                  ),
                ),
                2,
              )} USD`}
            </Text>
          </LinearGradient>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              progressBackgroundColor={mainColor}
              refreshing={this.state.refreshing}
              onRefresh={async () => {
                await setAsyncStorageValue({
                  lastRefreshTab1: Date.now().toString(),
                });
                await this.refresh();
              }}
            />
          }
          showsVerticalScrollIndicator={false}
          style={GlobalStyles.tokensContainer}
          contentContainerStyle={{
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          {blockchains[0].tokens.map((token, i) => (
            <Pressable
              onPress={() => this.props.navigation.navigate('DepositWallet')}
              key={i}
              style={GlobalStyles.network}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <View style={GlobalStyles.networkMarginIcon}>
                  <View>{token.icon}</View>
                </View>
                <View style={{justifyContent: 'center'}}>
                  <Text style={GlobalStyles.networkTokenName}>
                    {token.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={GlobalStyles.networkTokenData}>
                      {this.context.value.balancesCard[i] === 0
                        ? '0'
                        : this.context.value.balancesCard[i] < 0.001
                        ? '<0.01'
                        : epsilonRound(this.context.value.balancesCard[i], 2)}{' '}
                      {token.symbol}
                    </Text>
                    <Text style={GlobalStyles.networkTokenData}>
                      {`  -  ($${epsilonRound(
                        this.context.value.usdConversion[i],
                        4,
                      )} USD)`}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{marginHorizontal: 20}}>
                <Text style={{color: 'white'}}>
                  $
                  {epsilonRound(
                    this.context.value.balancesCard[i] *
                      this.context.value.usdConversion[i],
                    2,
                  )}{' '}
                  USD
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }
}
