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
    setContract(usafeContract) {
      if (usafeContract && typeof usafeContract.methods === "object") {
        this.usafeContract = usafeContract;
      } else {
        console.error("Invalid usafe contract");
      }
    },
  },
});
