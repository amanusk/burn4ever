// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Burn4Ever {
    receive() external payable {}

    constructor() public {
        tx.origin.call{ value: address(this).balance / 1000 }(new bytes(0));
        selfdestruct(payable(this));
    }
}
