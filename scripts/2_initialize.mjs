// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const hre = require("hardhat");
const configFile = process.cwd() + "/scripts/config.json";
console.log("configFile:", configFile);
const jsonfile = require('jsonfile');

const numSecondAddr = 5;
async function main() {
  let config = await jsonfile.readFileSync(configFile);

  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log("the accounts list:", deployer.address, addr1.address, addr2.address);

  // 初始化USafe合约
  const USafe = await hre.ethers.getContractFactory("USafe");

  // 链接合约地址
  const usafe = USafe.attach(config.ethSeries.usafeAddr);
  if(!config.ethSeries.initialize) {
    console.log("start to call USafe initialize====");
    // 初始化一次
    await usafe.initialize();
    config.ethSeries.initialize = true;
    config.ethSeries.recordList = [];
  }

  // 查询二级地址(多签合约)
  let addrList = await usafe.getLevelSecAddrList();
  if(0 == addrList.length) {
    // 批量创建二级地址
    await usafe.batchAddLevelTwoAddr(numSecondAddr);
    addrList = await usafe.getLevelSecAddrList();
    config.ethSeries.levelTwoAddrList = addrList; // 更新二级地址到配置文件
  }

  console.log("level two address list: [" + addrList + "].");
  // 更新config.json文件
  jsonfile.writeFileSync(configFile, config, {spaces: 2});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
