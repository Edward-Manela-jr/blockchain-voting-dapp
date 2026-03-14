/**
 * SCRIPT 1: DEPLOY SCRIPT
 * 
 * Purpose: Deploys the DocumentVerification smart contract to the blockchain
 * 
 * This is the FIRST script to run in the workflow.
 * It creates a new instance of the contract on the blockchain
 * and returns the contract address that other scripts will use.
 * 
 * Workflow Position: STEP 1 - DEPLOY
 * Output: Contract address (e.g., "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512")
 * Next Step: Copy the address to other scripts
 */

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying DocumentVerification contract...");

  // Create a factory for our contract
  const DocumentVerification = await hre.ethers.getContractFactory("DocumentVerification");

  // Deploy the contract to the blockchain
  const documentVerification = await DocumentVerification.deploy();

  // Wait for deployment to complete
  await documentVerification.waitForDeployment();

  // Get and display the contract address
  const contractAddress = await documentVerification.getAddress();
  console.log("✅ DocumentVerification deployed to:", contractAddress);
  console.log("📝 Copy this address to other scripts!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});