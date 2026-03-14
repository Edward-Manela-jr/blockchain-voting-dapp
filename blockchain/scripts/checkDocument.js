/**
 * SCRIPT 4: CHECK DOCUMENT SCRIPT
 * 
 * Purpose: Reads and displays document details from the blockchain
 * 
 * This is the FOURTH and FINAL script in the workflow.
 * It connects to the same contract and retrieves the current
 * status and details of document "HASH123".
 * 
 * Workflow Position: STEP 4 - CHECK/READ
 * Prerequisite: Document should be registered and optionally verified
 * Input: Same contract address from deploy.js output
 * Action: Reads document data (owner, timestamp, verification status)
 * Purpose: Shows the current state of the document on blockchain
 * 
 * This script demonstrates reading data from the blockchain
 * (no transaction fees for read operations)
 */

const hre = require("hardhat");

async function main() {
  console.log("📊 Checking document details...");

  // Same contract address from deploy.js output
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  console.log("🔗 Connecting to contract at:", contractAddress);

  // Create contract factory and attach to deployed contract
  const DocumentVerification = await hre.ethers.getContractFactory("DocumentVerification");
  const contract = DocumentVerification.attach(contractAddress);

  // Get document details for hash "HASH123"
  console.log("🔍 Retrieving details for document hash: HASH123");
  const doc = await contract.getDocument("HASH123");

  // Display document information
  console.log("\n📄 DOCUMENT DETAILS:");
  console.log("===================");
  console.log("👤 Owner:", doc.owner);
  console.log("⏰ Timestamp:", new Date(parseInt(doc.timestamp) * 1000).toLocaleString());
  console.log("✅ Verified:", doc.verified ? "YES" : "NO");
  console.log("📝 Document Hash: HASH123");
  console.log("🔗 Contract Address:", contractAddress);
  
  // Additional context
  if (doc.verified) {
    console.log("\n🎉 This document has been verified on the blockchain!");
  } else {
    console.log("\n⚠️  This document is registered but not yet verified.");
    console.log("💡 Run testVerify.js to verify it.");
  }
}

main().catch((error) => {
  console.error("❌ Failed to check document:", error);
  process.exitCode = 1;
});