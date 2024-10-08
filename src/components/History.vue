<template>
  <section class="flex flex-col space-y-4">
    <span class="text-2xl font-semibold text-title">已签名交易</span>
    <div class="bg-card rounded-lg shadow-md p-4 text-text">
      <el-table :data="tableData" row-key="id">
        <el-table-column prop="recordId" label="记录ID" width="150px" />
        <el-table-column prop="txHash" label="交易Hash" width="150px">
          <template #default="{ row }">
            <a target="_blank" style="color:#007bff;" v-if="row.txHash!=null" 
              v-bind:href="'https://sepolia.etherscan.io/tx/'+row.txHash+'#eventlog'">
              {{row.txHash}}
            </a> 
            <span v-else> {{ row.txHash }}</span>
          </template>
        </el-table-column>
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
      </el-table>
    </div>
    
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { toast } from "vue3-toastify";
import { useWalletStore } from "../stores/walletStore";
import { useConfigStore } from "../stores/configStore";
import { transferTokenAbi } from "../utils/transferTokenAbi";
import { multiSignApiUrl, publicApi, getRecordFunc, recordState } from "../utils/config";

// 定时任务
let interval;

const walletStore = useWalletStore();
const configStore = useConfigStore();
const state = ref("");
const levelTwoAddr = ref([]);
const loading = ref(false);
const tableData = ref([]);


// 从api中获取待确认交易数据
const fetchDataFromAPI = async () => {
  // toast.info(`isUpdateState: ${isUpdateState}, recordId:${recordId}`)
  loading.value = true;
  try {    
    tableData.value = [];
    // 获取和多签地址为连接钱包的多签记录
    let url = multiSignApiUrl + publicApi + getRecordFunc + walletStore.walletAddress + recordState + "1";
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
      // toast.info(`RecordId: ${record.RecordId}`)
      // toast.info(`txHash: ${record.txHash}`)
      const item = {
        recordId: record.RecordId,
        txHash: record.TxHash,
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