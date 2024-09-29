
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
