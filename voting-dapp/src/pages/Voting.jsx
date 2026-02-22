import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../abi/Voting.json";

const contractAddress = "PASTE_DEPLOYED_CONTRACT_ADDRESS";

function Voting() {
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);

  async function loadBlockchain() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const votingContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    setContract(votingContract);

    const count = await votingContract.candidatesCount();

    let list = [];

    for (let i = 1; i <= count; i++) {
      const candidate = await votingContract.candidates(i);
      list.push(candidate);
    }

    setCandidates(list);
  }

  async function vote(id) {
    const tx = await contract.vote(id);
    await tx.wait();
    alert("Vote Cast Successfully!");
    loadBlockchain();
  }

  useEffect(() => {
    loadBlockchain();
  }, []);

  return (
    <div>
      <h2>Vote Now</h2>

      {candidates.map((c, index) => (
        <div key={index}>
          <h3>{c.name}</h3>
          <p>Votes: {Number(c.voteCount)}</p>

          <button onClick={() => vote(c.id)}>
            Vote
          </button>
        </div>
      ))}
    </div>
  );
}

export default Voting;