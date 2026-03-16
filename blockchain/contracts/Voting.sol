// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Mapping to store candidates
    mapping(uint => Candidate) public candidates;
    // Store candidates count
    uint public candidatesCount;
    // Mapping to store accounts that have voted
    mapping(address => bool) public voters;
    // Step 5 — Add Election State Control
    bool public electionActive;
    // Step 6 — Admin for control
    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    constructor() {
        admin = msg.sender;
        electionActive = false;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        require(!electionActive, "Cannot add candidates after election starts");
        
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Step 6 — Control functions
    function startElection() public onlyAdmin {
        require(candidatesCount > 0, "No candidates registered");
        
        electionActive = true;
    }

    function endElection() public onlyAdmin {
        electionActive = false;
    }

    event votedEvent (
        uint indexed _candidateId
    );

    function vote(uint _candidateId) public {
        require(msg.sender != admin, "Admin cannot vote");
        
        require(electionActive, "Election is not active");

        require(!voters[msg.sender], "You have already voted");

        require(
            _candidateId > 0 && _candidateId <= candidatesCount,
            "Invalid candidate"
        );

        voters[msg.sender] = true;

        candidates[_candidateId].voteCount++;

        // Trigger voted event
        emit votedEvent(_candidateId);
    }

    function getVotes(uint _candidateId) public view returns(uint) {
        require(!electionActive, "Results available after election ends");
        
        return candidates[_candidateId].voteCount;
    }
}
