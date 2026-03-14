import { ethers } from "ethers";

/**
 * CONTRACT CONFIGURATION
 * This file acts as the bridge between the React frontend and the deployed Smart Contract.
 */

// The address where the DocumentVerification contract is deployed on the local blockchain
export const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

// The Application Binary Interface (ABI) tells Ethers.js how to talk to the contract functions
export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_hash",
        "type": "string"
      }
    ],
    "name": "registerDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_hash",
        "type": "string"
      }
    ],
    "name": "verifyDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_hash",
        "type": "string"
      }
    ],
    "name": "getDocument",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "verified",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "hash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "DocumentRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "hash",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      }
    ],
    "name": "DocumentVerified",
    "type": "event"
  }
];

/**
 * getContract
 * Purpose: Initializes the Ethers.js provider and signer to interact with the blockchain.
 * Relation: Used by App.js to get a 'contract instance' before calling register/verify/getDocument.
 */
export const getContract = async () => {

  if (!window.ethereum) {
    alert("MetaMask not installed");
    return null;
  }

  // Connect to MetaMask as the provider
  const provider = new ethers.BrowserProvider(window.ethereum);

  // Get the connected wallet user (signer) to sign transactions
  const signer = await provider.getSigner();

  // Create the contract instance with address, ABI, and signer
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );

  return contract;
};