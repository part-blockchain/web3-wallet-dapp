<template>
  <section class="flex flex-col space-y-4">
    <span class="text-2xl font-semibold text-title">账户资金管理</span>
    <!-- <div class="bg-card rounded-lg shadow-md p-4 text-text flex justify-around"> -->
      <button
        type="button"
        @click="show_input_transfer_request = true"
        class="text-white bg-btn hover:bg-btn1 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 cursor-pointer"
      >
        发起转账请求
      </button>
      <div v-if="show_input_transfer_request" class="modal">
        <h3>请输入参数</h3>
        <table>
          <thead>
            <tr>
              <th>参数名称</th>
              <th>参数值</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(input, index) in input_transfer_request" :key="index">
              <td>{{ input.name }}</td>
              <td>
                <input v-model="input.value" :placeholder="'输入 ' + input.name" />
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="confirm_sendTransferRequest">确认</button>
        <button @click="cancel_sendTransferRequest">取消</button>
      </div>

      <!-----------------------设置多签地址----------------------------------------------->
      <!-- <button
        type="button"
        @click="show_input_setMultiSignAddr = true"
        class="text-white bg-btn hover:bg-btn1 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 cursor-pointer"
      >
        设置多签地址
      </button>
      <div v-if="show_input_setMultiSignAddr" class="modal">
        <h3>请输入参数</h3>
        <table>
          <thead>
            <tr>
              <th>参数名称</th>
              <th>参数值</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(input, index) in input_setMultiSignAddr" :key="index">
              <td>{{ input.name }}</td>
              <td>
                <input v-model="input.value" :placeholder="'输入 ' + input.name" />
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="confirm_setMultiSignAddr">确认</button>
        <button @click="cancel_setMultiSignAddr">取消</button>
      </div> -->


  </section>
</template>

<script setup>
import { ref } from "vue";
import { useWalletStore } from "../stores/walletStore";
import { toast } from "vue3-toastify";
const walletStore = useWalletStore();

const loading = ref(false);
let show_input_transfer_request = ref(false);
let input_transfer_request = [         // 定义输入框的名称和初始值
    { name: 'token地址', value: walletStore.tokenAddr },
    { name: '转账合约地址', value: walletStore.transferTokenAddr },
    { name: 'token接收地址', value: walletStore.receiver },
    { name: 'token数量', value: walletStore.transferAmount.toString() },
];

// 设置多签
let show_input_setMultiSignAddr = ref(false);
let input_setMultiSignAddr = [         // 定义输入框的名称和初始值
    { name: '转账合约地址', value: walletStore.transferTokenAddr },
    { name: '多签地址', value: walletStore.receiver },
];

let submittedData = []; // 存储已提交的数据

const validateInputs = (params) =>  {
  // 验证输入，确保没有空值
  return params.every(value => value.trim() !== '');
}

// 转账请求
const confirm_sendTransferRequest = async () =>  {
  const params = input_transfer_request.map(input => input.value); // 收集输入数据
  if (validateInputs(params)) {
    show_input_transfer_request = false; // 隐藏小页面
    await sendTransferRequest(params); // 调用函数并传入参数
  } else {
    alert("请填写所有输入框！");
  }
}

const cancel_sendTransferRequest = () =>  {
  show_input_transfer_request = false; // 取消时隐藏小页面
}

// 发送转账请求
const sendTransferRequest = async (params) =>  {
  if(4 !== params.length) {
    alert(`Wrong number of parameters, need 4, but have:${params.length}`);
    return;
  }
  // console.log('调用的参数:', params);
  // submittedData = params; // 存储已提交的数据
  try {
    // 预估gas
    const gas = await walletStore.usafeContract.methods.TransferRequest(params[0], params[1], params[2], params[3]).estimateGas({
      from: walletStore.walletAddress,
    });
    // 发送交易
    await walletStore.usafeContract.methods.TransferRequest(params[0], params[1], params[2], params[3]).send({
      from: walletStore.walletAddress,
      gas,
    });
    toast.success(`send TransferRequest successfully`);
  } catch (error) {
    toast.error(`Failed to sendTransferRequest Transaction: ${error.message}`);
    console.error("sendTransferRequest Error:", error);
  } finally {
    loading.value = false;
  }
}

// 设置多签
const confirm_setMultiSignAddr = async () =>  {
  const params = input_setMultiSignAddr.map(input => input.value); // 收集输入数据
  if (validateInputs(params)) {
    show_input_setMultiSignAddr = false; // 隐藏小页面
    await setMultiSignAddr(params); // 调用函数并传入参数
  } else {
    alert("请填写所有输入框！");
  }
}

const cancel_setMultiSignAddr = () =>  {
  show_input_setMultiSignAddr = false; // 取消时隐藏小页面
}

// 发送多签
const setMultiSignAddr = async (params) =>  {
  if(2 !== params.length) {
    alert(`Wrong number of parameters, need 4, but have:${params.length}`);
    return;
  }
  // 这里是你要调用的功能函数
  console.log('调用的参数:', params);

  try {
    // 预估gas
    const gas = await walletStore.usafeContract.methods.SetMultiSignAddr(params[0], params[1]).estimateGas({
      from: walletStore.walletAddress,
    });
    // 发送交易
    await walletStore.usafeContract.methods.SetMultiSignAddr(params[0], params[1]).send({
      from: walletStore.walletAddress,
      gas,
    });
    toast.success(`set multi sign address successfully`);
  } catch (error) {
    toast.error(`Failed to set multi sign address Transaction: ${error.message}`);
    console.error("set multi sign address Error:", error);
  } finally {
    loading.value = false;
  }
}


</script>
<style scoped>
.modal {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 16px 0;
  background-color: #f9f9f9;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
input {
  width: 100%;
}
button {
  margin-top: 10px;
  margin-right: 10px;
}
</style>