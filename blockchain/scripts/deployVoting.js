const hre = require("hardhat");

async function main() {
  console.log("Deploying Voting contract...");

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.waitForDeployment();

  const targetAddress = await voting.getAddress();
  console.log("Voting contract deployed to:", targetAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
