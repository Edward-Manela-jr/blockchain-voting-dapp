# Voting DApp Testing Guide

## 🧪 Testing Instructions

### Prerequisites
- Hardhat node running: `npx hardhat node`
- MetaMask installed and unlocked
- Localhost network configured in MetaMask

### Step 1: Deploy Contract
```bash
cd blockchain
npx hardhat run scripts/deployVoting.js --network localhost
```

### Step 2: Initialize Election
```bash
cd blockchain
npx hardhat run scripts/initElection.js --network localhost
```
and copy the contract address that is displayed in the console. and paste it in the contracts.js file in the voting-dapp/src/blockchain/ directory.

### Step 3: Start Frontend
```bash
cd voting-dapp
npm start
```

### Step 4: Test Voting Flow
1. Connect admin wallet
2. Add candidates via admin panel
3. Start election
4. Switch to voter wallet
5. Cast vote
6. Check results
7. End election

## 🔒 Security Features Tested

- ✅ Admin cannot vote
- ✅ Candidates locked after election starts
- ✅ Results hidden until election ends
- ✅ One vote per wallet
- ✅ Empty election prevention

## 🎯 Expected Results

- MetaMask transaction popups for all actions
- Real-time vote count updates
- Clear error messages for invalid actions
- Immutable vote storage on blockchain

---
*Generated for testing and demonstration purposes*
