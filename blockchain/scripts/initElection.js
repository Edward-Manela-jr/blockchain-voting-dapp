const hre = require("hardhat");

async function main() {
  console.log("Initializing CLEAN Voting contract...");

  // Get the NEW contract
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await hre.ethers.getContractAt("Voting", "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6");

  // Add candidates with proper names
  console.log("Adding candidates...");
  await voting.addCandidate("Edward");
  console.log("Added Edward");
  
  await voting.addCandidate("Silina");
  console.log("Added Silina");
  
  await voting.addCandidate("Marvieous");
  console.log("Added Marvieous");
  
  await voting.addCandidate("Kachilenga");
  console.log("Added Kachilenga");

  // Start the election
  console.log("Starting election...");
  await voting.startElection();

  console.log("✅ CLEAN Election initialized successfully!");
  console.log("4 unique candidates added and election is now active.");
  console.log("Duplicate protection enabled!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
