import {Image} from 'react-native';
import DAI from '../assets/logos/dai.png';
import ETH from '../assets/logos/eth.png';
import WETH from '../assets/logos/weth.png';
import USDC from '../assets/logos/usdc.png';
import USDbC from '../assets/logos/usdbc.png';

const w = 50;
const h = 50;

export const refreshRate = 1000 * 60;

export const iconsBlockchain = {
  dai: <Image source={DAI} style={{width: w, height: h, borderRadius: 10}} />,
  eth: <Image source={ETH} style={{width: w, height: h, borderRadius: 10}} />,
  usdc: <Image source={USDC} style={{width: w, height: h, borderRadius: 10}} />,
  weth: <Image source={WETH} style={{width: w, height: h, borderRadius: 10}} />,
  usdbc: (
    <Image source={USDbC} style={{width: w, height: h, borderRadius: 10}} />
  ),
};

export const crosschains = [
  {value: 1, label: 'Base', key: 'base'},
  {value: 30110, label: 'Arbitrum', key: 'arbitrum'},
  {value: 30101, label: 'Ethereum', key: 'ethereum'},
  {value: 30111, label: 'Optimism', key: 'optimism'},
  {value: 30106, label: 'Avalance', key: 'avalance'},
  {value: 30211, label: 'Aurora', key: 'aurora'},
  {value: 30102, label: 'BNB', key: 'bnb'},
  {value: 30295, label: 'Flare', key: 'flare'},
  {value: 30294, label: 'Gravity', key: 'gravity'},
  {value: 30284, label: 'IOTA', key: 'iota'},
  {value: 30181, label: 'KAIA', key: 'kaia'},
  {value: 30109, label: 'Polygon', key: 'polygon'},
  {value: 30214, label: 'Scroll', key: 'scroll'},
  {value: 30280, label: 'SEI', key: 'sei'},
  {value: 30290, label: 'Taiko', key: 'taiko'},
];

export const bytesPyth =
  '0x504e41550100000003b801000000040d0022140810836fa9c0316e21fa3c04aee80567f56fbb392b610ed32c8994b7a126783fa60effaeaae28217ee6d50ac06c1ea62b94c1cb4e58b92f821757931b3b00004130d280fc6eabe302ef59ff168f02f8a82057ceba2f1babcaf394904ca1bc77537bacbb6129dd86c21f7fb58d9a229a1a4899e036e5f88c82e89b5b75887537201064e8a1d9db75e962b76c46596e26b25dbe944ba934ac9a280c0759050c5ced23b56a37a9d589eb66916e69efb786497ac2505859969c6afbe1017e43db8d8a4af0108974705e98fd74640a73fa9321f4d2efaa8a054410d1facfb68f7fb8db10a35591a66e71506d7fbed85b498f9b0ec3f566591a832f2e795acf8cf12d93d11c21c000afc10d4cae54f7aabc5ee9e372638e311af5593a3c176ffd0308ba5157732c4f7705a8fd1632f2e6f35cf809e0d3185983981cfcb2d910539919d250028f94b91010ba6959d3826b9bc96c4092a59a3cbe8870a81e2588955d2f470dd17b0bb2e5f89512e59e0ce4ebaf8e4287f7ce80e593a79021c5824e6b314571270e8e332e392010ce51d3b9b17722906ec34d77fc5eb154f1cd33c747d854014b5757053c3f7b575068889a183f710336ef787217db33b046de2fc3354f8d20cb24dd009a1e0e605000dab6cb2052c2e0b63d3ca1a1167f71dde4848888d96a7db2e4f390f8473b1a5b91a1abd96e0733662061c3c0a506d7c2e591112a41faffc56107a284abcf1c777010e6ce23213220a7db81e0c21ecdb15852dd20b9b40abfaeeed1bcb927d582e0adf2b54697be0946b0c2d179d133a6a1df5a5487b072558f3679b984139c53ec47a010f01292e04591fba3a378e3c2b330ecd22043ee61eda0585a39fd2016565e4ce17614796babcbf24135495d3801be4b790974ac694cd16a1613c2867d09861a9da011023889ce6a81a3bf068e544edbd0b8669c329a948bbe387d5b5e2f3132358b9627c0c15e461fec182e707f81e408e95e2101c5c25d747330ef1d1956526a20cd60111c4ae8218b3cfefe8d5faed2c1dad0f878eef12bbc3ce29efa8d7c04f0db27d307238ca782b1ff5176ea46dbe1da2b4106eba33631449402c97077f1dc7fbc390011252bd512ed511c38eac828172bb3bbb541683c5e7097d6cd0a3c8ba503f37f8117556e02b1de6f98f39c4859c2dbe9d86d66066634c0fd5399ee1528265b5a4d2006738ce7100000000001ae101faedac5851e32b9b23b5f9411a8c2bac4aae3ed4dd7b811dd1a72ea4aa71000000000595489a014155575600000000000aa2133c00002710429a7e2d3237c544679c47060a6cd6fd46d608d505005500ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace000000494030108f000000000a7b3eb4fffffff8000000006738ce71000000006738ce70000000495650aba0000000000baeba7a0b497b30a3b1d1bbd072d3c7035a852c85064ce4b0cbeb9c5ad1bb323b3efb813ed1929336bbe1e637b248bac6f8b8dc8082cead60198e07d2ae8c767ffe986e9baab8a4bf15e009f0eeacabfd62e93609f8fefe47fbe67f643bdfcc17ad610241ff032b1772821586354955e7918dfd1a48e746ef96464ef997a0f00aa6335b509ddbf1717dd7c4dd8bc47b042ae5343389026e84f40416a041c0af4e56eaa31236ecba2d9180efd96ffb77eb5bd92f0952b02d084130e9f56891db91f4147bf4d433c0fc42a95ee5f8abaa3522cd524fa5e2f23ecbd4f4ad1a11dcab0055009d4294bbcd1174d6f2003ec365831e64cc31d9f6f15a2b85399db8d5000960f600000049469450d60000000036a281e0fffffff8000000006738ce71000000006738ce700000004950daa900000000003b8610ba0bd32ac55f6d00a2d6d632aa0555876dfb56c1a37fea202a85cdaa88ba2d3b0df72d28cce056b383ae2c87b87c85f173effc3b2cb6525adc8f1948e813e465423232a06564f8aa26eda02b44677d9d3e97e8763a69549c364cd4033975876fc4b7dc8f848979ca72b86a78aabde3db4b55bc6eea600f0a1dcaa6745b9cef8d032838613c8a90f4dcc286e3437e113e49df87dc681fe7e0d62306bc8201c589f2b74ae5de5892be7ac605daf4d97335482fefa57207cbc563739cfea714f8377c667dd39da1cd3ad4ddf8abaa3522cd524fa5e2f23ecbd4f4ad1a11dcab005500eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a0000000005f5b87e000000000001ef62fffffff8000000006738ce71000000006738ce700000000005f5bf22000000000001a3b00b3d0e1c96c4cbc153555cd243bb35ef2cb24b449d33f8b61674802297380c3dbf3c4d35a0125bd2a1a0f82cebc8965d842995f546daecf4c6436d120b8b2cda14b5be7a9889bd922421ca9c98bfa9331484af6c148ef763c0f6ae6cac9d619921be77054393ac9650748324fb7c0471105144c33ca19c9c73ec9a85845d8546fd3ffb294bd01f8615113f805124bf8b90da207ad6a8b8681438109db99b2d0e854ae5de5892be7ac605daf4d97335482fefa57207cbc563739cfea714f8377c667dd39da1cd3ad4ddf8abaa3522cd524fa5e2f23ecbd4f4ad1a11dcab00550041283d3f78ccb459a24e5f1f1b9f5a72a415a26ff9ce0391a6878f4cda6b477b0000000005f34652000000000005a7edfffffff8000000006738ce71000000006738ce700000000005f16bac00000000000654ef0b082f6525122e9faf624d8dc74447df37f5e675b0fadf630d50aa69ba2180fba1738f6abfa93cd79ff143ca0e5824ca9b7b9205d1c2cbfd758463abccd10a5e46012a991a0208a178be14cbf84ffec9cf24ecf46ebdafb785136e4b68259bb58b122350b90e680311a742d210260c1e4284a364460209a276302492a5241ba6961ed7af6023b702b09dfbc0125d53826b1f9b44fb806d0f0b97a220d23182b1a3ef591c1c420dd40889f67eeac262050871bc8912cbc563739cfea714f8377c667dd39da1cd3ad4ddf8abaa3522cd524fa5e2f23ecbd4f4ad1a11dcab005500b0948a5e5313200c632b51bb5ca32f6de0d36e9950a942d19751e833f70dabfd0000000005f613480000000000030f38fffffff8000000006738ce71000000006738ce700000000005f5d2370000000000029dd00bd0e5cb011cf013dc1d2163bf5ac1c0434becff0d37d9df406e1c02cabb4b24a8cc1b308b49ecd5a9b2cb48b5e37042be470b91bd34470a9e2cce09ddc6cac7ddf0abc7b207686769690776997ce6515f5751c9b9864d5b26adcdbd60001a9f8bc81b2885b28a40691f97cb7055289f850186bb705bad9f80a6745b9cef8d032838613c8a90f4dcc286e3437e113e49df87dc681fe7e0d62306bc8201c589f2b74ae5de5892be7ac605daf4d97335482fefa57207cbc563739cfea714f8377c667dd39da1cd3ad4ddf8abaa3522cd524fa5e2f23ecbd4f4ad1a11dcab';

export const blockchains = [
  {
    network: 'Base',
    token: 'ETH',
    chainId: 8453,
    blockExplorer: 'https://base.blockscout.com/',
    api: 'https://base.blockscout.com/api/',
    rpc: 'https://base-mainnet.g.alchemy.com/v2/8EKVv8Jxrm4fGZBD2RyuEjBrAIu90Ynd',
    batchBalancesAddress: '0xA0D8A1940e4439e6595B74993Cc49f2d8364f7Ff',
    pyth: '0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a',
    stargate:"0x27a16dc786820B16E5c9028b75B99F6f604b5d26",
    iconSymbol: 'eth',
    decimals: 18,
    tokens: [
      // Updated April/19/2024
      {
        name: 'Ethereum (Base)',
        symbol: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        icon: iconsBlockchain.eth,
        coingecko: 'ethereum',
      },
      {
        name: 'Wrapped Ether',
        symbol: 'WETH',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
        icon: iconsBlockchain.weth,
        coingecko: 'weth',
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        decimals: 6,
        icon: iconsBlockchain.usdc,
        coingecko: 'usd-coin',
      },
      {
        name: 'USD Base Coin',
        symbol: 'USDbC',
        address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
        decimals: 6,
        icon: iconsBlockchain.usdbc,
        coingecko: 'bridged-usd-coin-base',
      },
      {
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        decimals: 18,
        icon: iconsBlockchain.dai,
        coingecko: 'dai',
      },
    ],
  },
];

// Cloud Account Credentials
export const CloudAccountController =
  '0x72b9EB24BFf9897faD10B3100D35CEE8eDF8E43b';
export const CloudPublicKeyEncryption = `
-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAtflt9yF4G1bPqTHtOch47UW9hkSi4u2EZDHYLLSKhGMwvHjajTM+
wcgxV8dlaTh1av/2dWb1EE3UMK0KF3CB3TZ4t/p+aQGhyfsGtBbXZuwZAd8CotTn
BLRckt6s3jPqDNR3XR9KbfXzFObNafXYzP9vCGQPdJQzuTSdx5mWcPpK147QfQbR
K0gmiDABYJMMUos8qaiKVQmSAwyg6Lce8x+mWvFAZD0PvaTNwYqcY6maIztT6h/W
mfQHzt9Z0nwQ7gv31KCw0Tlh7n7rMnDbr70+QVd8e3qMEgDYnx7Jm4BzHjr56IvC
g5atj1oLBlgH6N/9aUIlP5gkw89O3hYJ0QIDAQAB
-----END RSA PUBLIC KEY-----
`;
