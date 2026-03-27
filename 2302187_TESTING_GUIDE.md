# Voting DApp Testing Guide

## 🧪 Testing Instructions

### Prerequisites
- MetaMask installed and unlocked
- Localhost network configured in MetaMask (Chain ID: 31337, RPC: http://127.0.0.1:8545)

### Step 1: Start Hardhat Node
```bash
cd blockchain
npx hardhat node
```

### Step 2: Deploy Contract
```bash
cd blockchain
npx hardhat run scripts/deployVoting.js --network localhost
```
> ✅ The deploy script **auto-updates** the frontend config — no manual copy-paste needed!

### Step 3: Start Frontend
```bash
cd voting-dapp
npm start
```

### Step 4: Test Voting Flow
1. Connect admin wallet (Account #0 in MetaMask)
2. Add candidates via admin panel
3. Register a voter (copy Account #1's address from MetaMask)
4. Start election
5. **Switch to Account #1 in MetaMask** — the app auto-detects the switch
6. Cast vote
7. Switch back to admin (Account #0)
8. End election
9. Check results

---

## 🔄 Restarting / Re-Testing

When you need to test again from scratch:

1. **Stop** the Hardhat node (Ctrl+C) and the frontend (Ctrl+C)
2. **Restart** the Hardhat node: `npx hardhat node`
3. **Reset MetaMask**: Settings → Advanced → **Clear Activity Tab Data**
   > ⚠️ This is critical! MetaMask caches nonces from the old chain. Without clearing, transactions will fail silently.
4. **Redeploy**: `npx hardhat run scripts/deployVoting.js --network localhost`
5. **Restart** the frontend: `npm start`
6. Follow Step 4 above

---

## 🔒 Security Features Tested

- ✅ Admin panel only visible to admin wallet
- ✅ Admin cannot vote
- ✅ Candidates locked after election starts
- ✅ Results hidden until election ends
- ✅ One vote per wallet
- ✅ Only registered voters can vote
- ✅ Election cannot be ended without being started
- ✅ Account switching auto-detected (no refresh needed)

## 🎯 Expected Results

- MetaMask transaction popups for all actions
- Real-time vote count updates
- Clear error messages for invalid actions
- Immutable vote storage on blockchain
- Admin panel hidden when switching to voter account
- Voting section hidden when on admin account

---
*Generated for testing and demonstration purposes*
