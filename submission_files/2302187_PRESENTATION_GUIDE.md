# Group Presentation Guide: 10-Minute Walkthrough

This guide ensures all 4 group members hit their required marks by speaking to their specific technical roles.

---

## 🕒 Introduction (1 Minute) - All Members
- **Problem**: Traditional voting relies on "Black Box" trust.
- **Solution**: A "Glass Ballot Box" using a decentralized Ethereum blockchain.

---

## 🏗️ PART 1: Smart Contract Design (Student 1)
**Focus**: The "Math & Rules" behind the election.
- **Key Files**: `Voting.sol`
- **What to say**: 
    - "I developed the smart contract using Solidity. I chose **Mappings** for the `voters` and `candidates` to ensure fast $O(1)$ lookups and save gas."
    - "Explain the `addCandidate` and `vote` functions."
    - "Mention **Gas Optimization**: We used `memory` variables to process data cheaply before committing to the expensive hidden storage."

---

## 🦊 PART 2: Wallet Integration & Security (Student 2)
**Focus**: Authenticating the user and protecting the election.
- **Key Files**: `App.js`, `contract.js`
- **What to say**: 
    - "I integrated **MetaMask** using Ethers.js. Instead of passwords, we use the user's private key to sign every vote."
    - "Security: We used the `onlyAdmin` modifier so only the authorized address can start/end the election."
    - "We implemented role-based UI gating—the 'Admin Panel' is physically hidden from regular voters for added security."

---

## 🛠️ PART 3: Infrastructure & Blockchain Tools (Student 3)
**Focus**: The development environment and fixing "Impossible" bugs.
- **Key Files**: `hardhat.config.js`, `deployVoting.js`, `contractAddress.js`
- **What to say**: 
    - "I managed the **Hardhat** environment. We chose Hardhat over Ganache because it allows for more advanced debugging and transaction tracing."
    - "**The Challenge**: I solved a critical 'Nonce Desync' issue where MetaMask's cache would fight with the local node. I wrote a custom RPC query to fetch the correct nonce directly from the blockchain."
    - "I automated the deployment so the frontend always has the latest contract address instantly."

---

## 💻 PART 4: UI Development & Transparency (Student 4)
**Focus**: Making the blockchain accessible and verifiable.
- **Key Files**: `App.js` (CSS/UI parts)
- **What to say**: 
    - "I designed the frontend using **React and Tailwind CSS** for a premium, responsive experience."
    - "**Transparency**: We built a Live Results Dashboard that polls the blockchain every 10 seconds. This allows voters to verify the tally in real-time."
    - "**Pseudonymity**: We solved the 'Transparency Gap' by allowing voters to see their masked wallet address in the audit trail without revealing their real-world identity."

---

## 🏁 Conclusion & Reflection (1 Minute) - All Members
- **Reflect**: "We learned that Blockchain is more than just a database—it's a trust layer." 
- **Future**: "This could be expanded into a DAO for decentralized school governance."
