/**
 * SCRIPT 2: REGISTER DOCUMENT SCRIPT
 * 
 * Purpose: Registers a new document on the blockchain
 * 
 * This is the SECOND script to run in the workflow.
 * It connects to an already deployed contract and registers
 * a document with a specific hash ("HASH123").
 * 
 * Workflow Position: STEP 2 - REGISTER
 * Prerequisite: Contract must be deployed first (run deploy.js)
 * Input: Contract address from deploy.js output
 * Action: Creates a document record on blockchain
 * Next Step: Verify the document with testVerify.js
 */

const hre = require("hardhat");

async function main() {
  console.log("📄 Registering document...");

  // Contract address from deploy.js output
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  console.log("🔗 Connecting to contract at:", contractAddress);

  // Create contract factory and attach to deployed contract
  const DocumentVerification = await hre.ethers.getContractFactory("DocumentVerification");
  const contract = DocumentVerification.attach(contractAddress);

  // Register document with hash "HASH123"
  console.log("📝 Registering document with hash: HASH123");
  const tx = await contract.registerDocument("HASH123");

  // Wait for transaction to be mined
  await tx.wait();

  console.log("✅ Document HASH123 registered successfully!");
  console.log("🔍 Next: Run checkDocument.js to view details");
}

main().catch((error) => {
  console.error("❌ Registration failed:", error);
  process.exitCode = 1;
});