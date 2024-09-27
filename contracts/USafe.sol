// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./TransferToken.sol";

/// @title USafe
/// @notice 商户合约
/// @dev 批量创建一级，二级地址
contract USafe {
    // 兼容v1.0
    uint8 _initialized;
    bool _initializing;
    // 合约部署者
    address admin;
    // 一级地址
    address levelOneAddr;
    // 二级地址列表
    address[] levelTwoAddrList;

    // 结构体：多签信息
    struct MultiSign {
        // token地址
        address tokenAddr;
        // 二级地址
        address levelTwoAddr;
        // 接收地址
        address receiver;
        // 转账金额
        uint256 amount;
        // 状态
        uint8 state;  // 0: 管理员已签名， 1: 多签地址已签名
    }

    // 多签记录
    mapping(uint64 => MultiSign) private mapMultiSignRecord;
    uint256 countMultiSignRecords;

    /// @notice 初始化成功的事件
    /// @param _levelOneAddr 商户一级地址
    event Initialize(address indexed _levelOneAddr);

    /// @notice 记录新增二级地址成功的事件
    /// @dev 新增成功后调用事件
    /// @param _levelTwoAddrList 新增的二级地址列表
    event BatchAddLevelTwoAddr(address[] _levelTwoAddrList);

    /// @notice 转账请求事件
    /// @param _recordId 记录Id
    /// @param _caller 发起转账合约转账调用的账户地址, 必须和转账合约的admin相同
    /// @param _levelTwoAddr 付款地址，即转账合约地址
    /// @param _to 收款地址
    /// @param _amount 转账金额
    event TransferRequestEvent(uint64 indexed _recordId, address indexed _caller, address indexed _levelTwoAddr, address _tokenAddr, address _to, uint256 _amount);

    /// @notice 交易确认事件
    /// @param _recordId 记录Id
    /// @param _caller 发起交易确认交易的账户地址, 必须和转账合约指定的多签地址相同
    event ConfirmTransactionEvent(uint64 indexed _recordId, address indexed _caller);

    /// @notice 设置多签地址事件
    /// @param _caller 发起交易确认交易的账户地址, 必须和转账合约指定的多签地址相同
    /// @param _levelTwoAddr 转账合约地址
    /// @param _multiSignAddr 多签地址
    event SetMultiSignAddrEvent(address indexed _caller, address indexed _levelTwoAddr, address indexed _multiSignAddr);

    /// @notice 初始化函数, 保存合约admin
    /// @dev 创建商户一级地址 (0x8129fc1c)
    function initialize() external {
        require(levelOneAddr == address(0), "Already initialized");
        bytes memory codeData = type(TransferToken).creationCode;
        // _initialized = 1;
        // _initializing = true;
        // admin = tx.origin;
        assembly {
            // 兼容v1.0, _initialized，_initializing和admin放在一个槽位上
            sstore(admin.slot, shl(16, origin()))
            let addr := create(0, add(codeData, 0x20), mload(codeData))
            sstore(levelOneAddr.slot, addr)
        }
        // 创建一级地址，二级地址成功事件
        emit Initialize(levelOneAddr);
    }

    /// @notice 批量添加商户的二级地址
    /// @dev 批量创建转账合约，生成的合约地址作为商户的二级地址, 并保存到二级地址列表中
    /// @param _numSecondAddr 二级地址数量
    /// @return newAddrList 返回新增的二级地址列表
    function batchAddLevelTwoAddr(uint256 _numSecondAddr) external returns(address[] memory newAddrList) {
        require(msg.sender == admin, "caller is not contract admin.");
        require(_numSecondAddr > 0, "The number of addresses added in batches must be greater than 0.");
        // 部署合约的data
        bytes memory codeData = type(TransferToken).creationCode;
        assembly {
            // 计算hash
            mstore(0, levelTwoAddrList.slot)
            let hash := keccak256(0, 32)

            newAddrList := mload(0x40)
            // 保存新增列表长度
            mstore(newAddrList, _numSecondAddr)
            // 获取原来动态数组长度
            let len := sload(levelTwoAddrList.slot)
            for {let i := 0} lt(i, _numSecondAddr) {i := add(i, 1)} {
                // 创建合约
                let addr := create(0, add(codeData, 0x20), mload(codeData))
                // 保存地址到新增列表
                mstore(add(add(newAddrList, 0x20), mul(i, 0x20)), addr)
                // 保存数据
                sstore(add(hash, add(len, i)), addr)
                // 更新长度
                sstore(levelTwoAddrList.slot, add(add(len, i), 1))
            }
            // 总字节数
            let byteSize := mul(_numSecondAddr, 0x20)
            mstore(0x40, add(newAddrList, and(add(add(byteSize, 0x20), 0x1f), not(0x1f))))
        }
        
        // 批量部署转账合约(二级地址)
        // 记录事件
        emit BatchAddLevelTwoAddr(newAddrList);
    }

    /// @notice 查询商户一级地址
    /// @return address 返回商户一级地址
    function getLevelOneAddr() external view returns(address) {
        return levelOneAddr;
    }

    /// @notice 查询商户二级地址
    /// @return address 返回商户二级地址
    function getLevelSecAddrList() external view returns(address[] memory) {
        return levelTwoAddrList;
    }

    // 更新管理员地址
    function transferAdminShip(address newAdmin) external {
        require(msg.sender == admin, "caller is not contract admin");
        admin = newAdmin;
    }

    /// @notice 初次设置转账合约的多签地址
    /// @param _levelTwoAddr 二级地址，转账token的合约地址
    /// @param _multiSignAddr 多签地址
    function SetMultiSignAddr(address _levelTwoAddr, address _multiSignAddr) external {
        require(msg.sender == admin, "caller is not contract admin");
        // 初始化合约对象
        TransferToken obj = TransferToken(_levelTwoAddr);
        obj.SetMultiSignAddr(_multiSignAddr);
        emit SetMultiSignAddrEvent(msg.sender, _levelTwoAddr, _multiSignAddr);
    }

    /// @notice 转账请求(由admin发起)
    /// @dev 根据Token合约地址，发起token转账请求，
    ///      此请求目的：将本合约地址的Token数量转到目标地址。
    /// @param _tokenAddr 转账token的合约地址
    /// @param _levelTwoAddr 二级地址，转账token的合约地址
    /// @param _to 接收token的地址
    /// @param _amount 转账的Token数量
    function TransferRequest(address _tokenAddr, address _levelTwoAddr, address _to, uint256 _amount) external {
        require(msg.sender == admin, "caller is not contract admin");
        MultiSign memory record;
        record.tokenAddr = _tokenAddr;
        record.levelTwoAddr = _levelTwoAddr;
        record.receiver = _to;
        record.amount = _amount;
        // 管理员签名状态
        record.state = 0;
        // 生成记录Id
        bytes memory input = abi.encodePacked(admin, _levelTwoAddr, countMultiSignRecords);
        // 截取前面8个字节作为记录Id
        uint64 recordId = uint64(uint256(keccak256(input)));
        mapMultiSignRecord[recordId] = record;
        countMultiSignRecords++;
        // 判断转账状态
        emit TransferRequestEvent(recordId, msg.sender, _levelTwoAddr, _tokenAddr, _to, _amount);
    }

    /// @notice 交易确认
    /// @dev 根据Token合约地址，发起token转账请求，
    ///      此请求目的：将本合约地址的Token数量转到目标地址。
    /// @param _recordId 多签记录Id
    function ConfirmTransaction(uint64 _recordId) external {
        MultiSign storage record = mapMultiSignRecord[_recordId];
        require(record.tokenAddr != address(0), "");
        require(record.levelTwoAddr != address(0), "");
        require(record.receiver != address(0), "");
        require(record.state == 0, "The record id does not exist or the administrator does not sign or the multisigning has been completed");
        // 初始化合约对象
        TransferToken obj = TransferToken(record.levelTwoAddr);
        obj.ConfirmTransaction(record.tokenAddr, record.receiver, record.amount);
        // 修改状态
        record.state = 1;
        emit ConfirmTransactionEvent(_recordId, msg.sender);
    }

    /// @notice 查询多签记录
    /// @return _recordId 多签记录id
    function getMultiSignRecord(uint64 _recordId) external view returns(MultiSign memory) {
        return mapMultiSignRecord[_recordId];
    }
}
