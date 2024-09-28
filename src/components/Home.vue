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
import { ref, onMounted, onBeforeUnmount } from "vue";
import { toast } from "vue3-toastify";
import { useWalletStore } from "../stores/walletStore";
import { useConfigStore } from "../stores/configStore";
import { transferTokenAbi } from "../utils/transferTokenAbi";
import { multiSignApiUrl, publicApi, getRecordFunc, updateRecordStateFunc } from "../utils/config";

// 定时任务
let interval;

const walletStore = useWalletStore();
const configStore = useConfigStore();
const state = ref("");
const levelTwoAddr = ref([]);
const loading = ref(false);
const tableData = ref([]);

// 从合约中获取待确认交易数据
const fetchContractData = async () => {
  await configStore.loadConfig();
  loading.value = true;
  try {    
    tableData.value = [];
    // 获取和多签地址为连接钱包的多签记录
    configStore.config.ethSeries.recordList.forEach(async (recordId, index) => {
      // alert("recordId:" + recordId);
      // console.log("walletStore.usafeContract===:" ,walletStore.usafeContract);
      console.log("recordId:" , recordId);
      const multiSignRes = await walletStore.usafeContract.methods.getMultiSignRecord(recordId).call();
      // console.log("tokenAddr:" , multiSignRes.tokenAddr);
      // console.log("levelTwoAddr:" , multiSignRes.levelTwoAddr);
      // console.log("receiver:" , multiSignRes.receiver);
      // console.log("amount:" , multiSignRes.amount);
      // console.log("state:" , multiSignRes.state);

      // 过滤多签地址为连接的钱包地址
      // alert("walletStore.walletAddress:" + walletStore.walletAddress);
      const transferToken = walletStore.newContractObj(transferTokenAbi, multiSignRes.levelTwoAddr);
      const multiSignAddr = await transferToken.methods.GetMultiSignAddr().call();
      // alert("multiSignAddr:" + multiSignAddr);
      if(multiSignAddr.toLowerCase() === walletStore.walletAddress.toLowerCase() && !multiSignRes.state) {
        const item = {
          recordId: recordId,
          tokenAddr: multiSignRes.tokenAddr,
          levelTwoAddr: multiSignRes.levelTwoAddr,
          receiver: multiSignRes.receiver,
          amount: multiSignRes.amount,
          state: multiSignRes.state,
        }
        tableData.value.push(item);
      }
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

// 从api中获取待确认交易数据
const fetchDataFromAPI = async () => {
  // toast.info(`isUpdateState: ${isUpdateState}, recordId:${recordId}`)
  loading.value = true;
  try {    
    tableData.value = [];
    // 获取和多签地址为连接钱包的多签记录
    let url = multiSignApiUrl + publicApi + getRecordFunc + walletStore.walletAddress;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    if(null === data.result || 0 === data.result.length) {
      return;
    }
    // console.log('Data posted:', data.result);
    // toast.info(`data.result: ${data.result}`)
    data.result.forEach(async (record, index) => {
      // toast.info(`recordid: ${record.RecordId}`)
      const item = {
        recordId: record.RecordId,
        tokenAddr: record.TokenAddr,
        levelTwoAddr: record.TransferTokenAddr,
        receiver: record.Receiver,
        amount: record.Amount,
        state: record.State,
      }
      tableData.value.push(item);
    });
  } catch (error) {
    toast.error(`Failed to fetch data from api service: ${error.message}`);
    console.error("Fetch Data Error:", error);
  } finally {
    loading.value = false;
  }
};

// 确认交易操作
const handleConfirmTransaction = async (row) => {
  // console.log("row info:", row);
  // toast.info("row info:" + row.recordId);
  loading.value = true;
  if(row.state != 0) {
    alert("交易已完成, 无须确认!");
    return;
  }

  try {
    // 预估gas
    const gas = await walletStore.usafeContract.methods.ConfirmTransaction(row.recordId).estimateGas({
      from: walletStore.walletAddress,
    });
    // 发送交易
    await walletStore.usafeContract.methods.ConfirmTransaction(row.recordId).send({
      from: walletStore.walletAddress,
      gas,
    });
    toast.success(`Confirm Transaction successfully`);
    // 刷新
    await fetchDataFromAPI();
  } catch (error) {
    toast.error(`Failed to Confirm Transaction: ${error.message}`);
    console.error("ConfirmTransaction Error:", error);
  } finally {
    loading.value = false;
  }
};

// // 控件挂载事件
// onMounted(() => {
//   // fetchContractData();
//   fetchDataFromAPI();
// });

onMounted(() => {
  // 立即刷新
  // fetchContractData();
  fetchDataFromAPI();
  // 定时任务
  interval = setInterval(() => {
    // fetchContractData();
    fetchDataFromAPI();
  }, 5000);
});

onBeforeUnmount(() => {
  // 清除定时器
  clearInterval(interval);
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