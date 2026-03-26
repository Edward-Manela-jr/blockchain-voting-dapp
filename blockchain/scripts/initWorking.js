const hre = require("hardhat");

async function main() {
  console.log("Initializing working Voting contract...");

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await hre.ethers.getContractAt("Voting", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

  // Add candidates
  console.log("Adding candidates...");
  await voting.addCandidate("Edward");
  console.log("Added Edward");
  
  await voting.addCandidate("Silina");
  console.log("Added Silina");
  
  await voting.addCandidate("Marvieous");
  console.log("Added Marvieous");
  
  await voting.addCandidate("Kachilenga");
  console.log("Added Kachilenga");

  // Start election
  console.log("Starting election...");
  await voting.startElection();

  console.log("✅ Working Voting system initialized!");
  console.log("Ready to test - no voter registration required");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
