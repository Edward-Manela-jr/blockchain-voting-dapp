import { useState, useEffect } from "react";
import { getContract } from "./blockchain/Voting";

function App() {
  const [account, setAccount] = useState("");
  const [voteCounts, setVoteCounts] = useState({});
  const [hasVoted, setHasVoted] = useState(false);

  // Assignment participants (candidates)
  const candidates = [
    "Edward",
    "Silina",
    "Marvieous",
    "Kachilenga"
  ];

  // Load vote counts and voting status when account changes
  useEffect(() => {
    if (account) {
      loadVoteCounts();
      checkVotingStatus();
    }
  }, [account]);

  // Check if current user has already voted
  const checkVotingStatus = async () => {
    try {
      const contract = await getContract();
      const voted = await contract.hasVotedCheck();
      setHasVoted(voted);
    } catch (err) {
      console.error("Failed to check voting status:", err);
    }
  };

  // Load vote counts for all candidates
  const loadVoteCounts = async () => {
    try {
      const contract = await getContract();
      const counts = {};
      
      for (const candidate of candidates) {
        const votes = await contract.getVotes(candidate);
        counts[candidate] = votes.toString();
      }
      
      setVoteCounts(counts);
    } catch (err) {
      console.error("Failed to load vote counts:", err);
    }
  };

  // =============================
  // CONNECT WALLET
  // =============================
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  };

  // =============================
  // VOTE FUNCTION
  // =============================
  const vote = async (candidate) => {
    try {
      const contract = await getContract();

      const tx = await contract.vote(candidate);

      await tx.wait();

      alert(`✅ Vote submitted for ${candidate}`);
      
      // Refresh vote counts and voting status
      await loadVoteCounts();
      await checkVotingStatus();
    } catch (err) {
      console.error(err);
      if (err.message.includes("already voted")) {
        alert("❌ You have already voted!");
      } else {
        alert("❌ Voting failed");
      }
    }
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex flex-col items-center p-6">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10 text-center">
        🗳 Blockchain Voting System
      </h1>

      {/* WALLET CARD */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md text-center mb-10">
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition w-full"
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <p className="text-green-400 mb-2">
              Wallet Connected ✅
            </p>
            <p className="text-sm break-all font-mono mb-2">
              {account}
            </p>
            {hasVoted && (
              <p className="text-yellow-400 text-sm">
                🗳 You have already voted
              </p>
            )}
          </div>
        )}
      </div>

      {/* CANDIDATES GRID */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">

        {candidates.map((candidate) => (
          <div
            key={candidate}
            className="bg-slate-800 p-6 rounded-2xl shadow-xl text-center hover:scale-105 transition"
          >
            <h2 className="text-2xl font-bold mb-4">
              {candidate}
            </h2>

            <div className="text-3xl font-bold text-green-400 mb-4">
              🗳 {voteCounts[candidate] || 0} votes
            </div>

            <button
              onClick={() => vote(candidate)}
              disabled={!account || hasVoted}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                account && !hasVoted
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              {hasVoted ? "Already Voted" : "Vote"}
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default App;