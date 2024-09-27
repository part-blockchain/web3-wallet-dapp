import { defineStore } from "pinia";

export const useWalletStore = defineStore("wallet", {
  state: () => ({
    provider: null,
    contract: null,
    usafeContractAddr: null,
    usafeContract:null,
    walletAddress: null,
    isWalletConnected: false,
  }),
  actions: {
    setProvider(provider) {
      if (provider && typeof provider === "object") {
        this.provider = provider;
      } else {
        console.error("Invalid provider");
      }
    },
    // 创建合约对象(如：TransferToken)
    newContractObj(abi, contractAddr) {
      if (contractAddr && typeof contractAddr === "string") {
        // donothing
      } else {
        console.warn("Invalid contract address");
        return null
      }

      if(null === this.provider) {
        console.warn("Invalid provider");
        return null
      }
      return new this.provider.eth.Contract(abi, contractAddr);
    },

    setWalletAddress(address) {
      if (address && typeof address === "string") {
        this.walletAddress = address;
        this.isWalletConnected = true;
      } else {
        this.walletAddress = null;
        this.isWalletConnected = false;
        console.warn("Invalid wallet address");
      }
    },

    setUSafeContractAddr(address) {
      if (address && typeof address === "string") {
        this.usafeContractAddr = address;
      } else {
        this.usafeContractAddr = null;
        console.warn("Invalid usafe contract address");
      }
    },
    setUSafeContract(usafeContract) {
      if (usafeContract && typeof usafeContract.methods === "object") {
        this.usafeContract = usafeContract;
      } else {
        console.error("Invalid usafe contract");
      }
    },
  },
});
