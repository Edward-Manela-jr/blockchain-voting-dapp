const hre = require("hardhat");

async function main() {
  console.log("Checking contract state...");
  
  const contract = await hre.ethers.getContractAt("Voting", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
  
  console.log("Candidates Count:", await contract.candidatesCount());
  
  for(let i=1; i<=5; i++) {
    try {
      const candidate = await contract.candidates(i);
      console.log(`Candidate ${i}: ${candidate.name} - ${candidate.voteCount} votes`);
    } catch(err) {
      console.log(`Candidate ${i}: Not found`);
    }
  }
  
  console.log("Election Active:", await contract.electionActive());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
