const hre = require("hardhat");

async function main() {
  console.log("Initializing NEW Voting contract...");

  // Get the NEW contract
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await hre.ethers.getContractAt("Voting", "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853");

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

  // Start the election
  console.log("Starting election...");
  await voting.startElection();

  console.log("✅ NEW Election initialized successfully!");
  console.log("Candidates added and election is now active.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
