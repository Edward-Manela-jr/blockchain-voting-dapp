const hre = require("hardhat");

async function main() {

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const DocumentVerification = await hre.ethers.getContractFactory("DocumentVerification");

  const contract = DocumentVerification.attach(contractAddress);

  const tx = await contract.registerDocument("HASH123");

  await tx.wait();

  console.log("Document registered");
}

main();