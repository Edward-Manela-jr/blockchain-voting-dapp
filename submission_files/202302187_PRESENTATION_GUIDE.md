# Group Presentation Guide: Decentralized Blockchain Voting System

This guide prepares all 4 group members for individual questioning on their assigned roles. Each section includes what to say, which files to reference, and the key concepts the lecturer will likely probe.

---

## Introduction (All Members — 1-2 Minutes)

### The Real-World Problem: The "Black Box"

In a traditional election (paper or website), the process is a **Black Box**:

- You cast your vote.
- It goes into a "box" (a wooden box or a server database).
- **The Transparency Gap**: You have to blindly trust the people managing the box to:
  - Not throw your vote away.
  - Not change your "A" to a "B".
  - Not add thousands of fake "ghost" votes.
- If you ask for proof, they might show you "Edward voted for Candidate A" — but now your **privacy is gone**. Everyone knows who you voted for.

### The Conflict: Privacy vs. Proof

In the real world, it's almost impossible to have both:
- If it's **private** (secret ballot), you can't verify it was counted correctly.
- If it's **verifiable**, everyone sees your name next to your choice, so you lose privacy.

### How Blockchain Solves It: The "Glass Ballot Box"

Imagine a ballot box made of glass in the middle of a town square.

- **The Mask**: Instead of walking up as "Edward," you wear a Digital Mask (your **Wallet Address**). Everyone sees a masked person drop a vote, but they don't know it's you.
- **The Proof**: Because the box is glass, you can walk up anytime and say: "My mask had `0x230...789` on it. I see that mask inside the box holding a vote for Candidate 1. My vote is safe!"
- **The Trust**: You don't need to trust the "Election Official" because the glass box (the **Blockchain**) is mathematically locked. No one can reach inside and swap the papers.

**Key sentence**: "We use pseudonymity to protect the voter's real-world identity while providing a public cryptographic proof that every vote was recorded exactly according to the open-source rules of the smart contract."

---

## PART 1: Smart Contract Design (Student 1)

**Key File**: `Voting.sol`

### What to Explain

**The Contract Structure:**
- The contract defines an election with: an admin (deployer), candidates (struct with id, name, voteCount), registered voters, and an election lifecycle (Not Started → Active → Ended).
- All data lives permanently on-chain. Once a vote is recorded, nobody — not even the admin — can alter it.

**Key Functions to Walk Through:**
- `addCandidate()` — admin-only, rejects duplicates using `keccak256` hash comparison, blocked after election starts
- `registerVoter()` — admin marks addresses as eligible
- `vote()` — enforces: election active, voter registered, not already voted, not admin, valid candidate ID
- `getVotes()` — reverts during active election to prevent results from influencing voters

**Access Control:**
- "I used an `onlyAdmin` modifier with `require(msg.sender == admin)` to gate all management functions. This is a gas-efficient alternative to importing OpenZeppelin's Ownable contract."

### Gas Optimisation (Student 1 must know this)

**1. Efficient Mappings — O(1) vs O(n):**

Instead of saving voters in an array (`address[] public voterList`), we used:
```solidity
mapping(address => bool) public registeredVoters;
```
- **The inefficient way (O(n))**: With an array, checking if someone is registered means looping through every entry. If there are 1,000,000 voters, the last one pays massive gas.
- **Our way (O(1))**: A mapping is a direct lookup. `registeredVoters[msg.sender]` gets the answer instantly. It costs the same gas for voter #1 as for voter #1,000,000.

**2. Storage vs Memory — The "Whiteboard" vs "Engraving":**

Look at `addCandidate`:
```solidity
function addCandidate(string memory _name) public onlyAdmin {
    require(!electionActive, "...");            // CHECK 1 (Cheap — memory)
    for(uint i = 1; i <= candidatesCount; i++) {
        if(keccak256(bytes(candidates[i].name)) == keccak256(bytes(_name))) {
            revert("Candidate already exists");  // CHECK 2 (Cheap — memory)
        }
    }
    candidatesCount++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0); // STORAGE WRITE (Expensive!)
}
```
- By using `string memory _name`, the name is processed on the cheap "whiteboard" (RAM).
- All validation checks happen first. Only if everything passes do we pay for the expensive "engraving" (storage write) on the last line.
- If the transaction fails (duplicate name), we never pay for the storage write.

**What to say to markers**: "We follow the Check-Effects-Interactions pattern. All validation happens first in cheap memory. We only commit a costly SSTORE operation if every check passes. And voter verification uses constant-time O(1) mappings instead of iterating through arrays."

---

## PART 2: Wallet Integration & Ethers.js (Student 2)

**Key File**: `voting-dapp/src/blockchain/contract.js`

This is the "Engine Room" — it contains the logic that talks to MetaMask and handles actual blockchain transactions.

### How Ethers.js Works (The "Bridge")

Ethers.js is the translator between your React website and the blockchain. Student 2 must explain these 3 parts:

**1. The Provider (The "Window" to the Blockchain):**
```javascript
const provider = new ethers.BrowserProvider(window.ethereum);
```
"We use Ethers.js to create a Provider. This connects our website to MetaMask's browser extension, allowing us to read the current state of the blockchain."

**2. The Signer (The "Digital Signature"):**
```javascript
const signer = await provider.getSigner();
```
"We use Ethers.js to get the Signer. This asks the user's permission — it tells MetaMask: 'This person wants to vote, please let them sign this request with their private key.'"

**3. The Contract Object (The "Remote Control"):**
```javascript
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
```
"We combine the Contract Address, the ABI, and the Signer into a single object. This acts like a remote control that lets our React code call functions like `vote()` or `registerVoter()` as if they were regular JavaScript functions."

### What is the ABI?

ABI = **Application Binary Interface**. Think of it as a restaurant menu:
- The Smart Contract is a Chef who only speaks "EVM Bytecode" (binary).
- The ABI is the Menu — it tells the React app what functions are available, what parameters to provide, and what you'll get back.
- Without the ABI, the React app would be blindly shouting at the blockchain.

**Where it lives**: The full ABI is embedded in `contract.js` as the `CONTRACT_ABI` array.

### The Nonce Fix (Student 2 should also know this)

```javascript
export const sendTx = async (contractMethod, ...args) => {
  const directProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const browserProvider = new ethers.BrowserProvider(window.ethereum);
  const signer = await browserProvider.getSigner();
  const nonce = await directProvider.getTransactionCount(signer.address, "latest");
  return contractMethod(...args, { nonce });
};
```
- **The problem**: MetaMask caches nonces. After restarting the Hardhat node, MetaMask thinks you've sent 10 transactions, but the fresh blockchain expects transaction #1.
- **The fix**: We bypass MetaMask's cache and call the Hardhat node directly to ask: "What is my real transaction count right now?"

**Summary for Student 2**: "I used Ethers.js as a bridge. It takes the user's intent from the UI, asks MetaMask for a cryptographic signature via the Signer, and broadcasts that signed transaction to the Hardhat network to update the Smart Contract state."

---

## PART 3: Infrastructure & Blockchain Tools (Student 3)

**Key Files**: `hardhat.config.js`, `deployVoting.js`, `initElection.js`

### What to Explain

**Why Hardhat over Ganache:**
- Built-in `console.log` in Solidity for contract debugging
- Faster block mining with instant mining mode
- Integrated testing framework with fixtures and snapshot/revert
- Deterministic accounts (same addresses and private keys on every restart)
- Better error messages with human-readable revert reasons

**The Deployment Pipeline:**
- `deployVoting.js` deploys the contract and **automatically patches** the frontend's `CONTRACT_ADDRESS` in `contract.js` — no manual copy-paste.
- `initElection.js` reads the deployed address from the frontend config and **auto-registers 5 voters** from Hardhat's deterministic accounts.

**Challenges Solved:**
- Hardhat v3 vs v2 dependency conflict — had to downgrade because the entire plugin ecosystem targets v2
- ESM vs CommonJS module errors — Hardhat v3 silently switched to ESM, breaking all `require()` calls
- Plugin dependency chain explosion — `hardhat-toolbox` pulling in conflicting sub-dependencies
- Hardhat cache conflicts — stale artifacts causing ABI mismatches after contract changes

**The Testing Infrastructure:**
- 28 automated smart contract tests using Hardhat's test runner with `loadFixture` for isolated snapshots
- 4 frontend tests using Jest and React Testing Library
- All 32 tests pass

**What to say to markers**: "I managed the full Hardhat environment — from resolving v3-to-v2 dependency conflicts, to engineering an automated deployment pipeline that eliminates manual configuration, to building a comprehensive test suite that verifies every contract rule."

---

## PART 4: UI Development & Transparency (Student 4)

**Key File**: `App.js`

### What to Explain

**Role-Based Dynamic UI:**
- When the admin wallet connects, the UI shows the **Admin Panel** (add candidates, register voters, start/end election).
- When a voter wallet connects, the UI shows the **Voting Section** with candidate buttons.
- The admin panel is physically hidden from voters — not just disabled, but not rendered at all.
- **Candidate entry**: preset quick-add buttons for demo names, plus a **custom name** field so admins can add any candidate during the demo without redeploying.

**Visual design:**
- Light theme with indigo accent and bordered cards — readable on screen and on a projector.

**Wallet display:**
- Connected address is **truncated** in the header (e.g. `0x7099…cD78`); **hover** shows the full address for verification.

**Non-blocking feedback:**
- Success and errors use **inline toasts** (top-right, auto-dismiss) instead of blocking `alert()` so flows stay smooth while you present.
- If MetaMask is missing, a simple alert still tells the user to install the extension.

**Live Results Dashboard:**
- Polls the blockchain every 10 seconds using `setInterval`.
- Shows vote bars with percentages, total votes, candidate count, and leading candidate.
- Results are concealed while the election is active (the contract's `getVotes()` reverts).

**Seamless Account Switching:**
```javascript
window.ethereum.on("accountsChanged", handleAccountsChanged);
```
- When the user switches MetaMask accounts, the app auto-detects it and re-fetches all contract state (admin status, registration, vote history).
- No page refresh needed — the UI role switches instantly.

**Verification Without Revelation (Pseudonymity):**
- The blockchain only stores the wallet address, not the voter's real name.
- A voter can verify their own vote by checking the `voters` mapping for their address. If it returns `true`, their vote is in the box.
- They can verify the total by looking at candidate vote counts.
- No one knows who "Edward" voted for — but everyone can see that wallet `0x70997...` voted and the tally is correct.

**What to say to markers**: "I designed the frontend to make the blockchain accessible: role-based panels, a light high-contrast layout, and smooth feedback with toasts instead of pop-up alerts. Admins can add preset or custom candidates; voters see a clean wallet display with full address on hover. The live dashboard gives real-time transparency, and pseudonymous addresses let voters verify their vote without revealing identity."

---

## Conclusion & Reflection (All Members — 1-2 Minutes)

### The Public Audit Trail
- Every vote generates a unique **Transaction Hash** (a digital receipt).
- You can look up any transaction hash on a block explorer to see exactly when the vote was cast and that it was successfully mined into a block.
- This is independent verification — no need to trust the admin.

### Key Reflection
- "We learned that blockchain is more than a database — it's a trust layer that replaces human oversight with mathematical guarantees."
- "The biggest challenge wasn't writing code — it was getting the toolchain to work. Dependency conflicts between Hardhat versions consumed more time than the smart contract itself."

### Future Directions
- **Zero-Knowledge Proofs**: Enable truly private voting where the blockchain verifies a vote is valid without revealing the candidate chosen.
- **DAO Governance**: Expand so voters can propose candidates or change election rules through on-chain majority consensus.
- **Mainnet Deployment**: Move from local Hardhat to a testnet (Sepolia) or Layer 2 (Arbitrum) for real-world conditions.
