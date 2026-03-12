# Student 3: Blockchain Infrastructure

## Your Role
You are the **DevOps/Infrastructure Engineer**. You handle blockchain network setup, deployment pipelines, and system architecture.

## Your Workspace
```bash
cd voting-contract/
# Focus on deployment and infrastructure
```

## Your Responsibilities
- ✅ **Blockchain Network Setup** (Local/testnet configuration)
- ✅ **Deployment Automation** (CI/CD pipelines)
- ✅ **Network Security** (Access control, monitoring)
- ✅ **Environment Management** (Testnet vs mainnet)
- ✅ **Performance Monitoring** (Gas usage, block times)

## Your Files & Tools
```
voting-contract/
├── hardhat.config.js        # Network configuration
├── scripts/
│   ├── deploy.js           # Deployment script
│   └── upgrade.js          # Contract upgrade script
├── .github/
│   └── workflows/         # CI/CD pipelines
├── docker/                # Container configurations
└── package.json             # Dev dependencies
```

## Daily Workflow
1. **Configure Networks**: Set up testnet/mainnet environments
2. **Deploy Contracts**: Automated deployment scripts
3. **Monitor Performance**: Track gas usage and errors
4. **Manage Environments**: Handle multiple blockchain networks
5. **Security Audits**: Review access and permissions

## Key Concepts to Master
- **Hardhat Networks**: Local, testnet, mainnet setup
- **CI/CD Pipelines**: GitHub Actions automation
- **Docker Containers**: Reproducible environments
- **Network Security**: Private keys, access control
- **Gas Optimization**: Reduce transaction costs

## Common Commands
```bash
# Deploy to specific network
npx hardhat run scripts/deploy.js --network goerli
npx hardhat run scripts/deploy.js --network mainnet

# Start local node
npx hardhat node

# Verify contract on Etherscan
npx hardhat verify --network mainnet CONTRACT_ADDRESS

# Run tests on specific network
npx hardhat test --network hardhat
```

## Network Configuration
```javascript
// hardhat.config.js example
module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    mainnet: {
      url: process.env.MAINNET_URL,
      accounts: [process.env.MAINNET_PRIVATE_KEY]
    }
  }
};
```

## Deployment Pipeline
1. **Development**: Local Hardhat network
2. **Testing**: Goerli testnet deployment
3. **Staging**: Sepolia testnet validation
4. **Production**: Ethereum mainnet deployment

## Environment Variables
```bash
# .env file (NEVER commit this)
PRIVATE_KEY=your_private_key_here
GOERLI_URL=https://goerli.infura.io/v3/your_project_id
MAINNET_URL=https://mainnet.infura.io/v3/your_project_id
ETHERSCAN_API_KEY=your_etherscan_key
```

## Monitoring & Security
- **Gas Usage**: Track transaction costs
- **Block Times**: Monitor network performance
- **Access Logs**: Who deployed what when
- **Error Tracking**: Failed transactions and reasons
- **Security Audits**: Regular permission reviews

## Collaboration
- **You provide**: Stable deployment environment
- **Student 1 uses**: Your deployment scripts
- **Student 2 connects**: To contracts you deploy
- **Team relies**: On your infrastructure stability

## Success Metrics
- ✅ Contracts deploy reliably to all networks
- ✅ CI/CD pipelines run smoothly
- ✅ Monitoring catches issues early
- ✅ Security practices are followed
- ✅ Gas costs are optimized

## Important Notes
- **Never commit private keys** to version control
- **Use environment variables** for secrets
- **Test thoroughly** on testnets before mainnet
- **Monitor gas prices** for cost optimization
- **Keep backups** of critical configurations

## Troubleshooting
- **Deployment fails**: Check network configuration
- **High gas fees**: Optimize contract or wait for lower prices
- **Network issues**: Verify RPC endpoints are working
- **Permission denied**: Check API keys and access rights
