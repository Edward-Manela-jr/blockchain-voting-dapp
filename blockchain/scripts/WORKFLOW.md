# Document Verification Scripts Workflow

## Overview
These 4 scripts demonstrate a complete document verification workflow on the blockchain using smart contracts.

## Script Relationship Diagram
```
deploy.js → testRegister.js → testVerify.js → checkDocument.js
    ↓              ↓              ↓              ↓
  CREATE         REGISTER        VERIFY          READ
```

## Complete Workflow Steps

### Step 1: Deploy Contract (deploy.js)
**Purpose**: Create the smart contract on the blockchain
- Deploys DocumentVerification contract
- Returns contract address
- **Output**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **Cost**: Gas fees for deployment
- **Prerequisite**: Local blockchain running (`npx hardhat node`)

### Step 2: Register Document (testRegister.js)
**Purpose**: Add a new document to the blockchain
- Connects to deployed contract
- Registers document with hash "HASH123"
- Creates initial record (owner, timestamp, verified=false)
- **Cost**: Gas fees for transaction
- **Prerequisite**: Contract deployed (Step 1)

### Step 3: Verify Document (testVerify.js)
**Purpose**: Mark the document as verified
- Connects to same contract
- Changes document status to verified=true
- Updates the document record
- **Cost**: Gas fees for transaction
- **Prerequisite**: Document registered (Step 2)

### Step 4: Check Document (checkDocument.js)
**Purpose**: Read document details from blockchain
- Connects to same contract
- Retrieves current document data
- Shows owner, timestamp, verification status
- **Cost**: FREE (read operations don't cost gas)
- **Prerequisite**: Document exists (Steps 1-2)

## How Scripts Connect

### Shared Elements
All scripts share:
- **Same Contract Address**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **Same Contract Name**: `DocumentVerification`
- **Same Document Hash**: `"HASH123"`

### Data Flow
```
deploy.js: Creates contract
    ↓
testRegister.js: Adds document (owner, timestamp, verified=false)
    ↓
testVerify.js: Updates document (verified=true)
    ↓
checkDocument.js: Reads final state (owner, timestamp, verified=true)
```

## Running the Complete Workflow

### Prerequisites
```bash
# Start local blockchain
npx hardhat node

# Deploy contract first
npx hardhat run scripts/deploy.js --network localhost
```

### Execute in Order
```bash
# 1. Deploy contract (get address)
npx hardhat run scripts/deploy.js --network localhost

# 2. Register document
npx hardhat run scripts/testRegister.js --network localhost

# 3. Verify document
npx hardhat run scripts/testVerify.js --network localhost

# 4. Check document status
npx hardhat run scripts/checkDocument.js --network localhost
```

## Expected Output Sequence

### After Step 1 (deploy.js):
```
🚀 Deploying DocumentVerification contract...
✅ DocumentVerification deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
📝 Copy this address to other scripts!
```

### After Step 2 (testRegister.js):
```
📄 Registering document...
🔗 Connecting to contract at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
📝 Registering document with hash: HASH123
✅ Document HASH123 registered successfully!
🔍 Next: Run checkDocument.js to view details
```

### After Step 3 (testVerify.js):
```
🔐 Verifying document...
🔗 Connecting to contract at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
🔍 Verifying document with hash: HASH123
✅ Document HASH123 verified successfully!
📊 Next: Run checkDocument.js to view updated status
```

### After Step 4 (checkDocument.js):
```
📊 Checking document details...
🔗 Connecting to contract at: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
🔍 Retrieving details for document hash: HASH123

📄 DOCUMENT DETAILS:
===================
👤 Owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
⏰ Timestamp: 3/14/2026, 10:30:00 PM
✅ Verified: YES
📝 Document Hash: HASH123
🔗 Contract Address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

🎉 This document has been verified on the blockchain!
```

## Key Concepts Demonstrated

### Smart Contract Lifecycle
1. **Deployment**: Creating contract on blockchain
2. **State Changes**: Modifying contract data
3. **Data Retrieval**: Reading contract state

### Blockchain Operations
- **Write Operations** (cost gas): deploy, register, verify
- **Read Operations** (free): check document details
- **Transaction Mining**: Waiting for block confirmation

### Data Persistence
- Once deployed, contract exists permanently
- Document records are immutable
- Verification status is permanently stored

## Error Handling
Each script includes error handling that shows:
- Clear error messages with emoji indicators
- Process exit codes for automation
- Helpful context about what went wrong

## Testing Scenarios

### Test 1: Check before registering
```bash
npx hardhat run scripts/checkDocument.js --network localhost
# Expected: Error or empty result (document doesn't exist)
```

### Test 2: Check after registering but before verifying
```bash
npx hardhat run scripts/testRegister.js --network localhost
npx hardhat run scripts/checkDocument.js --network localhost
# Expected: Verified: NO
```

### Test 3: Complete workflow
```bash
# Run all 4 scripts in order
# Expected: Verified: YES
```

## Integration with Frontend

These scripts mirror what a frontend application would do:
1. **Deploy**: One-time setup by administrator
2. **Register**: User uploads document
3. **Verify**: Authority approves document
4. **Check**: Anyone views document status

The same contract calls can be made from a React app using Ethers.js.
