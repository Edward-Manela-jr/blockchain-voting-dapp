import { useState, useEffect } from "react";
import { getContract, sendTx } from "./blockchain/contract";

function App() {
  const [account, setAccount] = useState("");
  const [voteCounts, setVoteCounts] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [leadingCandidate, setLeadingCandidate] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [electionActive, setElectionActive] = useState(false);
  const [candidateNames, setCandidateNames] = useState([]);

  // Listen for MetaMask account changes — no more manual refresh!
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount("");
          setIsAdmin(false);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  // Load contract state when account changes
  useEffect(() => {
    if (account) {
      checkAdminStatus();
      checkVotingStatus();
      loadVoteCounts();
      loadElectionState();
    }
  }, [account]);

  // Auto-refresh results every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (account) {
        loadVoteCounts();
        loadElectionState();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [account]);

  // Check if current wallet is the admin
  const checkAdminStatus = async () => {
    try {
      const contract = await getContract();
      const adminAddress = await contract.admin();
      setIsAdmin(adminAddress.toLowerCase() === account.toLowerCase());
    } catch (err) {
      console.error("Failed to check admin status:", err);
      setIsAdmin(false);
    }
  };

  // Check election active state
  const loadElectionState = async () => {
    try {
      const contract = await getContract();
      const active = await contract.electionActive();
      setElectionActive(active);
    } catch (err) {
      console.error("Failed to load election state:", err);
    }
  };

  // Check if current user has already voted
  const checkVotingStatus = async () => {
    try {
      const contract = await getContract();
      const voted = await contract.voters(account);
      const registered = await contract.registeredVoters(account);
      setHasVoted(voted);
      setIsRegistered(registered);
    } catch (err) {
      console.error("Failed to check voting status:", err);
    }
  };

  // Load vote counts for all candidates from the contract
  const loadVoteCounts = async () => {
    try {
      const contract = await getContract();
      const counts = {};
      let total = 0;
      let leader = "";
      let maxVotes = 0;
      const names = [];

      const candidatesCount = await contract.candidatesCount();

      for (let i = 1; i <= candidatesCount; i++) {
        const candidateData = await contract.candidates(i);
        const name = candidateData.name;
        const voteNum = parseInt(candidateData.voteCount.toString());
        counts[name] = voteNum;
        names.push(name);
        total += voteNum;

        if (voteNum > maxVotes) {
          maxVotes = voteNum;
          leader = name;
        }
      }

      setVoteCounts(counts);
      setCandidateNames(names);
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
      const tx = await sendTx(contract.startElection.bind(contract));
      await tx.wait();
      setElectionActive(true);
      alert("✅ Election started!");
    } catch (err) {
      console.error("Failed to start election:", err);
      if (err.message.includes("No candidates")) {
        alert("❌ Add candidates before starting the election!");
      } else {
        alert("Failed to start election: " + err.message);
      }
    }
  };

  // ================================
  // ADD CANDIDATE FUNCTION
  // ================================
  const addCandidate = async (name) => {
    try {
      const contract = await getContract();
      const tx = await sendTx(contract.addCandidate.bind(contract), name);
      await tx.wait();
      alert("✅ Candidate added: " + name);
      loadVoteCounts(); // Refresh the candidate list
    } catch (err) {
      console.error("Failed to add candidate:", err);
      if (err.message.includes("already exists")) {
        alert("❌ Candidate '" + name + "' already exists!");
      } else if (err.message.includes("election starts")) {
        alert("❌ Cannot add candidates after election has started!");
      } else {
        alert("Failed to add candidate: " + err.message);
      }
    }
  };

  // ================================
  // END ELECTION FUNCTION
  // ================================
  const endElection = async () => {
    try {
      const contract = await getContract();
      const tx = await sendTx(contract.endElection.bind(contract));
      await tx.wait();
      setElectionActive(false);
      loadVoteCounts(); // Final refresh to show results
      alert("🛑 Election ended! Results are now visible.");
    } catch (err) {
      console.error("Failed to end election:", err);
      if (err.message.includes("not active")) {
        alert("❌ Election is not active — nothing to end!");
      } else {
        alert("Failed to end election: " + err.message);
      }
    }
  };

  // ================================
  // REGISTER VOTER FUNCTION
  // ================================
  const registerVoter = async () => {
    if (!voterAddress) return alert("Enter an address");
    try {
      const contract = await getContract();
      const tx = await sendTx(contract.registerVoter.bind(contract), voterAddress.trim());
      await tx.wait();
      alert("✅ Voter registered successfully!");
      setVoterAddress("");
    } catch (err) {
      console.error("Failed to register voter:", err);
      alert("Failed to register voter: " + err.message);
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
      if (err.message.includes("after election ends")) {
        alert("🔒 Results are only available after the election ends!");
      } else {
        alert("Failed to get votes: " + err.message);
      }
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
      const tx = await sendTx(contract.vote.bind(contract), candidateId);
      await tx.wait();
      alert("✅ Vote recorded!");
      loadVoteCounts();
      setHasVoted(true);
    } catch (err) {
      console.error("Voting failed:", err);
      if (err.message.includes("already voted")) {
        alert("You have already voted!");
        setHasVoted(true);
      } else if (err.message.includes("Election is not active")) {
        alert("❌ Election is not active!");
      } else if (err.message.includes("not registered")) {
        alert("❌ You are not registered to vote! Ask the admin to register you.");
      } else if (err.message.includes("Admin cannot vote")) {
        alert("❌ Admin cannot vote!");
      } else {
        alert("Failed to cast vote. See console for details.");
      }
    }
  };

  // =============================
  // CANDIDATE LIST (from contract)
  // =============================
  const displayCandidates = candidateNames.length > 0 ? candidateNames : ["Edward", "Silina", "Marvieous", "Kachilenga"];

  // =============================
  // UI
  // =============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex flex-col items-center p-6">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-2 text-center">
        🗳 Blockchain Voting System
      </h1>

      {/* ELECTION STATUS BADGE */}
      {account && (
        <div className="mb-8 flex items-center gap-3">
          <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
            electionActive 
              ? "bg-green-600 text-white" 
              : "bg-gray-600 text-gray-300"
          }`}>
            {electionActive ? "🟢 Election Active" : "⚪ Election Not Active"}
          </span>
          <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
            isAdmin 
              ? "bg-yellow-600 text-white" 
              : "bg-blue-600 text-white"
          }`}>
            {isAdmin ? "👑 Admin" : "🗳 Voter"}
          </span>
        </div>
      )}

      {/* ADMIN PANEL — Only visible to admin */}
      {account && isAdmin && (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">👑 Admin Panel</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={startElection}
              disabled={electionActive}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                electionActive 
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              🚀 Start Election
            </button>
            <button 
              onClick={endElection}
              disabled={!electionActive}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                !electionActive 
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              🛑 End Election
            </button>
            <button 
              onClick={() => addCandidate("Edward")}
              disabled={electionActive}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                electionActive ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Add Edward
            </button>
            <button 
              onClick={() => addCandidate("Silina")}
              disabled={electionActive}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                electionActive ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Add Silina
            </button>
            <button 
              onClick={() => addCandidate("Marvieous")}
              disabled={electionActive}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                electionActive ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Add Marvieous
            </button>
            <button 
              onClick={() => addCandidate("Kachilenga")}
              disabled={electionActive}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                electionActive ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Add Kachilenga
            </button>
          </div>
          
          <div className="mt-6 flex flex-col items-center gap-3 border-t border-slate-700 pt-6 w-full">
            <h3 className="text-lg font-semibold">Register a Voter</h3>
            <div className="flex gap-2 w-full max-w-md">
              <input 
                type="text" 
                placeholder="Voter Address (0x...)" 
                value={voterAddress}
                onChange={(e) => setVoterAddress(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg text-black"
              />
              <button 
                onClick={registerVoter}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-semibold transition"
              >
                Register
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-4">
            ⚠️ Only the admin wallet can add candidates and register voters
          </p>
        </div>
      )}

      {/* VOTING SECTION — Only for non-admin connected wallets */}
      {account && !isAdmin && (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">🗳 Cast Your Vote</h2>
          
          {!electionActive && (
            <p className="text-center text-yellow-400 mb-4">⏳ Election is not active yet. Please wait for the admin to start it.</p>
          )}
          
          {!isRegistered && (
            <p className="text-center text-red-400 mb-4">❌ You are not registered to vote. Ask the admin to register your address.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayCandidates.map((name, index) => (
              <button 
                key={index}
                onClick={() => vote(index + 1)}
                disabled={!electionActive || hasVoted || !isRegistered}
                className={`py-3 rounded-lg font-semibold transition ${
                  electionActive && !hasVoted && isRegistered
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Vote for {name}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-3">
            📝 Click to vote → MetaMask popup → Confirm transaction → Vote recorded
          </p>
          
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold mb-3 text-center">🔍 Check Individual Results</h3>
            {electionActive && (
              <p className="text-center text-yellow-400 mb-3 text-sm">🔒 Results will be available after the election ends</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {displayCandidates.map((name, index) => (
                <button 
                  key={index}
                  onClick={() => getVotes(index + 1)}
                  disabled={electionActive}
                  className={`px-3 py-2 rounded-lg font-medium transition ${
                    electionActive
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  Check {name}
                </button>
              ))}
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
            <div className="text-3xl font-bold text-green-400">{displayCandidates.length}</div>
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
          {displayCandidates.map((candidate) => {
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
            <p className={`text-sm mb-2 ${isAdmin ? "text-yellow-400" : ""}`}>
              {isAdmin ? "👑 You are the Admin" : ""}
            </p>
            {!isAdmin && (
              isRegistered ? (
                <p className="text-blue-400 text-sm mb-2">✅ Registered to Vote</p>
              ) : (
                <p className="text-red-400 text-sm mb-2">❌ Not Registered (Admin must register you)</p>
              )
            )}
            {hasVoted && (
              <p className="text-yellow-400 text-sm">
                🗳 You have already voted
              </p>
            )}
            <p className="text-xs text-gray-500 mt-3">
              💡 Switch accounts in MetaMask — the app will auto-detect
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
