import { createRequire } from "module";
const require = createRequire(import.meta.url);
const configFile = process.cwd() + "/scripts/config.json";
const jsonfile = require('jsonfile');
// 引入 mysql2 模块
const mysql = require('mysql2');

let connection = null;
// 初始化，连接数据库
export async function InitMySql() {
  let config = await jsonfile.readFileSync(configFile);
  // 创建与 MySQL 数据库的连接
  connection = mysql.createConnection({
    host: config.mysql.host,       // 数据库地址
    user: config.mysql.user,               // 数据库用户名
    password: config.mysql.password,// 数据库密码
    database: config.mysql.database // 数据库名称
  });

  // 连接到数据库
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      return;
    }
    // console.log('Connected to MySQL as id ' + connection.threadId);
  });
  return connection;
}

// 查询数据
export async function QueryData(selectSql) {
    return new Promise((resolve, reject) => {
        // 查询
        connection.query(selectSql, (error, results) => {
            if (error) {
                console.error('Error select data:', error.stack);
                return reject(error); // 查询出错时拒绝 Promise
            }
            resolve(results); // 查询成功时解析 Promise
        });
    })
}

// 查询数据
export async function QueryDataByValues(selectSql, values) {
    return new Promise((resolve, reject) => {
        // 查询
        connection.query(selectSql, values, (error, results) => {
            if (error) {
                console.error('Error select data:', error.stack);
                return reject(error); // 查询出错时拒绝 Promise
            }
            resolve(results); // 查询成功时解析 Promise
        });
    })
}

// 插入数据
export async function InsertData(insertSql, values) {
    return new Promise((resolve, reject) => {
        // 查询
        connection.query(insertSql, values, (error, results) => {
            if (error) {
                console.error('Error insert data:', error.stack);
                return reject(error); // 查询出错时拒绝 Promise
            }
            resolve(results); // 查询成功时解析 Promise
        });
        connection.commit();
    })
}

// 更新数据
export async function UpdateData(updateSql, values) {
    return new Promise((resolve, reject) => {
        // 查询
        connection.query(updateSql, values, (error, results) => {
            if (error) {
                console.error('Error update data:', error.stack);
                return reject(error); // 查询出错时拒绝 Promise
            }
            resolve(results); // 查询成功时解析 Promise
        });
        connection.commit();
    })
}

// 关闭数据库连接
export async function CloseDB() {
    connection.end(); // 关闭连接
}