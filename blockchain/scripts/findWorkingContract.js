const hre = require("hardhat");

async function main() {
  console.log("Checking deployed contracts...");
  
  // Try common addresses that might be deployed
  const addresses = [
    "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Old working address
    "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6", // Deployed earlier  
    "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"  // Another deployment
  ];
  
  for (const addr of addresses) {
    try {
      const Voting = await hre.ethers.getContractFactory("Voting");
      const voting = await hre.ethers.getContractAt("Voting", addr);
      
      console.log(`\n=== Checking ${addr} ===`);
      const candidatesCount = await voting.candidatesCount();
      console.log(`Candidates Count: ${candidatesCount}`);
      
      if (candidatesCount > 0) {
        console.log("✅ CONTRACT HAS DATA - This is working!");
        
        // Check first candidate
        const candidate = await voting.candidates(1);
        console.log(`First candidate: ${candidate.name}`);
      } else {
        console.log("❌ Contract exists but no candidates");
      }
      
    } catch (err) {
      console.log(`❌ ${addr} - Not found or error: ${err.message.substring(0, 50)}...`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
