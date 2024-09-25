// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// 获取多签记录

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const hre = require("hardhat");
const configFile = process.cwd() + "/scripts/config.json";
const jsonfile = require('jsonfile');

async function main() {
  let config = await jsonfile.readFileSync(configFile);

  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log("the accounts list:", deployer.address, addr1.address, addr2.address);

  // 设置多签地址
  if(0 == config.ethSeries.recordList.length) {
    console.log("No record of multiple signings!");
    return;
  }

  // 初始化USafe合约
  const USafe = await hre.ethers.getContractFactory("USafe");
  // 链接合约地址
  const usafe = USafe.attach(config.ethSeries.usafeAddr);
  // 将第一个二级地址作为测试地址
  // const recordId = config.ethSeries.recordList[2];

  console.log("start to get multi sign record...");
  config.ethSeries.recordList.forEach(async (recordId, index) => {
        // 判断事件名称
      const multiSignRes = await usafe.getMultiSignRecord(recordId);
      console.log("recordId:", recordId, 
        ", multiSign info: [tokenAddr:", multiSignRes[0], ", levelTwoAddr:", multiSignRes[1],
        ", receiver:", multiSignRes[2], ", amount:", multiSignRes[3], ", state:", multiSignRes[4], "]");
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
