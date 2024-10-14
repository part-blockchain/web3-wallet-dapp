// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title USafe
/// @notice 商户合约
/// @dev USafe多签合约
contract USafe {
    // 兼容v1.0
    uint8 _initialized;
    bool _initializing;
    // 合约部署者
    address admin;

    // 商户对应的多签地址
    mapping(string => address) private businessIdToMultiSignAddr;

    // 结构体：多签信息
    struct MultiSignInfo {
        // 商户ID
        string businessId;
        // token地址
        address tokenAddr;
        // 接收地址
        address receiver;
        // 转账金额
        uint256 amount;
        // 状态
        uint8 state;  // 0: 管理员已签名， 1: 多签地址已签名
    }

    // 多签记录
    mapping(uint64 => MultiSignInfo) private mapMultiSignRecord;
    uint256 counts;

    /// @notice 初始化成功的事件
    /// @param _admin 管理员地址
    event Initialize(address indexed _admin);

    /// @notice 设置多签地址事件
    /// @param _caller 发起交易确认交易的账户地址, 必须和转账合约指定的多签地址相同
    /// @param _businessId 商户ID
    /// @param _multiSignAddr 多签地址
    event SetMultiSignAddrEvent(address indexed _caller, string _businessId, address _multiSignAddr);

    /// @notice 转账请求事件
    /// @param _recordId 记录Id
    /// @param _caller 发起转账合约转账调用的账户地址, 必须和转账合约的admin相同
    /// @param _businessId 商户ID
    /// @param _tokenAddr token合约地址
    /// @param _to 收款地址
    /// @param _amount 转账金额
    event TransferRequestEvent(uint64 indexed _recordId, address indexed _caller, string _businessId, address _tokenAddr, address _to, uint256 _amount);

    /// @notice 交易确认事件
    /// @param _recordId 记录Id
    /// @param _caller 发起交易确认交易的账户地址, 必须和转账合约指定的多签地址相同
    event ConfirmTransactionEvent(uint64 indexed _recordId, address indexed _caller);

    /// @notice 记录调用合约转账token的事件
    /// @param _caller 发起转账合约转账调用的账户地址, 必须和转账合约的usafeAddr相同
    /// @param _from 付款地址，即转账合约地址
    /// @param _to 收款地址
    /// @param _amount 转账金额
    event TransferERC20Token(address indexed _caller, address indexed _from, address indexed _to, uint _amount);

    /// @notice 初始化函数, 保存合约owner
    /// @dev 创建商户一级地址 (0x8129fc1c)
    function initialize() external {
        require(admin == address(0), "Already initialized");

        assembly {
            // 兼容v1.0, _initialized，_initializing和owner放在一个槽位上
            sstore(admin.slot, shl(16, origin()))
        }
        // 创建一级地址成功事件
        emit Initialize(admin);
    }

    // 更新管理员地址
    function transferAdminShip(address _newAdmin) external {
        require(msg.sender == admin, "caller is not contract admin");
        admin = _newAdmin;
    }

    /// @notice 设置转账合约的多签地址
    /// @param _businessId 商户地址
    /// @param _multiSignAddr 多签地址
    function SetMultiSignAddr(string memory _businessId, address _multiSignAddr) external {
        require(_multiSignAddr != address(0), "The multisignature address cannot be set to the 0 address");
        address multiSignAddr = businessIdToMultiSignAddr[_businessId];
        if(address(0) == multiSignAddr) {
            require(tx.origin == admin, "The caller is not admin address");
        } else {
            require(tx.origin == multiSignAddr, "The caller is not the original multiple signature address");
        }
        // 修改管理员地址
        businessIdToMultiSignAddr[_businessId] = _multiSignAddr;

        emit SetMultiSignAddrEvent(msg.sender, _businessId, _multiSignAddr);
    }

    /// @notice 转账请求(由admin发起)
    /// @dev 根据Token合约地址，发起token转账请求，
    ///      此请求目的：将本合约地址的Token数量转到目标地址。
    /// @param _businessId 商户地址
    /// @param _tokenAddr 转账token的合约地址
    /// @param _to 接收token的地址
    /// @param _amount 转账的Token数量
    function TransferRequest(string memory _businessId, address _tokenAddr, address _to, uint256 _amount) external {
        require(msg.sender == admin, "caller is not contract admin");
        MultiSignInfo memory record;
        record.businessId = _businessId;
        record.tokenAddr = _tokenAddr;
        record.receiver = _to;
        record.amount = _amount;
        // 管理员签名状态
        record.state = 0;
        // 生成记录Id
        bytes memory input = abi.encodePacked(admin, this, _businessId, counts);
        // 截取前面8个字节作为记录Id
        uint64 recordId = uint64(uint256(keccak256(input)));
        mapMultiSignRecord[recordId] = record;
        counts++;
        // 判断转账状态
        emit TransferRequestEvent(recordId, msg.sender, _businessId, _tokenAddr, _to, _amount);
    }

    /// @notice 交易确认
    /// @dev 根据Token合约地址，发起token转账请求，
    ///      此请求目的：将本合约地址的Token数量转到目标地址。
    /// @param _recordId 多签记录Id
    function ConfirmTransaction(uint64 _recordId) external {
        MultiSignInfo storage record = mapMultiSignRecord[_recordId];
        require(record.tokenAddr != address(0), "tokenAddr is null");
        require(record.receiver != address(0), "receiver is null");
        require(record.state == 0, "The record id does not exist or the administrator does not sign or the multisigning has been completed");

        string memory businessId = record.businessId;
        address multiSignAddr = businessIdToMultiSignAddr[businessId];
        require(msg.sender == multiSignAddr, "sender is not multi sign address");
        bytes memory callData = abi.encodeWithSignature("transfer(address,uint256)", record.receiver, record.amount);
        address tokenAddr = record.tokenAddr;
        assembly {
            let result := call(gas(), tokenAddr, 0, add(callData, 0x20), mload(callData), 0, 0)
            if iszero(result) {
                invalid()
            }
        }

        // 判断转账状态
        emit TransferERC20Token(msg.sender, address(this), record.receiver, record.amount);
        // 修改状态
        record.state = 1;
        emit ConfirmTransactionEvent(_recordId, msg.sender);
    }

    /// @notice 查询多签记录
    /// @return _recordId 多签记录id
    function GetMultiSignRecord(uint64 _recordId) external view returns(MultiSignInfo memory) {
        return mapMultiSignRecord[_recordId];
    }

    function getAdmin() external view returns(address) {
        return admin;
    }

    function isAdmin(address _addr) external view returns(bool) {
        return (admin == _addr);
    }

    function GetMultiSignAddr(string memory _businessId) view external returns(address)  {
        address multiSignAddr = businessIdToMultiSignAddr[_businessId];
        return multiSignAddr;
    }
}
