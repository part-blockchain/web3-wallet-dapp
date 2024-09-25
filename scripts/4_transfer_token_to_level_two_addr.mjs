// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// 转账erc20到level two地址

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

  // 查询token余额
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");

  // 链接合约地址
  const tokenObj = ERC20Token.attach(config.ethSeries.tokenAddr);
  // 查询余额
  let amount = await tokenObj.balanceOf(testLevelTwoAddr);
  if(amount < config.ethSeries.transferOutAmount) {
    console.log("start to transfer token...");
    await tokenObj.transfer(testLevelTwoAddr, config.ethSeries.transferInAmount);
    amount = await tokenObj.balanceOf(testLevelTwoAddr);
  }
  console.log("level two address:", testLevelTwoAddr, ", token amount:", amount);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
