// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

/**
 * @title Donation
 * @dev Store & retrieve amount
 */
contract Donation {
    mapping(address => uint256) public addrToAmount;
    mapping(uint => address) numToAddress;
    address public owner;
    uint public count = 0;

    constructor() public {
        owner = msg.sender;
    } 

    function fund() public payable {
        require(msg.value > 0, "empty amount");
        uint newAddr = 1;
        for(uint i = 0; i < count; i++) {
            if(numToAddress[i] == msg.sender) {
                newAddr = 0;
            }
        }
        if(newAddr == 1) {
            numToAddress[count] = msg.sender;
            count++;
        }
        addrToAmount[msg.sender] += msg.value;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "only owner");
        _;
    }

    function withdraw(address addr) payable onlyOwner public {
        require(address(this).balance > 0, "empty balance");   
        payable(addr).transfer(address(this).balance);
        for(uint i = 0; i < count; i++) {
            address a = numToAddress[i];
            addrToAmount[a] = 0;
        }
    }

    function balance() public view returns(uint256) {
        return address(this).balance;
    }
}