Blockchain Setup Guide (Student 1)
Overview

The blockchain component of the project uses Hardhat to develop and test smart contracts written in Solidity.

All blockchain files are located inside the blockchain folder.

1. Required Software

Before starting, install:

Node.js

Git

MetaMask (for interacting with the blockchain)

Check installations:

node -v
npm -v
git --version
2. Clone the Repository
git clone <repo-url>
cd app
3. Switch to Student 1 Branch
git checkout student-1-smart-contracts
4. Install Dependencies

Navigate to the blockchain folder:

cd blockchain
npm install
5. Compile the Smart Contract

Run:

npx hardhat compile

Expected output:

Compiled 1 Solidity file successfully
Issues Encountered During Setup
Issue 1 — Hardhat 3 Incompatibility

Initial installation used the latest version of Hardhat, which caused errors related to ESM modules and Node compatibility.

Example error:

Hardhat only supports ESM projects
Solution

Downgraded Hardhat to version 2.22.3:

npm uninstall hardhat
npm install --save-dev hardhat@2.22.3
Issue 2 — Hardhat Toolbox Version Conflict

The latest toolbox package only supports Hardhat 3.

Example error:

latest version of hardhat-toolbox does not work with Hardhat 2
Solution

Installed the Hardhat 2 compatible toolbox:

npm uninstall @nomicfoundation/hardhat-toolbox
npm install --save-dev @nomicfoundation/hardhat-toolbox@hh2
Final Working Setup

The blockchain environment now includes:

Hardhat

Solidity

Hardhat Toolbox for testing and deployment

Smart contracts are located in:

blockchain/contracts
Running a Local Blockchain

To start a local blockchain network:

npx hardhat node

This creates a local Ethereum test network with several test accounts.

Compiling Contracts
npx hardhat compile
Project Structure
app/
   blockchain/
      contracts/
         DocumentVerification.sol
      test/
      hardhat.config.js
      package.json