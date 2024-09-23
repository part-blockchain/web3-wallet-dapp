// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./TransferToken.sol";
/// @title USafe
/// @notice 商户合约
/// @dev 批量创建一级，二级地址
contract USafeV2 {
    // 兼容v1.0
    uint8 _initialized;
    bool _initializing;
    // 合约部署者
    address owner;
    // 一级地址
    address levelOneAddr;
    // 二级地址列表
    address[] levelTwoAddrList;
    // 一级地址列表
    address[] levelOneAddrList;

    /// @notice 记录批量创建商户一级，二级地址成功的事件
    /// @dev 批量创建成功后调用事件
    /// @param _levelOneAddrList 商户一级地址列表
    /// @param _levelTwoAddrList 商户二级地址列表
    event CreateAddresses(address[] _levelOneAddrList, address[] _levelTwoAddrList);

    /// @notice 记录新增二级地址成功的事件
    /// @dev 新增成功后调用事件
    /// @param _levelTwoAddrList 新增的二级地址列表
    event BatchAddLevelTwoAddr(address[] _levelTwoAddrList);

    /// @notice 初始化函数，只初始化一次
    /// @dev 批量创建商户一级, 二级地址
    /// @param _numOneAddr 一级地址数量
    /// @param _numSecondAddr 二级地址数量
    function initialize(uint256 _numOneAddr, uint256 _numSecondAddr) external {
        require(!_initializing, "Already initialized");
        // _initialized = 1;
        // _initializing = true;
        // owner = tx.origin;

        // 部署合约的data
        bytes memory codeData = type(TransferToken).creationCode;
        assembly {
            // 兼容v1.0, _initialized，_initializing和owner放在一个槽位上
            sstore(owner.slot,  or(shl(16, origin()), 0x0101))

            // 计算一级地址列表的hash
            mstore(0, levelOneAddrList.slot)
            let hash := keccak256(0, 32)
            // 获取原来一级地址列表数组长度
            let len := sload(levelOneAddrList.slot)
            for {let i := 0} lt(i, _numOneAddr) {i := add(i, 1)} {
                // 创建合约
                let addr := create(0, add(codeData, 0x20), mload(codeData))
                // 保存数据
                sstore(add(hash, add(len, i)), addr)
                // 更新长度
                sstore(levelOneAddrList.slot, add(add(len, i), 1))
            }

            // 计算二级地址列表的hash
            mstore(0, levelTwoAddrList.slot)
            hash := keccak256(0, 32)
            // 获取原来二级地址列表数组长度
            len := sload(levelTwoAddrList.slot)
            for {let i := 0} lt(i, _numSecondAddr) {i := add(i, 1)} {
                // 创建合约
                let addr := create(0, add(codeData, 0x20), mload(codeData))
                // 保存数据
                sstore(add(hash, add(len, i)), addr)
                // 更新长度
                sstore(levelTwoAddrList.slot, add(add(len, i), 1))
            }
        }

        // 创建一级地址，二级地址成功事件
        emit CreateAddresses(levelOneAddrList, levelTwoAddrList);
    }

    /// @notice 批量添加商户的二级地址
    /// @dev 批量创建转账合约，生成的合约地址作为商户的二级地址, 并保存到二级地址列表中
    /// @param _numSecondAddr 二级地址数量
    /// @return newAddrList 返回新增的二级地址列表
    function batchAddLevelTwoAddr(uint256 _numSecondAddr) external returns(address[] memory newAddrList) {
        require(msg.sender == owner, "caller is not contract owner.");
        require(_numSecondAddr > 0, "The number of addresses added in batches must be greater than 0.");
        // 部署合约的data
        bytes memory codeData = type(TransferToken).creationCode;
        assembly {
            // 批量部署转账合约(二级地址)
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
        
        // 记录事件
        emit BatchAddLevelTwoAddr(newAddrList);
        // return newAddrList;
    }

    /// @notice 查询商户一级地址
    /// @return address 返回商户一级地址
    function getLevelOneAddr() external view returns(address) {
        return levelOneAddr;
    }

    /// @notice 查询商户一级地址
    /// @return address[] 查询商户一级地址列表
    function getLevelOneAddrList() external view returns(address[] memory) {
        return levelOneAddrList;
    }

    /// @notice 查询商户二级地址
    /// @return address[] 返回商户二级地址列表
    function getLevelSecAddrList() external view returns(address[] memory) {
        return levelTwoAddrList;
    }
}
