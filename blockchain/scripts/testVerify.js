/**
 * SCRIPT 3: VERIFY DOCUMENT SCRIPT
 * 
 * Purpose: Verifies a previously registered document on the blockchain
 * 
 * This is the THIRD script to run in the workflow.
 * It connects to the same contract and marks the document
 * with hash "HASH123" as verified.
 * 
 * Workflow Position: STEP 3 - VERIFY
 * Prerequisite: Document must be registered first (run testRegister.js)
 * Input: Same contract address from deploy.js output
 * Action: Changes document status to "verified"
 * Next Step: Check the document status with checkDocument.js
 */

const hre = require("hardhat");

async function main() {
  console.log("🔐 Verifying document...");

  // Same contract address from deploy.js output
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  console.log("🔗 Connecting to contract at:", contractAddress);

  // Create contract factory and attach to deployed contract
  const DocumentVerification = await hre.ethers.getContractFactory("DocumentVerification");
  const contract = DocumentVerification.attach(contractAddress);

  // Verify document with hash "HASH123"
  console.log("🔍 Verifying document with hash: HASH123");
  const tx = await contract.verifyDocument("HASH123");

  // Wait for transaction to be mined
  await tx.wait();

  console.log("✅ Document HASH123 verified successfully!");
  console.log("📊 Next: Run checkDocument.js to view updated status");
}

main().catch((error) => {
  console.error("❌ Verification failed:", error);
  process.exitCode = 1;
});