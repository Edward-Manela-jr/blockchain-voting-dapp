const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  
  const Voting = await ethers.getContractFactory("Voting");
  const voting = Voting.attach(contractAddress);
  
  const adminAddress = await voting.admin();
  console.log("Contract deployed at:", contractAddress);
  console.log("Admin address:", adminAddress);
  
  // Also show the first few Hardhat accounts for comparison
  const [deployer] = await ethers.getSigners();
  console.log("Deployer (Account 0):", deployer.address);
  
  const accounts = await ethers.provider.listAccounts();
  console.log("\nAvailable Hardhat accounts:");
  accounts.forEach((account, index) => {
    console.log(`Account ${index}: ${account}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
