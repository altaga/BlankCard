export const abiBlank = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approveXUSDC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "newOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_noirVeriferAddress",
				"type": "address"
			}
		],
		"name": "newVerifier",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenContract",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "_proof",
				"type": "bytes"
			},
			{
				"internalType": "bytes32[]",
				"name": "_publicInputs",
				"type": "bytes32[]"
			}
		],
		"name": "transferECR20",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_tokenContract",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "_proof",
				"type": "bytes"
			},
			{
				"internalType": "bytes32[]",
				"name": "_publicInputs",
				"type": "bytes32[]"
			}
		],
		"name": "transferECR721",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "bytes",
				"name": "_proof",
				"type": "bytes"
			},
			{
				"internalType": "bytes32[]",
				"name": "_publicInputs",
				"type": "bytes32[]"
			}
		],
		"name": "transferNative",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint32",
						"name": "dstEid",
						"type": "uint32"
					},
					{
						"internalType": "bytes32",
						"name": "to",
						"type": "bytes32"
					},
					{
						"internalType": "uint256",
						"name": "amountLD",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "minAmountLD",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "extraOptions",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "composeMsg",
						"type": "bytes"
					},
					{
						"internalType": "bytes",
						"name": "oftCmd",
						"type": "bytes"
					}
				],
				"internalType": "struct SendParam",
				"name": "_sendParam",
				"type": "tuple"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "nativeFee",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lzTokenFee",
						"type": "uint256"
					}
				],
				"internalType": "struct MessagingFee",
				"name": "_fee",
				"type": "tuple"
			},
			{
				"internalType": "bytes",
				"name": "_proof",
				"type": "bytes"
			},
			{
				"internalType": "bytes32[]",
				"name": "_publicInputs",
				"type": "bytes32[]"
			}
		],
		"name": "transferXUSDC",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_noirVeriferAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_stargatePoolUSDCAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_pythContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [
			{
				"internalType": "bytes[]",
				"name": "priceUpdate",
				"type": "bytes[]"
			}
		],
		"name": "updatePyth",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "s_contract",
				"type": "address"
			}
		],
		"name": "getBalanceECR20",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]