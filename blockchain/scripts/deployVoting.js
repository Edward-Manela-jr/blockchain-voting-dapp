const fs = require("fs");
const path = require("path");

async function main() {
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  const address = voting.target;
  console.log("✅ Voting contract deployed to:", address);

  // Auto-update frontend config files with the new contract address
  const frontendDir = path.join(__dirname, "../../voting-dapp/src");

  // Update blockchain/contract.js — replace the CONTRACT_ADDRESS line
  const contractFile = path.join(frontendDir, "blockchain/contract.js");
  if (fs.existsSync(contractFile)) {
    let content = fs.readFileSync(contractFile, "utf8");
    content = content.replace(
      /export const CONTRACT_ADDRESS = "0x[a-fA-F0-9]+";/,
      `export const CONTRACT_ADDRESS = "${address}";`
    );
    fs.writeFileSync(contractFile, content);
    console.log("📝 Updated blockchain/contract.js");
  }

  console.log("\n🎉 Deploy complete! Frontend config auto-updated.");
  console.log("⚠️  Remember to reset MetaMask: Settings > Advanced > Clear Activity Tab Data");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
