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

  // Update contractAddress.js
  const addressFile = path.join(frontendDir, "contractAddress.js");
  fs.writeFileSync(
    addressFile,
    `export const VOTING_ADDRESS = "${address}";\n`
  );
  console.log("📝 Updated contractAddress.js");

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

  // Also update src/contract.js if it exists
  const srcContractFile = path.join(frontendDir, "contract.js");
  if (fs.existsSync(srcContractFile)) {
    let content = fs.readFileSync(srcContractFile, "utf8");
    content = content.replace(
      /export const contractAddress =\s*\n?\s*"0x[a-fA-F0-9]+";/,
      `export const contractAddress =\n  "${address}";`
    );
    fs.writeFileSync(srcContractFile, content);
    console.log("📝 Updated src/contract.js");
  }

  console.log("\n🎉 Deploy complete! Frontend config auto-updated.");
  console.log("⚠️  Remember to reset MetaMask: Settings > Advanced > Clear Activity Tab Data");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
