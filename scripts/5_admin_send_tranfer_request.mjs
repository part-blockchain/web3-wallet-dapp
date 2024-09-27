// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// 管理员发起转账请求

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const hre = require("hardhat");
const configFile = process.cwd() + "/scripts/config.json";
console.log("configFile:", configFile);
const jsonfile = require('jsonfile');
import {InitMySql, InsertData, CloseDB} from "../src/utils/mysql.js";

async function main() {
  await InitMySql();
  let config = await jsonfile.readFileSync(configFile);

  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log("the accounts list:", deployer.address, addr1.address, addr2.address);

  // 设置多签地址
  if(0 == config.ethSeries.levelTwoAddrList.length) {
    console.log("Please execute the initialization script to initialize the secondary address first");
    return;
  }

  // 将第一个二级地址作为测试地址
  const index = config.ethSeries.testLevelTwoIndex;
  const testLevelTwoAddr = config.ethSeries.levelTwoAddrList[index];

  // // 查询token余额
  // const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  // // 链接合约地址
  // const tokenObj = ERC20Token.attach(config.ethSeries.tokenAddr);
  // // 查询余额
  // let amount = await tokenObj.balanceOf(testLevelTwoAddr);
  // if(amount < config.ethSeries.transferOutAmount) {
  //   console.log("The token balance of levelTwoAddr:[", testLevelTwoAddr,"] is insufficient, please recharge!");
  //   return;
  // }

  // 初始化USafe合约
  const USafe = await hre.ethers.getContractFactory("USafe");
  // 链接合约地址
  const usafe = USafe.attach(config.ethSeries.usafeAddr);
  console.log("start to send transfer request...");
  // 将ledger地址作为多签地址
  const tx = await usafe.TransferRequest(config.ethSeries.tokenAddr, testLevelTwoAddr, config.ethSeries.ledgerAddr, config.ethSeries.transferOutAmount * 2);
  // console.log("tx:", tx);
  const receipt = await tx.wait(); // 等待交易被确认
  // 处理事件
  if (receipt.logs.length > 0) {
    
    // console.log("Logs:", receipt.logs);
    receipt.logs.forEach(async (log, index) => {
        // console.log(`Log ${index + 1}: ${log}`);
          // 判断事件名称
        const logInfo = usafe.interface.parseLog(log);
        console.log("logInfo.args:", logInfo.args[0]);
        let recordId = ""
        if (logInfo.name === "TransferRequestEvent") {
            if(recordId !== logInfo.args[0].toString()) {
              recordId = logInfo.args[0].toString();
              console.log("recordId:", recordId);
              config.ethSeries.recordList.push(recordId);
              // 写入数据库
              const insertSql = `INSERT INTO t_multi_sign_record (record_id, admin_addr, token_addr, transfer_token_addr, receiver, amount, state) VALUES (?, ?, ?, ?, ?, ?, ?)`;
              const values = [recordId, deployer.address, config.ethSeries.tokenAddr, testLevelTwoAddr, config.ethSeries.ledgerAddr, config.ethSeries.transferOutAmount * 2, 0];
              const info = await InsertData(insertSql, values);
              console.log('insert multi sign record successfully, results:', info);
            }
        }
    });

    // 关闭数据库
    CloseDB();
    // 更新config.json文件
    jsonfile.writeFileSync(configFile, config, {spaces: 2});
  } else {
      console.log("No logs found for this transaction.");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
