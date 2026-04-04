# How Our Voting DApp Works — A Simple Guide

Read this before the presentation. It explains every technology in our project using real-life analogies.

---

## The Big Picture

```
You (Browser)  →  React App  →  MetaMask  →  Hardhat/Ethereum  →  Smart Contract
   "Voter"       "Booth"       "ID Card"      "Town Hall"         "Rule Book"
```

Every piece depends on the others. Remove one and the system breaks.

---

## 1. Solidity / Smart Contract (Voting.sol)

**What it is**: The election rule book, written in code.

**Real-life analogy**: A vending machine. You put in the right input (your vote), and it gives the right output (records your vote). No human is involved — the machine just follows its rules. You can't bribe it, and you can't reach inside to change what already came out.

**In our project**: `Voting.sol` defines who can vote, how many times, when voting opens/closes, and how results are counted. Once deployed, nobody can change these rules — not even us.

---

## 2. Hardhat

**What it is**: A local practice blockchain running on your laptop.

**Real-life analogy**: A flight simulator. Pilots don't learn to fly on a real plane first — they use a simulator where crashes don't matter. Hardhat is our simulator. It creates a fake Ethereum network with fake money so we can test everything safely.

**Key command**: `npx hardhat node` — starts your own personal Ethereum network with 20 pre-funded test accounts.

---

## 3. MetaMask

**What it is**: A browser wallet that proves who you are.

**Real-life analogy**: Your national ID card + a signature pen. When you vote, MetaMask proves your identity (wallet address) and asks you to sign the transaction (confirm in the popup). No usernames, no passwords — just your cryptographic key.

**Why it matters**: Without MetaMask, anyone could pretend to be anyone. MetaMask ensures only YOU can vote from YOUR account.

---

## 4. Ethers.js

**What it is**: A JavaScript library that connects React to the blockchain.

**Real-life analogy**: A translator at the UN. React speaks JavaScript. The blockchain speaks bytecode. Ethers.js sits in the middle and translates between them so they can work together.

**Three things it does**:
- **Provider** — opens a connection to the blockchain (like picking up the phone)
- **Signer** — gets MetaMask to sign your transaction (like stamping a document)
- **Contract** — lets you call smart contract functions from JavaScript (like pressing buttons on the vending machine)

---

## 5. React (The Frontend)

**What it is**: The website the voter sees and clicks on.

**Real-life analogy**: The voting booth screen. It shows candidates, buttons, and results. But it does NOT store any votes — it just sends your choices to the blockchain and displays what comes back.

**In our project**: `App.js` shows an Admin Panel for the admin wallet and a Voting Section for voter wallets. It auto-detects when you switch MetaMask accounts.

---

## 6. ABI (Application Binary Interface)

**What it is**: A JSON file that tells the frontend what functions exist in the smart contract.

**Real-life analogy**: A restaurant menu. The smart contract is the chef in the kitchen — you can't see what's available unless someone gives you a menu. The ABI is that menu. It says: "There's a function called `vote`, it needs a candidate number, and it returns nothing."

---

## 7. Gas

**What it is**: The fee for running code on the blockchain.

**Real-life analogy**: Electricity for a computer. Every calculation costs energy. On Ethereum, you pay "gas" (in ETH) for every operation. More complex operations = more gas. In our local Hardhat network, the ETH is fake so gas is free — but we still optimised the contract to use less gas because it matters on a real network.

---

## 8. Ethereum (The Network)

**What it is**: A global decentralised network of computers that all agree on the same data.

**Real-life analogy**: Imagine 10,000 people all holding the exact same notebook. When one person writes something new, everyone copies it simultaneously. To cheat, you'd have to convince more than half of them to change their notebooks at the same time — practically impossible.

**In our project**: We simulate this locally with Hardhat. On a real Ethereum network, our voting contract would be replicated across thousands of computers worldwide.

---

## How It All Flows When Someone Votes

1. **Voter clicks "Vote for Edward"** in the React app
2. **React asks Ethers.js** to call the `vote()` function
3. **Ethers.js asks MetaMask** to sign the transaction
4. **MetaMask popup appears** — voter clicks Confirm
5. **Signed transaction sent** to the Hardhat node
6. **Smart contract checks**: election active? voter registered? not already voted? valid candidate?
7. **Vote count updated** permanently on-chain
8. **React reads the updated state** and refreshes the dashboard

The entire process takes about 2 seconds on our local network.

---

## One Sentence to Remember

> We built a website where users prove their identity with a crypto wallet and permanently record votes on a decentralised blockchain, instead of trusting a central authority.
