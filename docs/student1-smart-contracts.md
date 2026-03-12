# Student 1: Smart Contracts Developer

## Your Role
You are the **Blockchain Backend Developer**. You handle all smart contract development and deployment.

## Your Workspace
```bash
cd voting-contract/
```

## Your Responsibilities
- ✅ **Write Smart Contracts** (Solidity code)
- ✅ **Deploy to Blockchain** (Hardhat)
- ✅ **Test Contract Functions** (Unit tests)
- ✅ **Handle Voting Logic** (Security, validation)
- ✅ **Manage Contract Upgrades**

## Your Files & Tools
```
voting-contract/
├── contracts/
│   └── Voting.sol          # Main smart contract
├── scripts/
│   └── deploy.js           # Deployment script
├── test/
│   └── Voting.test.js       # Contract tests
├── hardhat.config.js        # Blockchain setup
└── package.json             # Dependencies
```

## Daily Workflow
1. **Start Blockchain**: `npx hardhat node`
2. **Write Code**: Edit `contracts/Voting.sol`
3. **Test Changes**: `npx hardhat test`
4. **Deploy Contract**: `npx hardhat run scripts/deploy.js --network localhost`
5. **Share Address**: Copy contract address for Student 2

## Key Concepts to Master
- **Solidity Programming**: Smart contract language
- **Hardhat**: Development framework
- **Gas Fees**: Transaction costs
- **Contract Security**: Prevent double voting, validation
- **Mapping Data**: `mapping(string => uint)` for vote storage

## Common Commands
```bash
# Start local blockchain
npx hardhat node

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy contract
npx hardhat run scripts/deploy.js --network localhost

# Clean build
npx hardhat clean
```

## Collaboration
- **You push**: Contract changes to GitHub
- **Student 2 pulls**: Updates their UI connection
- **Communicate**: When deploying new contract version

## Success Metrics
- ✅ Contract compiles without errors
- ✅ All tests pass
- ✅ Contract deploys successfully
- ✅ UI can connect and call functions
- ✅ No security vulnerabilities

## Important Notes
- **Never share private keys** or seed phrases
- **Test thoroughly** before deployment
- **Document contract changes** in commit messages
- **Use semantic versioning** for contract updates

## Troubleshooting
- **Contract not found**: Check address in UI matches deployed address
- **Gas too high**: Optimize contract code
- **Transaction fails**: Check function parameters and gas limits
