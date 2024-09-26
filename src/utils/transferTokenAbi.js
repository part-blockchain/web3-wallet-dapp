export const transferTokenAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "_caller",
            "type": "address"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "_levelTwoAddr",
            "type": "address"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "_multiSignAddr",
            "type": "address"
        }
        ],
        "name": "SetMultiSignAddrEvent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "_caller",
            "type": "address"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "_from",
            "type": "address"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "_to",
            "type": "address"
        },
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        }
        ],
        "name": "TransferERC20Token",
        "type": "event"
    },
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "_tokenAddr",
            "type": "address"
        },
        {
            "internalType": "address",
            "name": "_to",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        }
        ],
        "name": "ConfirmTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "GetMultiSignAddr",
        "outputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
        {
            "internalType": "address",
            "name": "_multiSignAddr",
            "type": "address"
        }
        ],
        "name": "SetMultiSignAddr",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
