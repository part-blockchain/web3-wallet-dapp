// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import {InitMySql, QueryDataByValues, InsertData, CloseDB} from "../src/utils/mysql.js"

async function main() {
  await InitMySql();
  // 查询
  const selectSql = `select * from t_transfer_token_info where contract_addr = ?`;
  const levelTwoAddr = "0x41C9183756af69c239E5c9B05529AeC9AC794903";
  let values = [levelTwoAddr];
  let data = await QueryDataByValues(selectSql, values);
  console.log('select data from t_transfer_token_info successfully, data:', data);
  // 插入数据到表中
  // const insertSql = `INSERT INTO t_tg_account (account, chatId) VALUES (?, ?)`;
  // values = ['hahhahh', 88888];
  // const info = await InsertData(insertSql, values);
  // console.log('insert data successfully, results:', info);

  // 关闭数据库
  CloseDB();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
