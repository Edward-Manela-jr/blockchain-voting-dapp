# Voting DApp Testing Guide

## Prerequisites
- MetaMask installed and unlocked
- Localhost network configured in MetaMask (Chain ID: 31337, RPC: http://127.0.0.1:8545)
- Hardhat accounts imported into MetaMask (private keys from `npx hardhat node` output)

## Quick Start

### Step 1: Start Hardhat Node
```bash
cd blockchain
npx hardhat node
```
This starts a local Ethereum node with 20 pre-funded test accounts. Account #0 is the admin (contract deployer). Keep this terminal running.

### Step 2: Deploy Contract
```bash
cd blockchain
npx hardhat run scripts/deployVoting.js --network localhost
```
The deploy script automatically updates the frontend configuration with the new contract address — no manual copy-paste needed.

### Step 3: Register Voters
```bash
cd blockchain
npx hardhat run scripts/initElection.js --network localhost
```
This automatically registers 5 voters (Hardhat accounts #1–#5). The script reads the deployed contract address from the frontend config and prints the registered voter addresses.

### Step 4: Start Frontend
```bash
cd voting-dapp
npm start
```

### Step 5: Test the Full Voting Flow
1. **Connect admin wallet** — Open MetaMask, select Account #0, click "Connect Wallet" in the app
2. **Add candidates** — Use the Admin Panel buttons (e.g. "Add Edward", "Add Silina", etc.)
3. **Start election** — Click "Start Election" in the Admin Panel
4. **Switch to a voter** — In MetaMask, switch to any of the 5 registered accounts (Accounts #1–#5). The app auto-detects the switch.
5. **Cast a vote** — Click the candidate button in the voting section and confirm the MetaMask transaction
6. **Switch to another voter** — Repeat with a different account to verify one-vote-per-wallet enforcement
7. **End election** — Switch back to Account #0 (admin) and click "End Election"
8. **View results** — Results become visible after the election ends

## Restarting / Re-Testing

When you need to test again from scratch:

1. **Stop** the Hardhat node (Ctrl+C) and the frontend (Ctrl+C)
2. **Restart** the Hardhat node: `npx hardhat node`
3. **Reset MetaMask**: Settings → Advanced → **Clear Activity Tab Data**
   > This is critical. MetaMask caches nonces from the old chain. Without clearing, transactions will fail silently.
4. **Redeploy**: `npx hardhat run scripts/deployVoting.js --network localhost`
5. **Register voters**: `npx hardhat run scripts/initElection.js --network localhost`
6. **Restart** the frontend: `npm start`
7. Follow Step 5 above

## Running Automated Tests

### Smart Contract Tests (28 tests)
```bash
cd blockchain
npx hardhat test
```
Covers: deployment, candidate management, election lifecycle, voter registration, voting (all error paths), and result visibility.

### Frontend Tests (4 tests)
```bash
cd voting-dapp
npx react-scripts test --watchAll=false
```
Covers: app title rendering, connect wallet button, admin panel visibility, and live results section.

## Security Features Tested

- Admin panel only visible to admin wallet
- Admin cannot vote
- Candidates locked after election starts
- Duplicate candidate names rejected
- Results hidden until election ends
- One vote per registered wallet
- Only registered voters can vote
- Unregistered addresses are rejected with a clear error
- Election cannot be ended without being started first
- Election cannot be started without candidates
- Non-admin wallets cannot add candidates, register voters, or control the election
- Account switching auto-detected without page refresh

## Expected Results

- MetaMask transaction popups for all state-changing actions
- Real-time vote count updates on the dashboard
- Clear error messages for invalid actions (duplicate votes, unregistered voters, etc.)
- Immutable vote storage on the blockchain
- Admin panel hidden when switching to a voter account
- Voting section hidden when on the admin account
