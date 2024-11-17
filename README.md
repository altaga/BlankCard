# Chain-Estate

Blank Card leverages ZK rollups to safeguard credit and debit cards from cloning while streamlining their integration into the crypto ecosystem.

# Intro:

En un mundo donde las transacciones digitales son cada vez más comunes, la seguridad de las tarjetas de crédito y débito enfrenta constantes desafíos como el fraude y la clonación. Además, la integración de las finanzas tradicionales con el ecosistema cripto sigue siendo un proceso complejo y lleno de barreras, lo que dificulta su adopción generalizada. 

# Problem:

El problema con esto es la exposición de datos sensibles en tarjetas tradicionales mediante su NFC, que las hace vulnerables a clonación y fraude.

# Solution:

**Blank Card** protege los pagos con tarjeta de la clonación y el fraude al usar **ZK rollups**, evitando que datos sensibles como el número de la tarjeta o el CVV sean expuestos durante las transacciones crypto y eventualmente tradicionales.  

# Diagrams:

<img src="./Images/general.png">

# Noir and ZK Circuits:

Para realizar los circuitos de ZK se utilizo Noir Lang, se desarrollo un circuito el cual cuenta con 3 caracteristicas importantes de chequeo.

- El numero y exp number de la trajeta corresponde al numero cuando se creo.
- El numero de expriacion no vencido, osea es una trajeta valida aun.
- Revision de el numero de la trajeta mediante el algoritmo de Luhn, este revisa que el numero de la tarjeta pase una prueba matematica.

Todo el circuito asi como sus implementaciones de revision ZK estan en el siguiente enlace.

[CODE](./Circuit/main.nr)

# Base:

Utilizamos Base como nuestra chain principal, debido a sus costos bajos de transacciones y su capacidad de ejecutar sin problema los ZK Verifiers de la libreria Noir.

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
        .
        .
        .
        
        ],
    },
    ];

Todos los datos utilizados para interactuar con Base estan en el siguiente codigo.
[CODE](./BlankCard/src/utils/constants.js)

# Blockscout:

Todos los datos provenientes de la chain como lo son lectura de balances y transacciones en nuestra aplicacion se realizaron con Blockscount.

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

Todas las implementaciones tecnicas de este codigo estan en el codigo de nuestra app.

[CODE](./BlankCard/src/screens/main/tabs/tab1.js)

# Pyth:

Cuando se realiza un pago es muy importante que los datos de precios sean presisos, asi que en los momentos de pago, previo a ellos se realiza un update y un fetch a los price feeds de Pyth con Hermes.

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

La implementacion de estos Price Feeds al momento del pago estan implementados en el siguiente enlace.

[CODE](./BlankCard/src/screens/main/tabs/tab3.js)

# Layer Zero:

Para poder realizar un medio de pago eficiente, basarnos solo en una chain seria una mala estrategia, asi que utilizamos la plataforma de Stargate para realizar crosschain on payment, lo cual indica que al momento de realizar el pago podremos decidir la chain objetivo de nuestros tokens.

    // Crosschain Transfer

    function approveXUSDC(uint256 value) public onlyOwner {
        USDCContract.approve(stargatePoolUSDCAddress, value);
    }

    function transferXUSDC(
        SendParam calldata _sendParam,
        MessagingFee calldata _fee,
        bytes calldata _proof,
        bytes32[] calldata _publicInputs
    ) public payable{
        require(
            noirVerifier.verify(_proof, _publicInputs) == true,
            "Incorrect Proof"
        );
        stargatePoolUSDC.send{value: msg.value}(_sendParam, _fee, address(this));
    }

Por ahora la implementacion esa realizada para funcionar con USDC al momento del pago, pero todo el contrato podran encontrarlo en el siguiente enlace.

[CODE](./Contracts/BlankAccount.sol)