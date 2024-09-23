// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title TransferToken
/// @dev 转账合约（通过合约调用，将指定的Token余额从合约地址转到目标地址）
contract TransferToken {
    // 合约部署者
    address owner;

    /// @notice 记录调用合约转账token的事件
    /// @param _caller 发起转账合约转账调用的账户地址, 必须和转账合约的owner相同
    /// @param _from 付款地址，即转账合约地址
    /// @param _to 收款地址
    /// @param _amount 转账金额
    event TransferERC20Token(address indexed _caller, address indexed _from, address indexed _to, uint _amount);

    /// @notice 部署合约时，调用的构造函数
    /// @dev 在函数中需要设置合约拥有者为交易的最初调用者和Token合约地址，主要用于部署USafe合约时，
    ///      批量创建此合约，返回的合约地址作为商户的一级和二级地址；
    constructor() {
        assembly {
            sstore(owner.slot, origin())
        }
    }

    /// @notice 调用Token合约地址的转账接口
    /// @dev 根据Token合约地址，调用ERC20合约的transfer接口，
    ///      将本合约地址的Token数量转到目标地址。
    /// @param _tokenAddr 转账token的合约地址
    /// @param _to 接收token的地址
    /// @param _amount 转账的Token数量
    function Transfer(address _tokenAddr, address _to, uint256 _amount) external {
        require(msg.sender == owner, "caller is not contract owner");
        bytes memory callData = abi.encodeWithSignature("transfer(address,uint256)", _to, _amount);
        assembly {
            let result := call(gas(), _tokenAddr, 0, add(callData, 0x20), mload(callData), 0, 0)
            if iszero(result) {
                invalid()
            }
        }

        // 判断转账状态
        emit TransferERC20Token(msg.sender, address(this), _to, _amount);
    }
}
