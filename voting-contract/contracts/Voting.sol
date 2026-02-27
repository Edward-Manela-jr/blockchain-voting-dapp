// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    
    mapping(string => uint) public candidateVotes;
    string[] public candidates;
    mapping(address => bool) public hasVoted;
    
    function vote(string memory _candidate) public {
        require(!hasVoted[msg.sender], "You have already voted!");
        
        if (candidateVotes[_candidate] == 0) {
            candidates.push(_candidate);
        }
        candidateVotes[_candidate] += 1;
        hasVoted[msg.sender] = true;
    }
    
    function getVotes(string memory _candidate) public view returns (uint) {
        return candidateVotes[_candidate];
    }
    
    function getAllCandidates() public view returns (string[] memory) {
        return candidates;
    }
    
    function getCandidateVotes(string[] memory _candidates) public view returns (uint[] memory) {
        uint[] memory votes = new uint[](_candidates.length);
        for (uint i = 0; i < _candidates.length; i++) {
            votes[i] = candidateVotes[_candidates[i]];
        }
        return votes;
    }
    
    function hasVotedCheck() public view returns (bool) {
        return hasVoted[msg.sender];
    }
}