import React, {Component} from 'react';
import {Text, View} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import IconFAB from 'react-native-vector-icons/FontAwesome6';
import GlobalStyles from '../../styles/styles';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class ReadTag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      red: false,
      reading: false,
    };
    this.interval = null;
  }
  readTag = async () => {
    return new Promise(async resolve => {
      console.log('reading Visa credit card...');
      try {
        // cancel any previous requests
        await NfcManager.cancelTechnologyRequest();
      } catch (error) {
        // do nothing
      }
      try {
        await NfcManager.requestTechnology([NfcTech.IsoDep]);
        const tag = await NfcManager.getTag();
        resolve(tag.id);
      } catch (error) {
        resolve(null);
      }
    });
  };

  async componentDidMount() {
    this.interval = setInterval(async () => {
      if(this.state.reading) {
        console.log('Reading...');
        return;
      };
      this.setStateAsync({reading: true}); 
      const cardProof = await this.readTag();
      console.log(cardProof);
      if (cardProof === "5C0A5256") { // 01020304
        this.setState({red: true});
        this.props.cardProof("0x129b6c7c215752d4e1c7d79c46d6fc19519653ac1995e0f9ca4894a04b71dceb305e02b0bc47556fbbac62a71f94a00e461d82c23c6df0c16f49058e0d9c593306bff5949bce9d67bb5ad3016c092e31a32be2d119938c1024b1fcf870d245a306109bc1a43ce49b9c49345c09b54647e7c5c4b969fc3eb1c343bce1145279bf004b72324101602b7d5bba5b694cf61e9e66981de9a4612b08b439653cab68e028f387382fcd817a3617670dba2ceb5bdf5df6d5af33dec80e77affcfc15f1102997a4b5e2e706a9b164749e965d35f77a52b191746f78e6ee3a30b727a435682c89e98fc6297315e3a3001db2419ff3a441d00f2e997b08572a22aefe2f793b30510f69945f252e6846d07bb26e299eee1421441039706f1d2609abe95f07e00c440089bff738f74a36bbde1f52142a106437b2bb566363db8b4dd7dbd7c2c80b64897fac0861a3ad1b0d5fd823e3390146faeb5cc4a5b3f7a7fe97af4304fd030fec19d54076cb64f2c14248565c6be6bd1e4082d0db2fda0ee250754514b01a11ae29b4f46bce4f59493fadc3e1a57a9ff3da2182df60a9b70372cbe685050e6bddd7fb376b02ffe345821547b9026a245aff71c30d91bd04c1182ac61ed02b5456a3199a502ea06cbba01339eaa345f51d937a7a4135cf0e12180e8d062b153e5b28a6370e98bb7d747004656ab08d493321ad86d358adb402a4300a1c960fa4f863a2ba27fa16e1dbc39610bbefa8d8816cdae70ecbc1d31dc78cbc5c450ede420eddb88c99b83251c8764a04d564464225286cb967bb5706cb13b75b6d27e94fb2de508e38528361583ccb9786d4a4051b32cec9d4472b8fd93411fcd2210c6b9ab7a797c962ab9a6636fe5c8d7adc4a56f1701c4f05c5aaeca6733dcd078ea12afda0cb94119f6fc3970ebf8fdbd485973e3becc7bd970c88d5b29d1d272b4def4e7a726a9f61b10a61d90367c833700a98aa5ddfe85c6a6a9dd2f9c403f54953a8c7651f80c88bc3cae2400b88cdcd918151df8ed1a2342bb4ad29e204c193f5c2e83521e261f2b46fd90104cebfeda1fdd9b59a0e40e08033fc785e13743c5314fdfc7a3a938ec24be9347a474dd6a0b804d124bf3c8848784e707d0de5b10056bebe55004b574daa6467aff2d360e314bf1fa6521f781f5ac4d8b30ebbfb5f38a303ae11fe0a0c81517dbf614fd159886b4c10183dde00ced017391809bfc2a366039d43f6a3b6e30153a5d70b95316e7799d13232c6d0ea3cc8b41a677760194032610e143d4d36e06d52ebbe3242bc381d27e76deaaf878fe15c028f7a6d185751949ed060bc064caabadf0c82d13d7669a5cc99a8374cba8e0801fbfbe77254840b3863febd7a2d62470aa2814ac07df8d1949a061acec36ee40fd66e2cc825d76f1412b00141801a241caa8bd00e990a445a1a4c4c848911fc1a515d59eabd820c66a2671d83833a71baba6c0d3f7e70c2a578eabcf9e2265609ab8aa29fad04af52a3c3ca7a51916ac5a820bc893cdbbbfdff59f63e121369244ba990d6a6c73adf01789b12cfc5d8b277e1d8d5d4e71ef719ca12ea854cec14898041b42f9766b60df6d3a54c21617d520d6f1c11d66827c302b1a39567b91f5796fca58c941b8647b9c600aca07408db836c6fefc63e219ab9eedb28dbcd26a39144bbe38a002f719c67cb5cc463cab53e58596a490aaa1834143ea2aeb0304f1be75b908eaf8215603245ae55ce905d5f14e2a724c6a8178e0a7cb4c21908e8f6c2544cb9c86882c4bc3c31bb2caa7e290204a18977e52445bcaf7a0342171baed0ec38943476fd6f0edf3d9e0c163d4d4f49c3d99d733dc4e6ac22d0d723ebe9f88c4ddffb5d1ef87aabaa2707b6161901c69c58f3524c9491952a18fb039f61e0a4ae6d8c76f98f74ffd8730b48d11ebf7bd15d00e3a16709fdb9785f1341e2b9b9b8f7e46f0ca210b8d02046f379b8457b676bad60344c6308d8e8ea1ced6d5c5965fc93c1b065db3321b1b1b921d90204a447695e33a65946eafc532698f7fef9130143145429a5ad73431c7ec9f9be8de123255c33004f84fd0fbc304482a198c005f266f7ed7027c4d48744721a7b171dfee15a325a45c30f2325099658171a0bf3351c68de463e7e8edc2dd19788f22a8ff16234f26ccac6d58101bd7f4af2280a77cf4e42e570a0535ae5a9a9724feab8290c7b8f4c42b173db1e74e4686b817c7c5995f83226e8aa0d58b44820731b5d05f9735efbfe0a450b26bebf2ee303e9b641bc7269d84dec4be8ce1d46c381d54fc4e3ecd2488de3b20250d672b074d7306586897eb7341cdde55e3e0909a08e48f71e846d44487be3268628a1471d2e08730c06b47ee10aca4b2ba8140674a3ef786fd3aefb4daacf2621218da9df75d6f9c98f7d594a2c3391a9a6eda16ff37ef51085aa52ebf46b132fec8212c1f8c4ea4fde6fb3e1cc1587c656448e5fb40e052d38b4d7b4cffa2fbfee04dacad166766a2addd7c5b067e1b22ec68510706e013369d741e7be911adf797d39334b1e18b7825da2b94906ddb208212c319d7fe5a0e317803b8482048e18a87ca3e6025859f90c453a66be775294fddd7b49789255d3e2bea6ab8306e5945d40203eb18a60c518d0ac19482e5bf054ea03bc11990600e3367afa3b151d504070523302f76c3655cd3cdfde2c32694e1e6839427b055743d8cf9d4502b5f6409bd9b48729e91dd0e8616309df20fbf66e38f9cb7e524d8bdc363fb520b2eab3a892d63514b64b0285073e92ba4376e737c32ae5c5813967cf9ce2260e4b90b3d41a57b94733327da02bc1be6d32098f8793eb6ec8ce2fafd303849628aa293267e6f86042bbda2beafe46b06e87f1598f07477830508e69e5d78e41228a221c79d840469897c3e3cba39294579f3a91abdc435cbda2caae929bd7291b477efdab62b88718df8803aaf33612213e3116e441c46bf66435a70502a5aa09cda319c29ecc805a45e51e011bdb87ae1f07e083d8fa2700c1ff2985198cfc");
        clearInterval(this.interval);
        this.interval = null;
      } else {
        console.log('No card found');
        ToastAndroid.show('Read again', ToastAndroid.SHORT);
        await this.setStateAsync({reading: false});
      }
    }, 1000);
  }

  async componentWillUnmount() {
    this.interval && clearInterval(this.interval);
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
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <IconFAB
          name="nfc-symbol"
          size={240}
          color={this.state.red ? 'white' : 'gray'}
        />
        <Text style={GlobalStyles.title}>Tap the NFC reader</Text>
      </View>
    );
  }
}
