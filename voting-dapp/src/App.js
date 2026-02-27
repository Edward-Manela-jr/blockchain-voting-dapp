import { useState, useEffect } from "react";
import { getContract } from "./blockchain/Voting";

function App() {
  const [account, setAccount] = useState("");
  const [voteCounts, setVoteCounts] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [leadingCandidate, setLeadingCandidate] = useState("");

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

  // Auto-refresh results every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (account) {
        loadVoteCounts();
      }
    }, 10000);

    return () => clearInterval(interval);
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
      let total = 0;
      let leader = "";
      let maxVotes = 0;
      
      for (const candidate of candidates) {
        const votes = await contract.getVotes(candidate);
        const voteNum = parseInt(votes.toString());
        counts[candidate] = voteNum;
        total += voteNum;
        
        if (voteNum > maxVotes) {
          maxVotes = voteNum;
          leader = candidate;
        }
      }
      
      setVoteCounts(counts);
      setTotalVotes(total);
      setLeadingCandidate(leader);
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

      {/* LIVE RESULTS DASHBOARD */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">📊 Live Results</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-400">{totalVotes}</div>
            <div className="text-sm text-gray-400">Total Votes</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400">{candidates.length}</div>
            <div className="text-sm text-gray-400">Candidates</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-400">{leadingCandidate || "None"}</div>
            <div className="text-sm text-gray-400">Leading</div>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-400">
              {totalVotes > 0 ? Math.round((voteCounts[leadingCandidate] || 0) / totalVotes * 100) : 0}%
            </div>
            <div className="text-sm text-gray-400">Lead %</div>
          </div>
        </div>

        {/* VOTE BARS */}
        <div className="space-y-3">
          {candidates.map((candidate) => {
            const votes = voteCounts[candidate] || 0;
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            return (
              <div key={candidate} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium">{candidate}</div>
                <div className="flex-1 bg-slate-700 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 10 && (
                      <span className="text-xs font-bold text-white">{votes} votes</span>
                    )}
                  </div>
                </div>
                <div className="w-16 text-right text-sm">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

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