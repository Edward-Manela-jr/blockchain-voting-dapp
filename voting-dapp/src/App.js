import { useState, useEffect } from "react";
import { getContract } from "./blockchain/contract";

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
      const voted = await contract.voters(account);
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
      
      // Get candidatesCount first to know how many candidates exist
      const candidatesCount = await contract.candidatesCount();
      
      for (let i = 1; i <= candidatesCount; i++) {
        const candidateData = await contract.candidates(i);
        const voteNum = parseInt(candidateData.voteCount.toString());
        counts[candidateData.name] = voteNum;
        total += voteNum;
        
        if (voteNum > maxVotes) {
          maxVotes = voteNum;
          leader = candidateData.name;
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

  // ================================
  // START ELECTION FUNCTION
  // ================================
  const startElection = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.startElection();
      await tx.wait();
      alert("✅ Election started!");
    } catch (err) {
      console.error("Failed to start election:", err);
      alert("Failed to start election: " + err.message);
    }
  };

  // ================================
  // ADD CANDIDATE FUNCTION
  // ================================
  const addCandidate = async (name) => {
    try {
      const contract = await getContract();
      const tx = await contract.addCandidate(name);
      await tx.wait();
      alert("Candidate added: " + name);
    } catch (err) {
      console.error("Failed to add candidate:", err);
      alert("Failed to add candidate: " + err.message);
    }
  };


  // ================================
  // END ELECTION FUNCTION
  // ================================
  const endElection = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.endElection();
      await tx.wait();
      alert("🛑 Election ended!");
    } catch (err) {
      console.error("Failed to end election:", err);
      alert("Failed to end election: " + err.message);
    }
  };

  // =============================
  // GET VOTES FUNCTION
  // =============================
  const getVotes = async (candidateId) => {
    try {
      const contract = await getContract();
      const votes = await contract.getVotes(candidateId);
      console.log("Votes:", votes.toString());
      alert(`Candidate ${candidateId} has ${votes.toString()} votes`);
    } catch (err) {
      console.error("Failed to get votes:", err);
      alert("Failed to get votes: " + err.message);
    }
  };

  // =============================
  // VOTE FUNCTION
  // =============================
  const vote = async (candidateId) => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    if (hasVoted) {
      alert("You have already voted!");
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.vote(candidateId);
      await tx.wait();
      alert("Vote recorded!");
      loadVoteCounts();
      setHasVoted(true);
    } catch (err) {
      console.error("Voting failed:", err);
      if (err.message.includes("already voted")) {
        alert("You have already voted!");
        setHasVoted(true);
      } else if (err.message.includes("Election is not active")) {
        alert("Election is not active!");
      } else {
        alert("Failed to cast vote. See console for details.");
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

      {/* ADMIN PANEL */}
      {account && (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">👑 Admin Panel</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={startElection}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              🚀 Start Election
            </button>
            <button 
              onClick={endElection}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              🛑 End Election
            </button>
            <button 
              onClick={() => addCandidate("Edward")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              Add Edward
            </button>
            <button 
              onClick={() => addCandidate("Silina")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              Add Silina
            </button>
            <button 
              onClick={() => addCandidate("Marvieous")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              Add Marvieous
            </button>
            <button 
              onClick={() => addCandidate("Kachilenga")}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              Add Kachilenga
            </button>
          </div>
          <p className="text-center text-sm text-gray-400 mt-3">
            ⚠️ Only the admin wallet can add candidates
          </p>
        </div>
      )}

      {/* VOTING SECTION */}
      {account && (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">🗳 Cast Your Vote</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => vote(1)}
              disabled={!account || hasVoted}
              className={`py-3 rounded-lg font-semibold transition ${
                account && !hasVoted
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Vote for Candidate 1
            </button>
            <button 
              onClick={() => vote(2)}
              disabled={!account || hasVoted}
              className={`py-3 rounded-lg font-semibold transition ${
                account && !hasVoted
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Vote for Candidate 2
            </button>
            <button 
              onClick={() => vote(3)}
              disabled={!account || hasVoted}
              className={`py-3 rounded-lg font-semibold transition ${
                account && !hasVoted
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Vote for Candidate 3
            </button>
            <button 
              onClick={() => vote(4)}
              disabled={!account || hasVoted}
              className={`py-3 rounded-lg font-semibold transition ${
                account && !hasVoted
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Vote for Candidate 4
            </button>
          </div>
          <p className="text-center text-sm text-gray-400 mt-3">
            📝 Click to vote → MetaMask popup → Confirm transaction → Vote recorded
          </p>
          
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold mb-3 text-center">🔍 Check Individual Results</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button 
                onClick={() => getVotes(1)}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg font-medium transition text-white"
              >
                Check Candidate 1
              </button>
              <button 
                onClick={() => getVotes(2)}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg font-medium transition text-white"
              >
                Check Candidate 2
              </button>
              <button 
                onClick={() => getVotes(3)}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg font-medium transition text-white"
              >
                Check Candidate 3
              </button>
              <button 
                onClick={() => getVotes(4)}
                className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-lg font-medium transition text-white"
              >
                Check Candidate 4
              </button>
            </div>
          </div>
        </div>
      )}

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



    </div>
  );
}

export default App;
