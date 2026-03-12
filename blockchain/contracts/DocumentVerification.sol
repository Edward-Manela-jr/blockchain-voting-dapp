// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentVerification {

    struct Document {
        string hash;
        address owner;
        uint256 timestamp;
        bool verified;
    }

    mapping(string => Document) public documents;

    event DocumentRegistered(string hash, address owner);
    event DocumentVerified(string hash, address verifier);

    function registerDocument(string memory _hash) public {

        require(documents[_hash].timestamp == 0, "Document already exists");

        documents[_hash] = Document(
            _hash,
            msg.sender,
            block.timestamp,
            false
        );

        emit DocumentRegistered(_hash, msg.sender);
    }

    function verifyDocument(string memory _hash) public {

        require(documents[_hash].timestamp != 0, "Document not found");

        documents[_hash].verified = true;

        emit DocumentVerified(_hash, msg.sender);
    }

    function getDocument(string memory _hash)
        public
        view
        returns (address owner, uint256 timestamp, bool verified)
    {
        Document memory doc = documents[_hash];
        return (doc.owner, doc.timestamp, doc.verified);
    }
}
