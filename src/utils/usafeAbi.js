export const usafeAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "_levelTwoAddrList",
        "type": "address[]"
      }
    ],
    "name": "BatchAddLevelTwoAddr",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "_recordId",
        "type": "uint64"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_caller",
        "type": "address"
      }
    ],
    "name": "ConfirmTransactionEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_levelOneAddr",
        "type": "address"
      }
    ],
    "name": "Initialize",
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
        "internalType": "uint64",
        "name": "_recordId",
        "type": "uint64"
      },
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
        "indexed": false,
        "internalType": "address",
        "name": "_tokenAddr",
        "type": "address"
      },
      {
        "indexed": false,
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
    "name": "TransferRequestEvent",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_recordId",
        "type": "uint64"
      }
    ],
    "name": "ConfirmTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_levelTwoAddr",
        "type": "address"
      },
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
        "name": "_levelTwoAddr",
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
    "name": "TransferRequest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_numSecondAddr",
        "type": "uint256"
      }
    ],
    "name": "batchAddLevelTwoAddr",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "newAddrList",
        "type": "address[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLevelOneAddr",
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
    "inputs": [],
    "name": "getLevelSecAddrList",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_recordId",
        "type": "uint64"
      }
    ],
    "name": "getMultiSignRecord",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "tokenAddr",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "levelTwoAddr",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "state",
            "type": "uint8"
          }
        ],
        "internalType": "struct USafe.MultiSign",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_addr",
        "type": "address"
      }
    ],
    "name": "isAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "transferAdminShip",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
