import {ethers} from 'ethers';
import React, {Component} from 'react';
import {
  PermissionsAndroid,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import {abiBatchTokenBalances} from '../../../contracts/batchTokenBalances';
import GlobalStyles, {mainColor} from '../../../styles/styles';
import {blockchains, refreshRate} from '../../../utils/constants';
import ContextModule from '../../../utils/contextModule';
import {
  arraySum,
  epsilonRound,
  getAsyncStorageValue,
  setAsyncStorageValue,
} from '../../../utils/utils';

const baseTab1State = {
  refreshing: false,
  nfcSupported: true,
};

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

class Tab1 extends Component {
  constructor(props) {
    super(props);
    this.state = baseTab1State;
    this.provider = blockchains.map(
      x => new ethers.providers.JsonRpcProvider(x.rpc),
    );
    this.controller = new AbortController();
  }
  static contextType = ContextModule;

  async componentDidMount() {
    const lastRefreshTab1 = await this.getlastRefresh();
    if (Date.now() - lastRefreshTab1 >= refreshRate) {
      await setAsyncStorageValue({lastRefreshTab1: Date.now().toString()});
      this.refresh();
    } else {
      console.log(
        `Next refresh Available: ${Math.round(
          (refreshRate - (Date.now() - lastRefreshTab1)) / 1000,
        )} Seconds`,
      );
    }
  }

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

  async refresh() {
    await this.setStateAsync({refreshing: true});
    await Promise.all([this.getUSD(), this.getBalances()]);
    await this.setStateAsync({refreshing: false});
  }

  // Get Balances

  async getBalancesBlockScout() {
    const publicKey = this.context.value.publicKey;
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
    const publicKey = this.context.value.publicKey;
    const nativeBalance = await this.provider[0].getBalance(publicKey);
    const tokenBalances = await this.getBalancesBlockScout();
    const balances = [nativeBalance, ...tokenBalances];
    const balancesFinal = blockchains[0].tokens.map((y, i) => {
      return ethers.utils.formatUnits(balances[i], y.decimals);
    });
    return balancesFinal;
  }

  async getBalances() {
    const balances = await this.getBatchBalances();
    setAsyncStorageValue({balances});
    this.context.setValue({balances});
  }

  // USD Conversions

  async getUSD() {
    const array = blockchains[0].tokens.map(token => token.coingecko);
    var myHeaders = new Headers();
    myHeaders.append('accept', 'application/json');
    var requestOptions = {
      signal: this.controller.signal,
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${array.toString()}&vs_currencies=usd`,
      requestOptions,
    );
    const result = await response.json();
    const usdConversion = array.map(x => result[x].usd);
    setAsyncStorageValue({usdConversion});
    this.context.setValue({usdConversion});
  }

  async getlastRefresh() {
    try {
      const lastRefreshTab1 = await getAsyncStorageValue('lastRefreshTab1');
      if (lastRefreshTab1 === null) throw 'Set First Date';
      return lastRefreshTab1;
    } catch (err) {
      await setAsyncStorageValue({lastRefreshTab1: '0'.toString()});
      return 0;
    }
  }

  render() {
    const iconSize = 38;
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
        }}>
        <View style={GlobalStyles.balanceContainer}>
          <LinearGradient
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              paddingVertical: 20,
            }}
            colors={['#000000', '#1a1a1a', '#000000']}>
            <Text style={GlobalStyles.title}>Account Balance</Text>
            <Text style={[GlobalStyles.balance]}>
              {`$ ${epsilonRound(
                arraySum(
                  this.context.value.balances.map(
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
            <Pressable onPress={()=> this.props.navigation.navigate('DepositWallet')} key={i} style={GlobalStyles.network}>
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
                      {this.context.value.balances[i] === 0
                        ? '0'
                        : this.context.value.balances[i] < 0.001
                        ? '<0.01'
                        : epsilonRound(this.context.value.balances[i], 2)}{' '}
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
                    this.context.value.balances[i] *
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

export default Tab1;
