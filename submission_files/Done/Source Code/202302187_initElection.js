const fs = require("fs");
const path = require("path");

async function main() {
  // Read the deployed contract address from the frontend config
  const configPath = path.join(__dirname, "../../voting-dapp/src/blockchain/contract.js");
  const configContent = fs.readFileSync(configPath, "utf8");
  const match = configContent.match(/CONTRACT_ADDRESS = "(0x[a-fA-F0-9]+)"/);
  if (!match) {
    console.error("❌ Could not find contract address. Run deployVoting.js first.");
    process.exit(1);
  }
  const contractAddress = match[1];

  const signers = await ethers.getSigners();
  const [admin] = signers;
  const voting = await ethers.getContractAt("Voting", contractAddress);

  console.log("Registering voters at", contractAddress);
  console.log("Admin:", admin.address, "\n");

  // Register 5 voters (Hardhat accounts #1–#5)
  const voters = signers.slice(1, 6);
  for (const voter of voters) {
    await voting.registerVoter(voter.address);
    console.log("  Registered voter:", voter.address);
  }

  console.log("\n✅ 5 voters registered!");
  console.log("   Now use the Admin Panel in the UI to add candidates and start the election.\n");
  console.log("To vote, import a voter's private key into MetaMask:");
  console.log("   (Find them in the 'npx hardhat node' terminal output)");
  console.log("   Then switch MetaMask to that account — the app auto-detects it.\n");
  for (let i = 0; i < voters.length; i++) {
    console.log(`   Voter ${i + 1}: ${voters[i].address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
