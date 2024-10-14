// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// 设置多签地址(一级地址为多签合约，Ledger为测试的多签地址)

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const hre = require("hardhat");
const configFile = process.cwd() + "/scripts/config.json";
console.log("configFile:", configFile);
const jsonfile = require('jsonfile');
import {InitMySql, InsertData, CloseDB} from "../src/utils/mysql.js"

async function main() {
  let config = await jsonfile.readFileSync(configFile);

  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log("the accounts list:", deployer.address, addr1.address, addr2.address);
  // 初始化USafe合约
  const USafe = await hre.ethers.getContractFactory("USafe");
  // 链接合约地址
  const usafe = USafe.attach(config.ethSeries.usafeAddr);
  // 设置多签地址
  const admin = await usafe.getAdmin();
  if("0x0000000000000000000000000000000000000000" == admin) {
    console.log("Please execute the initialization script to initialize");
    return;
  }

  // 测试商户ID
  const businessId = config.ethSeries.businessIdList[config.ethSeries.testIndex];
  let multiSignAddr = await usafe.GetMultiSignAddr(businessId);
  // 转账合约未设置多签地址
  if(multiSignAddr == "0x0000000000000000000000000000000000000000") {
    console.log("start to set multi sign address...");
    // 将ledger地址作为多签地址
    await usafe.SetMultiSignAddr(businessId, config.ethSeries.ledgerAddr);
    multiSignAddr = await usafe.GetMultiSignAddr(businessId);

    // 在订阅事件服务中处理
    // // 初始化数据库
    // await InitMySql();
    // // 插入数据到表中(t_multi_sign_address_info)
    // const insertSql = `INSERT INTO t_multi_sign_address_info (business_id, multi_sign_addr) VALUES (?, ?)`;
    // const values = [businessId, multiSignAddr];
    // const info = await InsertData(insertSql, values);
    // console.log('insert transfer token info successfully, results:', info);
    // CloseDB();
  } else {
    console.log("Multiple signature addresses have been configured and do not need to be configured.");
  }

  console.log("businessId:", businessId, ", multiSignAddr:", multiSignAddr)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
