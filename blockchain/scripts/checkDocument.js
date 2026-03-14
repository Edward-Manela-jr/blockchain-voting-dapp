const hre = require("hardhat");

async function main() {

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const DocumentVerification = await hre.ethers.getContractFactory("DocumentVerification");

  const contract = DocumentVerification.attach(contractAddress);

  const doc = await contract.getDocument("HASH123");

  console.log("Owner:", doc.owner);
  console.log("Timestamp:", doc.timestamp.toString());
  console.log("Verified:", doc.verified);
}

main();