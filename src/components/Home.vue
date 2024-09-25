<template>
  <section class="flex flex-col space-y-4">
    <span class="text-2xl font-semibold text-title">待确认交易</span>
    <div class="bg-card rounded-lg shadow-md p-4 text-text">
      <!-- <div class="flex border-b border-gray-700 pb-2 mb-2">
        <div class="w-1/6 font-semibold">记录ID</div>
        <div class="w-1/6 font-semibold">Token地址</div>
        <div class="w-1/6 font-semibold">转账合约地址</div>
        <div class="w-1/6 font-semibold">接收Token地址</div>
        <div class="w-1/6 font-semibold">提现金额</div>
        <div class="w-1/6 font-semibold">状态</div>
      </div> -->

      <!-- <p class="flex">
        <div class="w-1/6">{{ recordId }}</div>
        <div class="w-1/6">{{ prizePool }} ETH</div>
        <div class="w-1/6">{{ levelTwoAddr.length }}</div>
        <div
          :class="['w-1/6', state == 1 ? 'text-green-500' : 'text-red-500']"
        >
          {{ state == 1 ? "待确认" : "已确认" }}
        </div>
      </p> -->
      <el-table :data="tableData" row-key="id">
        <el-table-column prop="recordId" label="记录ID" width="150px" />
        <!-- <el-table-column type="expand">
          <template #default="props">
            <div class="p-[10px]" style="box-sizing: border-box;" v-if="props.row.list?.length">
              详情
              <el-table :data="props.row.list" :size="'small'">
                <el-table-column prop="recordId" width="100px" label="记录ID" />
                <el-table-column prop="tokenAddr" width="100px" label="Token地址" />
                <el-table-column prop="levelTwoAddr" width="100px" label="转账合约地址" />
                <el-table-column prop="receiver" width="100px" label="接收Token地址" />
                <el-table-column prop="operation" width="100px" label="操作">
                  <template #default="{ row }">
                    <el-button type="text" size="small" @click="handleEdit(row)">Edit</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="tokenAddr" label="Token地址" />
        <el-table-column prop="levelTwoAddr" label="转账合约地址" />
        <el-table-column prop="receiver" label="接收Token地址" />
        <el-table-column prop="amount" label="提现金额" />
        <el-table-column prop="state" label="状态">
          <template #default="{ row }">
            <span :class="[row.state == 0 ? 'text-green-500' : 'text-red-500']">
              {{ row.state == 0 ? "待确认" : "已确认" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" width="100px" label="操作">
          <template #default="{ row }">
            <!-- <el-button type="button" size="small" @click="handleConfirmTransaction(row)">交易确认</el-button> -->
            <div class="mt-4">
              <button @click="handleConfirmTransaction(row)" :disabled="loading || row.state != 0"
                class="relative inline-flex items-center justify-center p-0.5 mb-2 mt-4 overflow-hidden text-sm font-medium text-title rounded-lg group bg-gradient-to-br from-btn to-btn1 group-hover:from-btn group-hover:to-btn1 hover:text-white focus:outline-none">
                <span
                  class="relative px-1.5 py-1.5 transition-all ease-in duration-75 bg-card rounded-md group-hover:bg-opacity-0 cursor-pointer">
                  确认交易
                </span>
              </button>
              <!-- <div v-if="loading" class="text-sm text-gray-500">Processing...</div> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="mt-4">
        <button @click="buyTicket" :disabled="loading || state != 1"
          class="relative inline-flex items-center justify-center p-0.5 mb-2 mt-4 overflow-hidden text-sm font-medium text-title rounded-lg group bg-gradient-to-br from-btn to-btn1 group-hover:from-btn group-hover:to-btn1 hover:text-white focus:outline-none">
          <span
            class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-card rounded-md group-hover:bg-opacity-0 cursor-pointer">
            Buy Ticket
          </span>
        </button>
        <div v-if="loading" class="text-sm text-gray-500">Processing...</div>
      </div> -->
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import { useWalletStore } from "../stores/walletStore";
import { useConfigStore } from "../stores/configStore";

const walletStore = useWalletStore();
const configStore = useConfigStore();
const recordId = ref(0);
const state = ref("");
const levelTwoAddr = ref([]);
const loading = ref(false);
const tableData = ref([]);

const fetchContractData = async () => {
  await configStore.loadConfig();
  loading.value = true;
  try {    
    tableData.value = [];

    configStore.config.ethSeries.recordList.forEach(async (recordId, index) => {
      // alert("recordId:" + recordId);
      const multiSignRes = await walletStore.usafeContract.methods.getMultiSignRecord(recordId).call();
      // console.log("tokenAddr:" , multiSignRes.tokenAddr);
      // console.log("levelTwoAddr:" , multiSignRes.levelTwoAddr);
      // console.log("receiver:" , multiSignRes.receiver);
      // console.log("amount:" , multiSignRes.amount);
      // console.log("state:" , multiSignRes.state);
      const item = {
        recordId: recordId,
        tokenAddr: multiSignRes.tokenAddr,
        levelTwoAddr: multiSignRes.tokenAddr,
        receiver: multiSignRes.receiver,
        amount: multiSignRes.amount,
        state: multiSignRes.state,
      }
      tableData.value.push(item);
  });
    // tableData.value = [{
    //   id: 3,
    //   recordId: recordId.value,
    //   tokenAddr: tokenAddr.value,
    //   levelTwoAddr: levelTwoAddr.value,
    //   state: state.value,
    //   list: [{
    //     id: 31,
      //   recordId: recordId.value,
      //   tokenAddr: tokenAddr.value,
      //   levelTwoAddr: levelTwoAddr.value,
      //   state: state.value,
    //   }]
    // }];

    console.log(' tableData.value', tableData.value);


  } catch (error) {
    toast.error(`Failed to fetch contract data: ${error.message}`);
    console.error("Fetch Contract Data Error:", error);
  } finally {
    loading.value = false;
  }
};

const buyTicket = async () => {
  // loading.value = true;
  // try {
  //   const ticketPrice = walletStore.provider.utils.toWei("0.005", "ether");
  //   const gas = await walletStore.contract.methods.enter().estimateGas({
  //     from: walletStore.walletAddress,
  //     value: ticketPrice,
  //   });

  //   await walletStore.contract.methods.enter().send({
  //     from: walletStore.walletAddress,
  //     value: ticketPrice,
  //     gas,
  //   });

  //   toast.success("Ticket purchased successfully!");
  //   await fetchContractData();
  // } catch (error) {
  //   toast.error(`Failed to buy ticket: ${error.message}`);
  //   console.error("Buy Ticket Error:", error);
  // } finally {
  //   loading.value = false;
  // }
};


const handleConfirmTransaction = async (row) => {
  console.log("row info:", row);
  console.log("id:", row.id);
  console.log("recordId:", row.recordId);
  if(row.state != 0) {
    alert("交易已完成, 无须确认!");
    return;
  }
  // alert("hello:" + row.id);
  
  loading.value = true;
  // try {
  //   const ticketPrice = walletStore.provider.utils.toWei("0.005", "ether");
  //   const gas = await walletStore.contract.methods.enter().estimateGas({
  //     from: walletStore.walletAddress,
  //     value: ticketPrice,
  //   });

  //   await walletStore.contract.methods.enter().send({
  //     from: walletStore.walletAddress,
  //     value: ticketPrice,
  //     gas,
  //   });

  //   toast.success("Ticket purchased successfully!");
  //   await fetchContractData();
  // } catch (error) {
  //   toast.error(`Failed to buy ticket: ${error.message}`);
  //   console.error("Buy Ticket Error:", error);
  // } finally {
  //   loading.value = false;
  // }

};
onMounted(() => {
  fetchContractData();
});
</script>
<style>
.el-table {
  padding: 0;
}

.el-table th.el-table__cell {
  background-color: #1e1e1e;
}

.el-table tr {
  background-color: #1e1e1e;
  color: #fff;
}

.el-table--fit {
  background-color: transparent;
}

.el-table tr:hover {
  background-color: #1e1e1e;
}

.el-table__empty-block {
  background-color: #1e1e1e;
}

.el-table__expanded-cell {
  background-color: #1e1e1e;
}

.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
  background-color: #1e1e1e;

}
</style>