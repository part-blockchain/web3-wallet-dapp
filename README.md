
## Installation

1. **Clone the repository:**

   ```bash
   git clone git@192.168.3.40:usafe/web3-wallet-dapp.git
   cd web3-wallet-dapp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Development

1. **To start the server:**

   ```bash
   npm run uat
   ```

   This will launch the Vite server and open the application in your browser.

## Building for Production

1. **To build the application for production:**

   ```bash
   npm run build
   ```

   This will create an optimized production build in the `dist` directory.

## Deploying Smart Contracts

1. **To compile the smart contracts:**

   ```bash 
   npm run contract:compile
   ```

2. **To deploy the smart contracts to the Sepolia test network:**

   ```bash
   npm run contract:deploy
   ```

   Make sure to set up your .env file with the necessary environment variables, such as your Infura/Alchemy project ID and private key.

## Environment Variables

1. Create a `.env` file in the root directory and add the following variables:
   ```bash
   INFURA_PROJECT_ID=your_infura_project_id
   PRIVATE_KEY=your_private_key
   ```
   Replace your_infura_project_id and your_private_key with your actual Infura project ID and private key, respectively.

## Dependencies

- **pinia**: State management library for Vue.
- **vue**: Vue.js framework.
- **vue3-toastify**: Toast notifications for Vue 3.
- **web3**: JavaScript library for interacting with Ethereum.
- **@nomicfoundation/hardhat-toolbox**: Hardhat toolbox for Ethereum development.
- **@vitejs/plugin-vue**: Vite plugin for Vue 3.
- **autoprefixer**: PostCSS plugin for autoprefixing CSS.
- **dotenv**: Module to load environment variables.
- **ethers**: JavaScript library for interacting with Ethereum, used alongside Hardhat.
- **hardhat**: Ethereum development environment.
- **postcss**: CSS post-processing tool.
- **tailwindcss**: Utility-first CSS framework.
- **vite**: Modern build tool for JavaScript projects.

## 操作步骤
以ganache网络为例：
- 部署合约
```bash
npx hardhat run .\scripts\1_deploy.mjs --network ganache
```
> 部署Token合约和USafe合约，并将合约地址写入数据库和config.json文件中。

- 启动订阅服务
```bash
npx hardhat run .\scripts\7_listen_contract_event.mjs --network ganache
```
> 订阅USafe合约事件， 包括：设置多签地址事件，发起交易请求事件，多签交易确认事件。

- 初始化
```bash
npx hardhat run .\scripts\2_initialize.mjs --network ganache
```
> 初始化并创建多个二级地址

- 设置多签地址
```bash
npx hardhat run .\scripts\3_set_multi_sign_addr.mjs --network ganache
```

- 转账token到测试的二级地址
```bash
npx hardhat run .\scripts\4_transfer_token_to_level_two_addr.mjs --network ganache
```
> 从admin地址中，向测试的二级地址中转入一定数量的token。


- 发起转账请求
也可以通过admin地址登陆交易确认系统，在web端创建交易请求。
```bash
npx hardhat run .\scripts\5_admin_send_tranfer_request.mjs --network ganache
```

- 登陆前台
```bash
http://localhost:5173
```
