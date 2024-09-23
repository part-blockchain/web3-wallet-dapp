const config = require("./scripts/config.json");
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
const { INFURA_PROJECT_ID, SEPOLIA_PRIVATE_KEY } = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.24",
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
      // hardhat网络
      hardhat: {
        chainId: 1337
      },

      // ganache本地网络
      ganache: {
        url: `http://192.168.31.234:8545`,
        // 私钥方式
        // accounts: [`0x${PRIVATE_KEY1}`,`0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`,`0x${PRIVATE_KEY4}`,`0x${PRIVATE_KEY5}`],
        // 助记词方式
        accounts: {
          mnemonic: config.ethSeries.mnemonic,
        },
      },

      dev: {
        url: `http://192.168.31.117:6789`,
        // 私钥方式
        // accounts: [`0x${PRIVATE_KEY1}`,`0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`,`0x${PRIVATE_KEY4}`,`0x${PRIVATE_KEY5}`],
        // 助记词方式
        accounts: {
          mnemonic: config.ethSeries.mnemonic,
        },
      },

      local2: {
        url: `http://192.168.31.234:1789`,
        // 私钥方式
        // accounts: [`0x${PRIVATE_KEY1}`,`0x${PRIVATE_KEY2}`,`0x${PRIVATE_KEY3}`,`0x${PRIVATE_KEY4}`,`0x${PRIVATE_KEY5}`],
        // 助记词方式
        accounts: {
          mnemonic: config.ethSeries.mnemonic,
        },
      },
    },

    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      // accounts: [`0x${SEPOLIA_PRIVATE_KEY}`],
    },
};
