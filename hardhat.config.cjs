require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
const { INFURA_PROJECT_ID, SEPOLIA_PRIVATE_KEY } = process.env;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [`0x${SEPOLIA_PRIVATE_KEY}`],
    },
  },
};
