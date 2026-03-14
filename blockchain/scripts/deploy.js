// this script is used for

const hre = require("hardhat");

async function main() {

  const DocumentVerification = await hre.ethers.getContractFactory("DocumentVerification");

  const documentVerification = await DocumentVerification.deploy();

  await documentVerification.waitForDeployment();

  console.log("DocumentVerification deployed to:", await documentVerification.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});