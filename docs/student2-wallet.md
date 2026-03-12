# Student 2: Wallet Integration Developer

## Your Role
You are the **Blockchain Frontend Developer**. You handle wallet connection and user interaction with smart contracts.

## Your Workspace
```bash
cd voting-dapp/
```

## Your Responsibilities
- ✅ **Wallet Connection** (MetaMask integration)
- ✅ **Contract Interaction** (Call smart contract functions)
- ✅ **User Interface** (Voting buttons, forms)
- ✅ **Transaction Handling** (Gas fees, confirmations)
- ✅ **Error Handling** (User feedback)

## Your Files & Tools
```
voting-dapp/
├── src/
│   ├── App.js               # Main voting interface
│   ├── blockchain/
│   │   └── Voting.js      # Contract connection
│   └── index.css           # Styling
├── public/
│   └── index.html          # HTML template
└── package.json             # Dependencies
```

## Daily Workflow
1. **Get Contract Address**: From Student 1 deployment
2. **Update Connection**: Edit `src/blockchain/Voting.js`
3. **Test Wallet**: Connect MetaMask to your app
4. **Build UI**: Create voting interface
5. **Test Transactions**: Vote and verify blockchain updates

## Key Concepts to Master
- **Ethers.js**: Blockchain interaction library
- **MetaMask API**: Wallet connection methods
- **React State**: useState, useEffect hooks
- **Async/Await**: Handle blockchain calls
- **Transaction Signing**: User approval process

## Common Commands
```bash
# Install dependencies
npm install ethers

# Start development server
npm start

# Build for production
npm run build

# Test wallet connection
# Test in browser with MetaMask
```

## Wallet Integration Steps
1. **Check MetaMask**: Ensure extension is installed
2. **Request Accounts**: `window.ethereum.request({ method: 'eth_requestAccounts' })`
3. **Get Signer**: `provider.getSigner()`
4. **Create Contract**: `new ethers.Contract(address, abi, signer)`
5. **Call Functions**: `contract.vote(candidate)`

## Transaction Handling
```javascript
// Example vote function
const vote = async (candidate) => {
  try {
    const contract = await getContract();
    const tx = await contract.vote(candidate);
    await tx.wait(); // Wait for confirmation
    alert("Vote successful!");
  } catch (err) {
    alert("Vote failed: " + err.message);
  }
};
```

## Collaboration
- **You pull**: Contract address changes from Student 1
- **You push**: UI improvements and bug fixes
- **Test together**: Ensure UI works with latest contract

## Success Metrics
- ✅ Wallet connects successfully
- ✅ Can read contract data (vote counts)
- ✅ Can write transactions (vote)
- ✅ Error handling works
- ✅ UI is responsive and user-friendly

## Important Notes
- **Always verify contract address** before voting
- **Handle transaction failures** gracefully
- **Show clear feedback** for user actions
- **Test with different wallets** if possible
- **Keep ABI updated** with contract changes

## Troubleshooting
- **MetaMask not found**: User needs to install extension
- **Contract not found**: Wrong address or network
- **Transaction failed**: Insufficient gas or rejected
- **No vote counts**: Contract not deployed or wrong network
