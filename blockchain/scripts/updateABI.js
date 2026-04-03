const fs = require("fs");
const path = require("path");

async function main() {
  // Read the ABI from the compiled contract
  const artifactPath = path.join(__dirname, "../artifacts/contracts/Voting.sol/Voting.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  
  const abi = artifact.abi;
  
  // Update the frontend contract file with the correct ABI
  const frontendDir = path.join(__dirname, "../../voting-dapp/src/blockchain");
  const contractFile = path.join(frontendDir, "contract.js");
  
  // Read current file
  let content = fs.readFileSync(contractFile, "utf8");
  
  // Find and replace the ABI section
  const abiStart = content.indexOf('export const CONTRACT_ABI = [');
  const abiEnd = content.indexOf('];', abiStart) + 2;
  
  if (abiStart !== -1 && abiEnd !== -1) {
    const newContent = content.substring(0, abiStart) + 
                      `export const CONTRACT_ABI = ${JSON.stringify(abi, null, 2)};` +
                      content.substring(abiEnd);
    
    fs.writeFileSync(contractFile, newContent);
    console.log("✅ ABI updated in frontend contract.js");
  } else {
    console.log("❌ Could not find ABI section in contract.js");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
