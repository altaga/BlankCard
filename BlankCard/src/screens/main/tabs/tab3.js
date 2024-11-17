import {ethers} from 'ethers';
import React, {Component, Fragment} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Crypto from 'react-native-quick-crypto';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import checkMark from '../../../assets/checkMark.png';
import GlobalStyles, {
  mainColor,
  secondaryColor,
  tertiaryColor,
} from '../../../styles/styles';
import {
  CloudPublicKeyEncryption,
  basePublicKey,
  blockchains,
  bytesPyth,
  crosschains,
} from '../../../utils/constants';
import ContextModule from '../../../utils/contextModule';
import {deleteLeadingZeros, formatInputText} from '../../../utils/utils';
import ReadTag from '../../components/readTag';
import {abiPyth} from '../../../contracts/pyth';
import {abiBlank} from '../../../contracts/blankwallet';
import {abiERC20} from '../../../contracts/erc20';
import {abiStargate} from '../../../contracts/stargate';

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

function padAddressTo64(address) {
  // Remove the '0x' prefix and convert to lowercase
  const strippedAddress = address.toLowerCase().replace(/^0x/, '');

  // Pad the address to 64 characters with leading zeros
  const paddedAddress = strippedAddress.padStart(64, '0');

  // Add back the '0x' prefix
  return `0x${paddedAddress}`;
}

async function getPythPrices() {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  return new Promise(async resolve => {
    fetch(
      'https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace&ids%5B%5D=0x9d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f6&ids%5B%5D=0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a&ids%5B%5D=0x41283d3f78ccb459a24e5f1f1b9f5a72a415a26ff9ce0391a6878f4cda6b477b&ids%5B%5D=0xb0948a5e5313200c632b51bb5ca32f6de0d36e9950a942d19751e833f70dabfd',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        resolve(
          result.parsed.map(
            item =>
              parseFloat(item.price.price) * Math.pow(10, item.price.expo),
          ),
        );
      })
      .catch(error => resolve([1, 1, 1, 1, 1]));
  });
}

const BaseStatePaymentWallet = {
  // Base
  publicKeyCard: basePublicKey,
  balances: blockchains[0].tokens.map(() => 0),
  activeTokens: blockchains[0].tokens.map(() => false),
  stage: 0, // 0
  amount: '0.00', // "0.00"
  cardProof: null,
  loading: false,
  status: 'Processing...',
  explorerURL: '',
  transactionDisplay: {
    amount: '0.00',
    name: blockchains[0].tokens[0].symbol,
    tokenAddress: blockchains[0].tokens[0].address,
    icon: blockchains[0].tokens[0].icon,
  },
  chainSelected: crosschains[0],
  // QR print
  saveData: '',
};

class Tab3 extends Component {
  constructor(props) {
    super(props);
    this.state = BaseStatePaymentWallet;
    this.provider = blockchains.map(
      x => new ethers.providers.JsonRpcProvider(x.rpc),
    );
    this.controller = new AbortController();
  }

  static contextType = ContextModule;

  componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      this.setState({
        loading: false,
      });
    });
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

  async updatePriceFeeds() {
    
      const privateKey = this.context.value.privateKey;
      const wallet = new ethers.Wallet(privateKey, this.provider[0]);
      const contract = new ethers.Contract(blockchains[0].pyth, abiPyth, wallet);
      const fee = await contract.getUpdateFee([bytesPyth]);
      console.log(fee);
      const estimateGas = await contract.estimateGas.updatePriceFeeds([bytesPyth]);
      console.log(estimateGas);
      const gasLimit = estimateGas.mul(120).div(100);
      const updateTransaction =
        await contract.populateTransaction.updatePriceFeeds([bytesPyth], {
          value: fee,
          gasLimit
        });
      const tx = await wallet.sendTransaction(updateTransaction);
      await tx.wait();
      console.log(tx);
    
  }

  async getBalances() {
    //await this.updatePriceFeeds();
    const publicKey = this.context.value.publicKeyCard;
    const nativeBalance = await this.provider[0].getBalance(publicKey);
    const tokenBalances = await this.getBalancesBlockScout();
    const balances = [nativeBalance, ...tokenBalances];
    const balancesFinal = blockchains[0].tokens.map((y, i) => {
      return parseFloat(ethers.utils.formatUnits(balances[i], y.decimals));
    });
    const pricesPyth = await getPythPrices();
    const activeTokens = balancesFinal.map(
      (balance, i) =>
        balance >
        parseFloat(deleteLeadingZeros(formatInputText(this.state.amount))) /
          pricesPyth[i],
    );
    await this.setStateAsync({balances, activeTokens, stage: 2});
  }

  async onChainPayment() {
    const privateKey = this.context.value.privateKey;
    const publicKey = this.context.value.publicKey;
    const wallet = new ethers.Wallet(privateKey, this.provider[0]);
    const contract = new ethers.Contract(
      this.context.value.publicKeyCard,
      abiBlank,
      wallet,
    );
    const indexToken = blockchains[0].tokens.findIndex(
      x => x.symbol === this.state.transactionDisplay.name,
    );
    const token = blockchains[0].tokens[indexToken];
    const amount = ethers.utils.parseUnits(
      (
        parseFloat(deleteLeadingZeros(formatInputText(this.state.amount))) /
        this.context.value.usdConversion[indexToken]
      )
        .toFixed(token.decimals)
        .toString(),
      token.decimals,
    );
    if (indexToken === 0) {
      const populateTransaction =
        await contract.populateTransaction.transferNative(
          amount,
          publicKey,
          this.state.cardProof,
          [
            '0x000000000000000000000000000000000000000000000000000000000000096a',
          ],
        );
      const tx = await wallet.sendTransaction(populateTransaction);
      await tx.wait();
      await this.setStateAsync({
        stage: 3,
        loading: false,
        explorerURL: blockchains[0].blockExplorer + 'tx/' + tx.hash,
        status: 'Confirmed',
      });
    } else {
      const populateTransaction =
        await contract.populateTransaction.transferECR20(
          amount,
          publicKey,
          token.address,
          this.state.cardProof,
          [
            '0x000000000000000000000000000000000000000000000000000000000000096a',
          ],
        );
      const tx = await wallet.sendTransaction(populateTransaction);
      await tx.wait();
      await this.setStateAsync({
        stage: 3,
        loading: false,
        explorerURL: blockchains[0].blockExplorer + 'tx/' + tx.hash,
        status: 'Confirmed',
      });
    }
  }

  async crossChainPayment() {
    const privateKey = this.context.value.privateKey;
    const publicKey = this.context.value.publicKey;
    const wallet = new ethers.Wallet(privateKey, this.provider[0]);
    const contract = new ethers.Contract(
      this.context.value.publicKeyCard,
      abiBlank,
      wallet,
    );
    const stargate = new ethers.Contract(
      blockchains[0].stargate,
      abiStargate,
      wallet,
    );

    const indexToken = blockchains[0].tokens.findIndex(
      x => x.symbol === this.state.transactionDisplay.name,
    );
    const token = blockchains[0].tokens[indexToken];
    const amount = ethers.utils.parseUnits(
      (
        parseFloat(deleteLeadingZeros(formatInputText(this.state.amount))) /
        this.context.value.usdConversion[indexToken]
      )
        .toFixed(token.decimals)
        .toString(),
      token.decimals,
    );
    // Approve
    let populateTransaction = await contract.populateTransaction.approveXUSDC(
      amount,
    );
    let tx = await wallet.sendTransaction(populateTransaction);
    await tx.wait();

    // Transfer
    const tup1 = [
      this.state.chainSelected.value,
      padAddressTo64(publicKey),
      amount.toString(),
      amount.mul(95).div(100).toString(),
      '0x',
      '0x',
      '0x01',
    ];
    console.log(tup1);
    const fee = await stargate.quoteSend(tup1, false);
    populateTransaction = await contract.populateTransaction.transferXUSDC(
      tup1,
      fee,
      this.state.cardProof,
      ['0x000000000000000000000000000000000000000000000000000000000000096a'],
      {
        value: fee[0],
      },
    );
    console.log(populateTransaction);

    tx = await wallet.sendTransaction(populateTransaction);
    await tx.wait();
    await this.setStateAsync({
      stage: 3,
      loading: false,
      explorerURL: blockchains[0].blockExplorer + 'tx/' + tx.hash,
      status: 'Confirmed',
    });
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
    const filter = [1, 0, 1, 0, 0];
    return (
      <View style={[GlobalStyles.main, {marginTop: 0}]}>
        {this.state.stage === 0 && (
          <View
            style={{
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 40,
            }}>
            <Text style={GlobalStyles.title}>Enter Amount (USD)</Text>
            <Text style={{fontSize: 36, color: 'white'}}>
              {deleteLeadingZeros(formatInputText(this.state.amount))}
            </Text>
            <VirtualKeyboard
              style={{
                width: '80vw',
                fontSize: 40,
                textAlign: 'center',
                marginTop: -10,
              }}
              cellStyle={{
                width: 50,
                height: 50,
                borderWidth: 1,
                borderColor: '#77777777',
                borderRadius: 5,
                margin: 1,
              }}
              color="white"
              pressMode="string"
              onPress={amount => this.setState({amount})}
              decimal
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: Dimensions.get('window').width,
              }}>
              <Pressable
                style={GlobalStyles.buttonStyle}
                onPress={() => this.setState({stage: 1})}>
                <Text style={GlobalStyles.buttonText}>ZK Payment</Text>
              </Pressable>
            </View>
          </View>
        )}
        {this.state.stage === 1 && (
          <View
            style={{
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 40,
            }}>
            <View style={{alignItems: 'center'}}>
              <Text style={GlobalStyles.title}>Amount (USD)</Text>
              <Text style={{fontSize: 36, color: 'white'}}>
                $ {deleteLeadingZeros(formatInputText(this.state.amount))}
              </Text>
            </View>
            <ReadTag
              cardProof={async cardProof => {
                if (cardProof) {
                  await this.setStateAsync({cardProof});
                  await this.getBalances();
                }
              }}
            />
            <View
              key={'This element its only to align the NFC reader in center'}
            />
          </View>
        )}
        {this.state.stage === 2 && (
          <React.Fragment>
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
              <Text style={[GlobalStyles.titlePaymentToken, {marginTop: 10}]}>
                Select Cross-Chain{'\n'}Payment
              </Text>
              <RNPickerSelect
                style={{
                  inputAndroidContainer: {
                    textAlign: 'center',
                  },
                  inputAndroid: {
                    textAlign: 'center',
                    color: 'gray',
                  },
                  viewContainer: {
                    ...GlobalStyles.input,
                    marginTop: 10,
                    width: Dimensions.get('screen').width * 0.9,
                  },
                }}
                value={this.state.chainSelected.value}
                items={crosschains}
                onValueChange={chain => {
                  console.log(chain);
                  const chainSelected = crosschains.find(
                    crosschain => crosschain.value === chain,
                  );
                  this.setState({
                    chainSelected,
                  });
                }}
              />
              <Text style={[GlobalStyles.titlePaymentToken, {marginTop: 20}]}>
                Select Payment Token
              </Text>
              {blockchains[0].tokens.map((token, i) =>
                (this.state.chainSelected.value === 1
                  ? this.state.activeTokens
                  : this.state.activeTokens.map(
                      (token, i) => filter[i] & token,
                    ))[i] ? (
                  <View
                    key={`${token.name}`}
                    style={{
                      paddingBottom: 20,
                      marginBottom: 20,
                    }}>
                    <Pressable
                      disabled={this.state.loading}
                      style={[
                        GlobalStyles.buttonStyle,
                        this.state.loading ? {opacity: 0.5} : {},
                        token.symbol === 'USDC' && {
                          backgroundColor: '#2775ca',
                          borderColor: '#2775ca',
                        },
                      ]}
                      onPress={async () => {
                        try {
                          await this.setStateAsync({
                            transactionDisplay: {
                              amount: (
                                this.state.amount /
                                this.context.value.usdConversion[i]
                              ).toFixed(6),
                              name: token.symbol,
                              icon: token.icon,
                            },
                            status: 'Processing...',
                            stage: 3,
                            explorerURL: '',
                            loading: true,
                          });
                          if (this.state.chainSelected.value === 1) {
                            await this.onChainPayment();
                          } else {
                            await this.crossChainPayment();
                          }
                        } catch (error) {
                          console.log(error);
                          await this.setStateAsync({loading: false});
                        }
                      }}>
                      <Text style={GlobalStyles.buttonText}>{token.name}</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Fragment key={`${token.name}`} />
                ),
              )}
            </ScrollView>
          </React.Fragment>
        )}
        {
          // Stage 3
          this.state.stage === 3 && (
            <View
              style={{
                paddingVertical: 20,
                alignItems: 'center',
                height: '100%',
                justifyContent: 'space-between',
              }}>
              <Image
                source={checkMark}
                alt="check"
                style={{width: 200, height: 200}}
              />
              <Text
                style={{
                  textShadowRadius: 1,
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: this.state.status === 'Confirmed' ? 'white' : 'gray',
                }}>
                {this.state.status}
              </Text>
              <View
                style={[
                  GlobalStyles.networkShow,
                  {
                    width: Dimensions.get('screen').width * 0.9,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <View style={{marginHorizontal: 20}}>
                    <Text style={{fontSize: 20, color: 'white'}}>
                      Transaction
                    </Text>
                    <Text style={{fontSize: 14, color: 'white'}}>
                      Card Payment
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={{marginHorizontal: 10}}>
                    {this.state.transactionDisplay.icon}
                  </View>
                  <Text style={{color: 'white'}}>
                    {`${deleteLeadingZeros(
                      formatInputText(this.state.transactionDisplay.amount),
                    )}`}{' '}
                    {this.state.transactionDisplay.name}
                  </Text>
                </View>
              </View>
              <View style={GlobalStyles.buttonContainer}>
                <Pressable
                  disabled={this.state.explorerURL === ''}
                  style={[
                    GlobalStyles.buttonStyle,
                    this.state.explorerURL === ''
                      ? {opacity: 0.5, borderColor: 'black'}
                      : {},
                  ]}
                  onPress={() => Linking.openURL(this.state.explorerURL)}>
                  <Text style={GlobalStyles.buttonText}>View on Explorer</Text>
                </Pressable>
                <Pressable
                  style={[
                    GlobalStyles.buttonStyle,
                    this.state.explorerURL === ''
                      ? {opacity: 0.5, borderColor: 'black'}
                      : {},
                  ]}
                  onPress={async () => {
                    this.setState({
                      stage: 0,
                      explorerURL: '',
                      check: 'Check',
                      status: 'Processing...',
                      errorText: '',
                      amount: '0.00', // "0.00"
                    });
                  }}
                  disabled={this.state.explorerURL === ''}>
                  <Text style={GlobalStyles.buttonText}>Done</Text>
                </Pressable>
              </View>
            </View>
          )
        }
      </View>
    );
  }
}

export default Tab3;
