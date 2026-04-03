const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  try {
    const Voting = await ethers.getContractFactory("Voting");
    const voting = Voting.attach(contractAddress);
    
    console.log("Testing contract at:", contractAddress);
    
    // Test admin function
    const adminAddress = await voting.admin();
    console.log("✅ Admin address:", adminAddress);
    
    // Test election state
    const electionActive = await voting.electionActive();
    console.log("✅ Election active:", electionActive);
    
    // Test candidates count
    const candidatesCount = await voting.candidatesCount();
    console.log("✅ Candidates count:", candidatesCount.toString());
    
    console.log("🎉 Contract is working correctly!");
    
  } catch (error) {
    console.error("❌ Contract error:", error.message);
    console.error("Full error:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
