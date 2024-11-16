import { ethers } from 'ethers';
import React, { Component, Fragment } from 'react';
import {
  Dimensions,
  Keyboard,
  Linking,
  NativeEventEmitter,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import GlobalStyles, { main, mainColor, secondaryColor } from '../../../styles/styles';
import { blockchains, refreshRate } from '../../../utils/constants';
import ContextModule from '../../../utils/contextModule';
import {
  decrypt,
  getAsyncStorageValue,
  removeDuplicatesByKey,
  setAsyncStorageValue,
} from '../../../utils/utils';
import { abiMultiChainChat } from '../../../contracts/multiChainChat';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Cam from '../../sendWallet/components/cam';

const baseTab4State = {
  loading: false,
  scanner: false
};

const chains = blockchains.slice(1, blockchains.length);

class Tab4 extends Component {
  constructor(props) {
    super(props);
    this.state = baseTab4State;
    this.provider = chains.map(
      x => new ethers.providers.JsonRpcProvider(x.rpc),
    );
    this.controller = new AbortController();
  }
  static contextType = ContextModule;

  async componentDidMount() {
    console.log(this.context.value.wallets.eth.address);
    const refreshCheck = Date.now();
    const lastRefresh = await this.getLastRefreshChat();
    if (refreshCheck - lastRefresh >= refreshRate ) {
      // Delete this multiplier
      console.log('Refreshing...');
      await setAsyncStorageValue({ lastRefreshChat: Date.now() });
      await this.refresh();
    } else {
      console.log(
        `Next refresh Available: ${Math.round(
          (refreshRate - (refreshCheck - lastRefresh)) / 1000,
        )} Seconds`,
      );
    }
  }

  async getMessages() {
    const chatContracts = chains.map(
      (x, i) =>
        new ethers.Contract(x.crossChainChat, abiMultiChainChat, this.provider[i]),
    );
    const counterByAddresses = await Promise.all(
      chatContracts.map(contract =>
        contract.chatCounter(this.context.value.wallets.eth.address),
      ),
    );
    // Chat Counters
    const chatCounters = counterByAddresses.map(x => x.toNumber());
    let memoryChatCounters = await getAsyncStorageValue('memoryChatCounters');
    if (memoryChatCounters === null) {
      console.log('memoryChatCounters is null');
      setAsyncStorageValue({ memoryChatCounters: [0,0,0] });
      memoryChatCounters = [0,0,0];
    }
    let memoryMessages = await getAsyncStorageValue('memoryMessages');
    if (memoryMessages === null) {
      console.log('memoryMessages is null');
      setAsyncStorageValue({ memoryMessages: [] });
      memoryMessages = [];
    }
    let messages = memoryMessages
    if (chatCounters.some((value, i) => value > memoryChatCounters[i])) { // Avoid fetching if there are no messages in the chat
      for (const [index, counter] of chatCounters.entries()) {
        for (let i = memoryChatCounters[index]; counter> i; i++) {
          const message = await chatContracts[index].chatHistory(
            this.context.value.wallets.eth.address,
            i,
          );
          let myJson;
          if (
            this.context.value.wallets.eth.address === message.to.toLowerCase()
          ) {
            myJson = {
              fromChainId: message.fromChainId,
              toChainId: message.toChainId,
              from: message.from,
              to: message.to,
              message: decrypt(
                message.messTo,
                this.context.value.wallets.eth.address,
                message.iv,
              ),
              amount: ethers.utils.formatUnits(message.amount, 6),
              blocktime: message.blocktime.toNumber() * 1000,
              index: i,
            };
            messages.push(myJson);
          } else if (this.context.value.wallets.eth.address === message.from.toLowerCase()) {
            myJson = {
              fromChainId: message.fromChainId,
              toChainId: message.toChainId,
              from: message.from,
              to: message.to,
              message: decrypt(
                message.messFrom,
                this.context.value.wallets.eth.address,
                message.iv,
              ),
              amount: ethers.utils.formatUnits(message.amount, 6),
              blocktime: message.blocktime.toNumber() * 1000,
              index: i,
            };
            messages.push(myJson);
          }
        }
      }
      // This function can be optimized
      const chat = messages.sort((a, b) => a.blocktime - b.blocktime).map((x, _, arr) => {
        let json = {};
        if (x.from.toLowerCase() === this.context.value.wallets.eth.address.toLowerCase()) {
          json['address'] = x.to;
        } else {
          json['address'] = x.from;
        }
        json['messages'] = arr.filter(
          y => y.to === json['address'] || y.from === json['address'],
        );
        json['messages'] = removeDuplicatesByKey(
          [...json['messages']],
          'blocktime',
        );
        json['timestamp'] = x.blocktime;
        return json;
      });
      let chatGeneral = removeDuplicatesByKey(chat, 'address');
      chatGeneral = chatGeneral.sort((a, b) => b.timestamp - a.timestamp);
      await setAsyncStorageValue({ chatGeneral });
      await setAsyncStorageValue({ memoryMessages: messages });
      await setAsyncStorageValue({ memoryChatCounters: chatCounters });
      this.context.setValue({
        chatGeneral,
      })
    }
    else{
      ToastAndroid.show('No new messages', ToastAndroid.SHORT);
    }
  }

  async refresh() {
    await this.setStateAsync({ loading: true });
    await this.getMessages();
    await this.setStateAsync({ loading: false });
  }

  async getLastRefreshChat() {
    try {
      const lastRefreshChat = await getAsyncStorageValue('lastRefreshChat');
      if (lastRefreshChat === null) throw 'Set First Date';
      return lastRefreshChat;
    } catch (err) {
      await setAsyncStorageValue({ lastRefreshChat: 0 });
      return 0;
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

  render() {
    return (
      <Fragment>
        {
          !this.state.scanner && (
            <Fragment>
              <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    progressBackgroundColor={mainColor}
                    refreshing={this.state.loading}
                    onRefresh={async () => {
                      await setAsyncStorageValue({
                        lastRefreshCard: Date.now().toString(),
                      });
                      await this.refresh();
                    }}
                  />
                }
                style={GlobalStyles.tab3Container}
                contentContainerStyle={[
                  GlobalStyles.tab3ScrollContainer,
                  {
                    height: 'auto',
                  },
                ]}>
                {this.context.value.chatGeneral.map((chat, i) => (
                  <TouchableOpacity
                    key={i}
                    onLongPress={() => {
                      Linking.openURL("https://wormholescan.io/#/txs?address=" + chat.address);
                    }}
                    onPress={() => {
                      this.props.navigation.navigate('Chat', {
                        address: chat.address,
                      });
                    }}
                    activeOpacity={0.6}
                    style={{
                      width: '100%',
                      height: 'auto',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: 25,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#' + chat.address.substring(2, 10),
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        marginHorizontal: 20,
                      }}
                    />
                    <View
                      style={{
                        width: '100%',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                      }}>
                      <Text
                        style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                        {' '}
                        {chat.address.substring(0, 12)}
                        {'...'}
                        {chat.address.substring(
                          chat.address.length - 10,
                          chat.address.length,
                        )}
                      </Text>
                      {
                        chat.messages.length > 0 &&
                        <Text
                          style={{ color: '#cccccc', fontSize: 14, fontWeight: 'bold' }}>
                          {' '}
                          {chat.messages[chat.messages.length - 1].message.substring(
                            0,
                            30,
                          )}
                          {chat.messages[chat.messages.length - 1].message.length > 30
                            ? '...'
                            : ''}
                        </Text>
                      }
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Pressable onPress={() => this.setState({ scanner: true })} style={[GlobalStyles.buttonStyle, { position: 'absolute', bottom: 25, right: 25, width: 64, height: "auto", aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }]}>
                <MaterialIcons style={{ transform: [{ rotate: '90deg' }, { scaleY: 1.4 }] }} name="chat-bubble" size={22} color={"white"} />
                <FontAwesome5 style={{ position: 'absolute', paddingLeft: 5.5, paddingTop: 1.5 }} name="plus" size={10} color={mainColor}
                />
              </Pressable>
            </Fragment>
          )
        }
        {this.state.scanner && (
          <View style={[{ height: main, justifyContent: 'center', alignItems: 'center' }]}>
            <View>
              <Text style={{ color: 'white', fontSize: 28 }}>Scan Address</Text>
            </View>
            <View
              style={{
                height: Dimensions.get('screen').height * 0.5,
                width: Dimensions.get('screen').width * 0.8,
                marginVertical: 20,
                borderColor: secondaryColor,
                borderWidth: 5,
                borderRadius: 10,
              }}>
              <Cam
                callbackAddress={async e => {
                  await this.setStateAsync({
                    scanner: false,
                  });
                  const chatGeneral = [...this.context.value.chatGeneral];
                  chatGeneral.unshift({
                    address: e,
                    messages: [],
                    timestamp: Date.now(),
                  })
                  this.context.setValue({ chatGeneral }, () => this.props.navigation.navigate('Chat', {
                    address: e
                  }));
                }}
              />
            </View>
            <Pressable
              style={[GlobalStyles.buttonCancelStyle]}
              onPress={async () => {
                await this.setStateAsync({
                  scanner: false,
                });
              }}>
              <Text style={GlobalStyles.buttonCancelText}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </Fragment>
    );
  }
}

export default Tab4;
