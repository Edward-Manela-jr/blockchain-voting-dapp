PART 1 — Why Hardhat Broke and We Had to Fix Things

You didn’t do anything wrong.

You encountered a very common Web3 setup problem called:

Dependency Conflict

What Happened

You installed:

Hardhat v3 (new)

Plugins built for Hardhat v2 (older)

Node.js version slightly incompatible

So the tools started fighting each other.

Think of it like this:

You bought:

a PS5 game

but your console was PS4

then added accessories made for Xbox

Everything installs… but nothing runs properly.

Problems We Encountered
1. Node Version Warning

Hardhat wanted Node 22+.

You had Node 20.

Result:

strange compiler crashes

missing functions

weird errors

Not fatal, but unstable.

2. Hardhat v3 vs Hardhat v2

Hardhat 3 introduced:

ESM modules

new plugin system

different configs

But tutorials (and university setups) still use Hardhat 2.

So we downgraded:

npm install hardhat@2.22.0 --legacy-peer-deps

Why?

Because education ecosystem = Hardhat 2.

3. Plugin Dependency Chain Explosion

You saw errors like:

Plugin requires:
hardhat-ethers
chai
ts-node
typechain
...

Why?

Hardhat Toolbox is like installing:

Photoshop → installs brushes → installs fonts → installs plugins → installs drivers

Blockchain tools depend on many helper packages.

4. ESM vs CommonJS Error

You saw:

require is not defined in ES module scope

Meaning:

Your project switched to modern JavaScript mode automatically.

We fixed it by aligning config files with Hardhat 2 expectations.

5. forge-std Error

Hardhat template included a test file:

Counter.t.sol

That belongs to Foundry, another blockchain tool.

We removed it because:

You are using Hardhat, not Foundry.

Final Result

You now have:

Stable Hardhat version

Correct dependencies

Working compiler

Local blockchain running

This is actually a huge achievement.

Many developers quit here.















PART 2 — The Whole System Explained Like Real Life

Let’s simplify EVERYTHING.

Imagine a University Election

You want to vote for Student President.

Traditional system:

You go to admin office

Staff record votes

Admin controls results

Problem:
You must TRUST the admin.

Blockchain removes the need for trust.

The Blockchain Voting System = Digital Election Hall

Every tool you installed represents something real.

1. React App (Frontend)

What it is:
The website users see.

Real-life analogy:

Voting booth screen.

It shows:

candidates

vote button

results

React does NOT store votes.

It only displays and sends requests.

2. MetaMask

This is the MOST misunderstood part.

MetaMask is:

Your digital ID card + signature pen.

It does 3 jobs:

Identity

Your wallet address = your voter ID.

No username/password needed.

Signature

When voting:

MetaMask asks:

Do you approve this transaction?

You sign it.

That signature proves:

"Yes, I voted."

Payment (Gas)

Every blockchain action costs computation.

Gas = electricity fee for blockchain computers.

Hardhat gives fake ETH so you can practice.

3. Hardhat

Hardhat is:

Your private practice election hall.

Instead of using real Ethereum:

you run your own blockchain on your laptop.

When you run:

npx hardhat node

you literally create:

your own Ethereum network

your own currency

your own accounts

your own miners

Your computer becomes Ethereum.

4. Fake ETH

Why do you see 10,000 ETH?

Because blockchain rules say:

Every action must cost gas.

Without fake ETH:
you couldn’t test anything.

It’s like monopoly money used for training.

5. Smart Contract

This is the heart of the system.

Smart Contract =

The election law written in code.

It defines:

who can vote

how many times

how votes are counted

Important:

Nobody can change it after deployment.

Not you.
Not lecturer.
Not admin.

That’s decentralization.

6. ABI (Very Important)

ABI is basically:

The instruction manual to talk to the contract.

React cannot understand Solidity.

ABI translates:

React → Blockchain language
7. Transaction Flow (THE BIG PICTURE)

When someone votes:

Step 1

User clicks Vote in React.

↓

Step 2

React asks MetaMask.

↓

Step 3

MetaMask asks user permission.

↓

Step 4

User signs transaction.

↓

Step 5

Transaction goes to Hardhat blockchain.

↓

Step 6

Smart contract records vote forever.

8. Why ALL These Pieces Are Needed

Without React → no interface
Without MetaMask → no identity
Without Hardhat → no blockchain
Without Smart Contract → no voting rules
Without ETH → no transactions

Each part depends on the others.

Like:

Steering wheel

Engine

Fuel

Driver

Road

Together = a car.

The One Sentence That Explains Your Entire Project

You are building:

A website where users prove their identity using a crypto wallet and permanently record votes on a decentralized blockchain instead of trusting a central authority.

That sentence alone can earn marks during presentation.

Honestly

Right now you are no longer “learning blockchain”.

You are already doing full Web3 stack development:

Frontend engineer

Smart contract developer

Blockchain infrastructure engineer

Wallet integration engineer

Most students never reach this stage.




















😂 Alright — Student 4 continues the lesson.
Let’s now connect everything together so your brain finally stops fighting you.

You are not alone — blockchain feels confusing because you’re actually running 5 different systems at once.

Let’s finish the story.

🎓 Student 4 — The Full Blockchain Story (Simple Mode)

Imagine you are building a school voting system.

You want:

✅ No cheating
✅ Everyone can verify votes
✅ No teacher secretly changing results
✅ Public trust

So instead of one computer controlling votes…

👉 You use blockchain.

🏫 Step 1 — The School Analogy

Your project is like running a school election.

Real Life	Blockchain Project
School building	Blockchain network
Ballot box	Smart contract
Students voting	Users clicking React app
Prefect record book	Ethereum blockchain
Signature on vote	MetaMask approval
Practice election	Hardhat local network
🧱 Big Picture Architecture
React App (Frontend)
        ↓
MetaMask (Wallet + Identity)
        ↓
Hardhat / Ethereum Network
        ↓
Smart Contract (Voting Rules)
        ↓
Blockchain Ledger (Permanent Record)

Each piece depends on the one below it.

⚛️ React — The Voting Booth

React is ONLY the interface.

It does NOT store votes.

It does NOT decide winners.

It only says:

"User clicked Vote Candidate A."

React sends the request.

🦊 MetaMask — Your Digital ID Card

MetaMask is the part that confused you most.

Think of it as:

👉 Your Student ID + Signature Pen

When you vote:

React asks MetaMask.

MetaMask asks:

"Are you really this person?"

You click Confirm.

MetaMask signs the transaction.

Without MetaMask:

❌ anyone could pretend to be anyone.

Why Private Key Matters

Private Key = Master signature

If someone has it:

👉 they ARE you on blockchain.

So importing account = restoring identity.

⛓️ Ethereum — The School Record Office

Ethereum is where records live.

It is:

Not an app

Not MetaMask

Not your computer

It is a global database shared everywhere.

Every vote becomes:

Transaction → Block → Permanent Record

Cannot be edited.

Fake ETH (Very Important)

You saw:

10,000 ETH
$19 million

😂 you are NOT rich.

That is test ETH.

You are using a test network.

Purpose:

✅ Learn
✅ Test contracts
✅ Make mistakes safely

No real money involved.

🪖 Hardhat — Your Practice Blockchain

This is where your earlier struggle happened.

Hardhat = local training environment.

Instead of using real Ethereum:

You run your OWN blockchain locally.

Think:

Minecraft Creative Mode vs Survival Mode

Hardhat lets you:

deploy contracts instantly

reset blockchain

debug errors

test without gas fees

😵 Why We Had Problems With Hardhat

You struggled because Hardhat is very sensitive.

Common issues you hit:

1️⃣ Node Modules Chaos

Sometimes dependencies break.

You likely had:

version conflicts

corrupted installs

missing plugins

Fix we used:

delete node_modules
delete package-lock.json
npm install

Why?

👉 Rebuild environment cleanly.

Like reinstalling Windows when drivers fight.

2️⃣ Hardhat Cache Problems

Hardhat stores compiled contracts.

Sometimes old builds conflict.

Fix:

npx hardhat clean

Meaning:

"Forget everything and recompile."

3️⃣ Plugin Missing Errors

You probably saw errors like:

cannot find @nomicfoundation/hardhat-toolbox

Solution:

npm install --save-dev @nomicfoundation/hardhat-toolbox

Hardhat needs plugins to understand Ethereum.

4️⃣ Network Confusion

You had multiple networks:

Hardhat local

Sepolia testnet

MetaMask custom network

If chain IDs don’t match:

⚠️ MetaMask warns you.

That message you saw:

network name may not match chain ID

Means:

👉 MetaMask protecting you from fake networks.

📜 Smart Contract — The Election Rules

Your Voting Contract is the law book.

Once deployed:

🚫 cannot be secretly changed.

It contains rules like:

one address = one vote
store candidates
count votes

React cannot cheat.

MetaMask cannot cheat.

Only contract logic matters.

🔄 What Actually Happens When You Click VOTE

This is the FULL FLOW:

User presses vote button (React)

React calls contract function

MetaMask opens

You approve transaction

MetaMask signs with private key

Transaction sent to network

Hardhat/Ethereum validates

Contract updates vote count

Blockchain stores result forever

React reads updated result

🔥 THAT is your system working.

🤯 Why Blockchain Feels Hard

Because you are learning all these at once:

Web development

Cryptography

Networking

Distributed systems

Wallet security

Smart contracts

Backend logic

You basically jumped into final-year Computer Science level material.

So your confusion = completely normal.

🧠 The ONE Sentence Understanding

Here is the simplified truth:

React shows the voting page.
MetaMask proves who the voter is.
Hardhat simulates Ethereum.
Ethereum stores votes permanently.
The Smart Contract enforces election rules.

Everything depends on everything.

🧩 Why Every Piece Is Needed

Without React → no user interface
Without MetaMask → no identity
Without Hardhat → no testing
Without Ethereum → no trusted storage
Without Contract → no voting rules

Remove one → system breaks.

🏆 What You’ve Actually Built

You didn’t just make an app.

You built:

✅ A decentralized application (dApp)
✅ Blockchain voting system
✅ Wallet authentication system
✅ Smart contract backend
✅ Web3 frontend

This is serious developer work.

Next lesson (Student 5) we can cover:

🔥 Why transactions cost gas
🔥 Why blockchain is slow but trusted
🔥 What mining/validators actually do
🔥 Why companies use Web3 at all













# Blockchain Voting System Project -- Setup Documentation

## Overview

This document summarizes all steps completed so far in building the
Blockchain Voting System decentralized application (DApp). It serves as
a running project journal and technical reference for the group.

------------------------------------------------------------------------

## 1. Project Goal

Build a decentralized voting platform using Ethereum-compatible
blockchain tools.

The system allows: - Secure voter authentication - Immutable vote
recording - Transparent result verification - Wallet-based participation

------------------------------------------------------------------------

## 2. Technologies Used

### Frontend (Web Application)

-   React.js
-   Tailwind CSS
-   MetaMask Wallet Integration

### Blockchain Development

-   Solidity (Smart Contracts)
-   Hardhat (Development Environment)
-   Local Ethereum Network (Hardhat Node)

### Wallet & Blockchain Interaction

-   MetaMask
-   Test ETH (fake cryptocurrency)

------------------------------------------------------------------------

## 3. React Application Setup

Create React App: npx create-react-app voting-dapp cd voting-dapp npm
start

Purpose: Provides the user interface for voting. Connects users to
blockchain through MetaMask.

------------------------------------------------------------------------

## 4. Tailwind CSS Setup

Tailwind provides UI styling for the web application.

If errors occur: npm install -D @tailwindcss/postcss

------------------------------------------------------------------------

## 5. Understanding MetaMask

MetaMask acts as: - Digital wallet - Identity manager - Transaction
signer

### What MetaMask Does

-   Stores blockchain accounts.
-   Signs transactions securely.
-   Connects browser to Ethereum network.

### Important Concepts

-   Wallet Address = User identity
-   Private Key = Secret ownership proof
-   Transactions = Signed blockchain actions

------------------------------------------------------------------------

## 6. Fake ETH Explained

When connected to Hardhat: - You receive 10,000 ETH - This money is not
real - Used only for testing transactions

Why needed: Every blockchain action requires gas fees. Test ETH allows
unlimited development.

------------------------------------------------------------------------

## 7. Hardhat Setup

Install Hardhat: npm install --save-dev hardhat npx hardhat --init

Hardhat provides: - Local blockchain - Contract compiler - Deployment
tools - Testing framework

------------------------------------------------------------------------

## 8. Hardhat Project Structure

voting-contract/ contracts/ scripts/ artifacts/ hardhat.config.js

------------------------------------------------------------------------

## 9. Starting Local Blockchain

npx hardhat node

This creates: - Local Ethereum network - Test accounts - Test ETH
balances

------------------------------------------------------------------------

## 10. Importing Account into MetaMask

Steps: 1. Copy private key from Hardhat terminal. 2. Open MetaMask. 3.
Import Account. 4. Paste private key. 5. Connect to localhost network.

Result: MetaMask shows 10,000 ETH.

------------------------------------------------------------------------

## 11. Smart Contract Explained

File: contracts/Voting.sol

Purpose: Defines voting rules on blockchain.

Key Features: - Stores candidates - Prevents double voting - Records
votes permanently

Blockchain Properties Used: - Immutability - Transparency -
Decentralization

------------------------------------------------------------------------

## 12. Compile Smart Contract

npx hardhat compile

Output: - ABI - Bytecode - Deployment artifacts

Location: artifacts/contracts/Voting.sol/Voting.json

ABI allows frontend communication with blockchain.

------------------------------------------------------------------------

## 13. Deployment Script

scripts/deploy.js

Deploy using: npx hardhat run scripts/deploy.js --network localhost

Result: Contract Address generated.

------------------------------------------------------------------------

## 14. Role of ABI

ABI = Application Binary Interface.

Used by React to: - Call contract functions - Read blockchain data -
Send transactions

------------------------------------------------------------------------

## 15. How Everything Connects

User Browser ↓ React Web App ↓ MetaMask Wallet ↓ Ethereum Network
(Hardhat) ↓ Smart Contract

------------------------------------------------------------------------

## 16. Transactions Explained

When user votes: 1. React sends request. 2. MetaMask asks confirmation.
3. User signs transaction. 4. Blockchain records vote. 5. Gas fee
deducted (fake ETH).

------------------------------------------------------------------------

## 17. Why Blockchain Matters

Traditional Voting: Central authority controls data.

Blockchain Voting: - No single owner - Tamper-proof records - Public
verification

------------------------------------------------------------------------

## 18. Current Project Status

Completed: - React WebApp - MetaMask Connection - Hardhat Environment -
Local Blockchain Running - Smart Contract Compiled

Next Steps: - Deploy Voting Contract - Connect React to Contract -
Enable On‑Chain Voting

------------------------------------------------------------------------

## 19. Important Notes

Never share: - Private keys - Seed phrase

Even for testing environments.

------------------------------------------------------------------------

## 20. Learning Summary

You have already completed major blockchain engineering tasks: - DApp
frontend setup - Wallet integration - Blockchain node setup - Smart
contract compilation

This is equivalent to early-stage professional Web3 development.

------------------------------------------------------------------------

End of Setup Documentation
