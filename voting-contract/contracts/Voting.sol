// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {

    string public candidate;
    uint public votes;

    function vote(string memory _candidate) public {
        candidate = _candidate;
        votes += 1;
    }

    function getVotes() public view returns (uint) {
        return votes;
    }
}