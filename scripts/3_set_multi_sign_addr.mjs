// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// 设置多签地址

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const hre = require("hardhat");
const configFile = process.cwd() + "/scripts/config.json";
console.log("configFile:", configFile);
const jsonfile = require('jsonfile');

async function main() {
  let config = await jsonfile.readFileSync(configFile);

  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log("the accounts list:", deployer.address, addr1.address, addr2.address);

  // 设置多签地址
  if(0 == config.ethSeries.levelTwoAddrList.length) {
    console.log("Please execute the initialization script to initialize the secondary address first");
    return;
  }

  // 将第一个二级地址作为测试地址
  const testLevelTwoAddr = config.ethSeries.levelTwoAddrList[0];
  // 查询多签地址
  const TransferToken = await hre.ethers.getContractFactory("TransferToken");
  const transferToken = TransferToken.attach(testLevelTwoAddr);

  let multiSignAddr = await transferToken.GetMultiSignAddr();
  
  if(multiSignAddr == "0x0000000000000000000000000000000000000000") {
    // 初始化USafe合约
    const USafe = await hre.ethers.getContractFactory("USafe");
    // 链接合约地址
    const usafe = USafe.attach(config.ethSeries.usafeAddr);
    console.log("start to set multi sign address...");
    // 将ledger地址作为多签地址
    await usafe.SetMultiSignAddr(testLevelTwoAddr, config.ethSeries.ledgerAddr);
    multiSignAddr = await transferToken.GetMultiSignAddr();
  }

  console.log("TransferToken addr:", testLevelTwoAddr, ", multiSignAddr:", multiSignAddr)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
