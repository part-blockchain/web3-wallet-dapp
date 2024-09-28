// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

/*
注意：
1.部署USafe后，需要重启此监听服务；

*/ 
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const hre = require("hardhat");
const configFile = process.cwd() + "/scripts/config.json";
console.log("configFile:", configFile);
const jsonfile = require('jsonfile');
import {InitMySql, UpdateData, QueryDataByValues, InsertData, CloseDB} from "../src/utils/mysql.js";
// const Web3 = require("web3")
import {Web3} from "web3";
import {usafeAbi} from "../src/utils/usafeAbi.js";

// 监听设置转账合约的多签地址事件
/// @notice 设置转账合约的多签地址
/// @param _levelTwoAddr 二级地址，转账token的合约地址
/// @param _multiSignAddr 多签地址
async function listenSetMultiSignAddrEvent(usafeContract) {
  // 监听 USafe SetMultiSignAddrEvent 事件
  usafeContract.events.SetMultiSignAddrEvent({
      filter: {}, // 可以设置过滤器
      fromBlock: 'latest' // 从最新的区块开始监听
  })
  .on('data', async (event, error) => {
      if (error) {
          console.error('Error:', error);
          return;
      }
      const result = event.returnValues;
      // 获取事件
      // console.log('SetMultiSignAddr event detected!, Event:', event);
      console.log("================================================");
      console.log('SetMultiSignAddrEvent:');
      // console.log(`_caller: ${result._caller}`);
      console.log(`_levelTwoAddr: ${result._levelTwoAddr}`);
      // console.log(`_multiSignAddr: ${result._multiSignAddr}`);
      console.log("================================================");

      // 查询t_transfer_token_info表，记录存在即更新，否则插入
      // 查询
      const selectSql = `select * from t_transfer_token_info where contract_addr = ?`;
      let values = [result._levelTwoAddr];
      let data = await QueryDataByValues(selectSql, values);
      console.log('select data from t_transfer_token_info successfully, data:', data);
      // 存在则更新
      if(data.length > 0) {
        // update
        const updateSql = `UPDATE t_transfer_token_info SET multi_sign_addr = ? WHERE contract_addr = ?`;
        values = [result._multiSignAddr, result._levelTwoAddr];
        let info = await UpdateData(updateSql, values);
        console.log('update t_transfer_token_info successfully, results:', info);
      }
  });

  console.log('Listening for SetMultiSignAddr events...');
}

// 监听多签交易请求事件
/// @notice 转账请求事件
/// @param _recordId 记录Id
/// @param _caller 发起转账合约转账调用的账户地址, 必须和转账合约的admin相同
/// @param _levelTwoAddr 付款地址，即转账合约地址
/// @param _tokenAddr token合约地址
/// @param _to 收款地址
/// @param _amount 转账金额
async function listenTransferRequestEvent(usafeContract) {
  // 监听 USafe TransferRequestEvent 事件
  usafeContract.events.TransferRequestEvent({
    filter: {}, // 可以设置过滤器
    fromBlock: 'latest' // 监听从最新区块开始的事件
  })
  .on('data', async (event, error) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    const result = event.returnValues;
    console.log("================================================");
    console.log('TransferRequestEvent:');
    console.log(`_recordId: ${result._recordId}`);
    console.log(`_caller: ${result._caller}`);
    console.log(`_levelTwoAddr: ${result._levelTwoAddr}`);
    console.log(`_tokenAddr: ${result._tokenAddr}`);
    console.log(`_to: ${result._to}`);
    console.log(`_amount: ${result._amount}`);
    console.log("================================================");
    
    // 查询t_multi_sign_record表，记录存在即更新，否则插入
    // 查询
    const selectSql = `select * from t_multi_sign_record where record_id = ?`;
    let values = [result._recordId];
    let records = await QueryDataByValues(selectSql, values);
    // console.log('select data from t_multi_sign_record successfully, records:', records);

    if(0 == records.length) {
      // 插入多签记录到数据库表中
      // 写入数据库
      // const insertSql = `INSERT INTO t_multi_sign_record (record_id, admin_addr, token_addr, transfer_token_addr, receiver, amount, state) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      // values = [result._recordId, result._caller, result._tokenAddr, result._levelTwoAddr, result._to, result._amount, 0];
      // const data = await InsertData(insertSql, values);
      // console.log('insert multi sign record successfully, data:', data);
    }
  })

  console.log('Listening for TransferRequest events...');
}

// 监听交易确认事件
async function listenConfirmTransactionEvent(usafeContract) {
  // 监听 USafe ConfirmTransactionEvent 事件
  usafeContract.events.ConfirmTransactionEvent({
      filter: {}, // 可以设置过滤器
      fromBlock: 'latest' // 从最新的区块开始监听
  })
  .on("data", async (event, error) => {
      if (error) {
          console.error('Error:', error);
          return;
      }
      const result = event.returnValues;
      console.log("================================================");
      console.log('ConfirmTransactionEvent:');
      console.log(`recordId: ${result._recordId}`);
      console.log("================================================");
          
      // 查询状态为0的多签记录
      const selectSql = `select * from t_multi_sign_record where record_id = ? and state = 0`;
      const values = [result._recordId];
      let results = await QueryDataByValues(selectSql, values);
      console.log('select data from t_multi_sign_record successfully, results:', results);

      // 更新状态
      if(results.length > 0) {
        // update
        const updateSql = `UPDATE t_multi_sign_record SET state = 1 WHERE record_id = ?`;
        let info = await UpdateData(updateSql, values);
        console.log('update t_multi_sign_record successfully, results:', info);
      }
  });

  console.log('Listening for ConfirmTransaction events...');
}

async function main() {
  await InitMySql();
  let config = await jsonfile.readFileSync(configFile);
  const web3 = new Web3(config.ethSeries.wsUrl);
  const usafeContract = new web3.eth.Contract(usafeAbi, config.ethSeries.usafeAddr);
  // 启动事件监听
  listenTransferRequestEvent(usafeContract);
  listenConfirmTransactionEvent(usafeContract);
  listenSetMultiSignAddrEvent(usafeContract);

  // // 关闭数据库
  // CloseDB();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
