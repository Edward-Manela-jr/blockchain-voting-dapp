import { ethers } from "ethers";
import Voting from "./Voting.json";

export const contractAddress =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const getContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    contractAddress,
    Voting.abi,
    signer
  );

  return contract;
};