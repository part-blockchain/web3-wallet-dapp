export const usafeAbi = [
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
        "name": "_admin",
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
        "internalType": "string",
        "name": "_businessId",
        "type": "string"
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
        "internalType": "string",
        "name": "_businessId",
        "type": "string"
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
        "internalType": "string",
        "name": "_businessId",
        "type": "string"
      }
    ],
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
        "internalType": "uint64",
        "name": "_recordId",
        "type": "uint64"
      }
    ],
    "name": "GetMultiSignRecord",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "businessId",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "tokenAddr",
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
        "internalType": "struct USafe.MultiSignInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_businessId",
        "type": "string"
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
        "internalType": "string",
        "name": "_businessId",
        "type": "string"
      },
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
    "name": "TransferRequest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAdmin",
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
        "name": "_newAdmin",
        "type": "address"
      }
    ],
    "name": "transferAdminShip",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
