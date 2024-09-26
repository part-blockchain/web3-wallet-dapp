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

import {InitMySql, UpdateData, CloseDB} from "../src/utils/mysql.js"

async function main() {
  await InitMySql();
  let config = await jsonfile.readFileSync(configFile);

  const [deployer, addr1, addr2] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address, addr1.address, addr2.address);

  // 部署ERC20Token合约
  console.log("start to deploy ERC20Token contract");
  const name = "USDT";
  const symbol = "USDT";
  const decimals = 6;
  const totalSupply = 100000000000000;
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const token = await ERC20Token.deploy(name, symbol, decimals, totalSupply); 
  console.log(`Depoly ERC20Token contract successful, address: ${token.target}`);

  // 链接合约地址
  const tokenObj = ERC20Token.attach(token.target);
  // 查询余额
  const result = await tokenObj.balanceOf(deployer.address);
  console.log("result:", result);

  // 部署USafe合约
  console.log("start to deploy USafe contract====");
  const USafe = await hre.ethers.getContractFactory("USafe");
  const usafe = await USafe.deploy(); 
  console.log(`Depoly USafe contract successful, address: ${usafe.target}`);

  // 更新config.json文件
  config.ethSeries.initialize = false;
  config.ethSeries.tokenAddr = token.target;
  config.ethSeries.usafeAddr = usafe.target;
  jsonfile.writeFileSync(configFile, config, {spaces: 2});

  // 写入数据库
  // 更新token地址
  const updateSql = `UPDATE t_config SET field_value = ? WHERE field_key = ?`;
  let values = [token.target, 'TokenAddr'];
  let info = await UpdateData(updateSql, values);
  console.log('update erc20 token address successfully, results:', info);

  // 更新USafe地址
  values = [usafe.target, 'USafeAddr'];
  info = await UpdateData(updateSql, values);
  console.log('update usafe address successfully, results:', info);
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
