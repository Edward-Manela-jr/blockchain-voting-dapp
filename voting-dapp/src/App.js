import { useState, useEffect, useCallback } from "react";
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
  const [newCandidateName, setNewCandidateName] = useState("");
  const [statusMsg, setStatusMsg] = useState(null);

  // Check if current wallet is the admin
  const checkAdminStatus = useCallback(async () => {
    try {
      const contract = await getContract();
      const adminAddress = await contract.admin();
      setIsAdmin(adminAddress.toLowerCase() === account.toLowerCase());
    } catch (err) {
      console.error("Failed to check admin status:", err);
      setIsAdmin(false);
    }
  }, [account]);

  // Check election active state
  const loadElectionState = useCallback(async () => {
    try {
      const contract = await getContract();
      const active = await contract.electionActive();
      setElectionActive(active);
    } catch (err) {
      console.error("Failed to load election state:", err);
    }
  }, []);

  // Check if current user has already voted
  const checkVotingStatus = useCallback(async () => {
    try {
      const contract = await getContract();
      const voted = await contract.voters(account);
      const registered = await contract.registeredVoters(account);
      setHasVoted(voted);
      setIsRegistered(registered);
    } catch (err) {
      console.error("Failed to check voting status:", err);
    }
  }, [account]);

  // Load vote counts for all candidates from the contract
  const loadVoteCounts = useCallback(async () => {
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
  }, [account]);

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
  }, [account, checkAdminStatus, checkVotingStatus, loadVoteCounts, loadElectionState]);

  // Auto-refresh results every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (account) {
        loadVoteCounts();
        loadElectionState();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [account, loadVoteCounts, loadElectionState]);


  const truncateAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const showStatus = (message, type = "success") => {
    setStatusMsg({ message, type });
    setTimeout(() => setStatusMsg(null), 4000);
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
      showStatus("Election started successfully");
    } catch (err) {
      console.error("Failed to start election:", err);
      if (err.message.includes("No candidates")) {
        showStatus("Add candidates before starting the election", "error");
      } else {
        showStatus("Failed to start election", "error");
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
      showStatus("Candidate added: " + name);
      loadVoteCounts();
    } catch (err) {
      console.error("Failed to add candidate:", err);
      if (err.message.includes("already exists")) {
        showStatus("Candidate '" + name + "' already exists", "error");
      } else if (err.message.includes("election starts")) {
        showStatus("Cannot add candidates after election has started", "error");
      } else {
        showStatus("Failed to add candidate", "error");
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
      loadVoteCounts();
      showStatus("Election ended — results are now visible");
    } catch (err) {
      console.error("Failed to end election:", err);
      if (err.message.includes("not active")) {
        showStatus("Election is not active — nothing to end", "error");
      } else {
        showStatus("Failed to end election", "error");
      }
    }
  };

  // ================================
  // REGISTER VOTER FUNCTION
  // ================================
  const registerVoter = async () => {
    if (!voterAddress) return showStatus("Enter an address", "error");
    try {
      const contract = await getContract();
      const tx = await sendTx(contract.registerVoter.bind(contract), voterAddress.trim());
      await tx.wait();
      showStatus("Voter registered: " + truncateAddress(voterAddress.trim()));
      setVoterAddress("");
    } catch (err) {
      console.error("Failed to register voter:", err);
      showStatus("Failed to register voter", "error");
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
      showStatus(`${displayCandidates[candidateId - 1] || "Candidate"} has ${votes.toString()} vote(s)`);
    } catch (err) {
      console.error("Failed to get votes:", err);
      if (err.message.includes("after election ends")) {
        showStatus("Results are only available after the election ends", "error");
      } else {
        showStatus("Failed to get votes", "error");
      }
    }
  };

  // =============================
  // VOTE FUNCTION
  // =============================
  const vote = async (candidateId) => {
    if (!account) {
      showStatus("Please connect your wallet first", "error");
      return;
    }
    if (hasVoted) {
      showStatus("You have already voted", "error");
      return;
    }

    try {
      const contract = await getContract();
      const tx = await sendTx(contract.vote.bind(contract), candidateId);
      await tx.wait();
      showStatus("Vote recorded successfully");
      loadVoteCounts();
      setHasVoted(true);
    } catch (err) {
      console.error("Voting failed:", err);
      if (err.message.includes("already voted")) {
        showStatus("You have already voted", "error");
        setHasVoted(true);
      } else if (err.message.includes("Election is not active")) {
        showStatus("Election is not active", "error");
      } else if (err.message.includes("not registered")) {
        showStatus("You are not registered to vote", "error");
      } else if (err.message.includes("Admin cannot vote")) {
        showStatus("Admin cannot vote", "error");
      } else {
        showStatus("Failed to cast vote", "error");
      }
    }
  };

  // =============================
  // CANDIDATE LIST (from contract)
  // =============================
  const displayCandidates = candidateNames.length > 0 ? candidateNames : ["Edward", "Silina", "Marvious", "Kachilenga"];

  // =============================
  // UI
  // =============================
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-6">

      {statusMsg && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
          statusMsg.type === "error"
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {statusMsg.message}
        </div>
      )}

      <header className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Blockchain Voting System
        </h1>
        <p className="text-gray-500 mt-1">Decentralized election platform powered by Ethereum</p>

        {account && (
          <div className="mt-4 flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-xs font-medium border ${electionActive
              ? "border-green-300 bg-green-50 text-green-700"
              : "border-gray-300 bg-gray-100 text-gray-500"
              }`}>
              {electionActive ? "Election Active" : "Election Not Active"}
            </span>
            <span className={`px-3 py-1 rounded text-xs font-medium border ${isAdmin
              ? "border-amber-300 bg-amber-50 text-amber-700"
              : "border-indigo-300 bg-indigo-50 text-indigo-700"
              }`}>
              {isAdmin ? "Admin" : "Voter"}
            </span>
          </div>
        )}
      </header>

      {account && isAdmin && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-4xl mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h2>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={startElection}
              disabled={electionActive}
              className={`px-4 py-2 rounded text-sm font-medium transition ${electionActive
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
                }`}
            >
              Start Election
            </button>
            <button
              onClick={endElection}
              disabled={!electionActive}
              className={`px-4 py-2 rounded text-sm font-medium transition ${!electionActive
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
                }`}
            >
              End Election
            </button>
            <div className="w-full border-t border-gray-100 my-2"></div>
            {["Edward", "Silina", "Marvious", "Kachilenga"].map((name) => (
              <button
                key={name}
                onClick={() => addCandidate(name)}
                disabled={electionActive}
                className={`px-4 py-2 rounded text-sm font-medium transition ${electionActive
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
              >
                Add {name}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Add Custom Candidate</label>
            <div className="flex gap-2 max-w-lg">
              <input
                type="text"
                placeholder="Candidate name"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                disabled={electionActive}
                className="flex-1 px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                onClick={() => {
                  if (!newCandidateName.trim()) return showStatus("Enter a candidate name", "error");
                  addCandidate(newCandidateName.trim());
                  setNewCandidateName("");
                }}
                disabled={electionActive}
                className={`px-4 py-2 rounded text-sm font-medium transition ${electionActive
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Register a Voter</label>
            <div className="flex gap-2 max-w-lg">
              <input
                type="text"
                placeholder="Wallet address (0x...)"
                value={voterAddress}
                onChange={(e) => setVoterAddress(e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={registerVoter}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition"
              >
                Register
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Only the admin wallet can add candidates and register voters
            </p>
          </div>
        </div>
      )}

      {account && !isAdmin && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-4xl mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cast Your Vote</h2>

          {!electionActive && (
            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-4">
              Election is not active yet. Please wait for the admin to start it.
            </p>
          )}

          {!isRegistered && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
              You are not registered to vote. Ask the admin to register your address.
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayCandidates.map((name, index) => (
              <button
                key={index}
                onClick={() => vote(index + 1)}
                disabled={!electionActive || hasVoted || !isRegistered}
                className={`py-3 rounded text-sm font-medium transition ${electionActive && !hasVoted && isRegistered
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                Vote for {name}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Click to vote, then confirm the transaction in MetaMask
          </p>

          <div className="mt-6 pt-5 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Check Individual Results</h3>
            {electionActive && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-3">
                Results will be available after the election ends
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {displayCandidates.map((name, index) => (
                <button
                  key={index}
                  onClick={() => getVotes(index + 1)}
                  disabled={electionActive}
                  className={`px-3 py-2 rounded text-sm font-medium transition border ${electionActive
                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                    }`}
                >
                  Check {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-4xl mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Results</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-gray-50 text-center">
            <div className="text-2xl font-bold text-gray-900">{totalVotes}</div>
            <div className="text-xs text-gray-500 mt-1">Total Votes</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 text-center">
            <div className="text-2xl font-bold text-gray-900">{displayCandidates.length}</div>
            <div className="text-xs text-gray-500 mt-1">Candidates</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 text-center">
            <div className="text-2xl font-bold text-gray-900">{leadingCandidate || "—"}</div>
            <div className="text-xs text-gray-500 mt-1">Leading</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {totalVotes > 0 ? Math.round((voteCounts[leadingCandidate] || 0) / totalVotes * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Lead %</div>
          </div>
        </div>

        <div className="space-y-3">
          {displayCandidates.map((candidate) => {
            const votes = voteCounts[candidate] || 0;
            const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
            return (
              <div key={candidate} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium text-gray-700">{candidate}</div>
                <div className="flex-1 bg-gray-100 rounded h-7 relative overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded flex items-center justify-end pr-2"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 10 && (
                      <span className="text-xs font-medium text-white">{votes}</span>
                    )}
                  </div>
                </div>
                <div className="w-14 text-right text-sm text-gray-500">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 w-full max-w-md text-center mb-10">
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded text-sm font-medium transition w-full"
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-green-700">Connected</span>
            </div>
            <p className="text-sm font-mono text-gray-500 mb-3" title={account}>
              {truncateAddress(account)}
            </p>
            {isAdmin && (
              <p className="text-sm font-medium text-amber-600 mb-2">Administrator</p>
            )}
            {!isAdmin && (
              isRegistered ? (
                <p className="text-sm text-green-600 mb-2">Registered to vote</p>
              ) : (
                <p className="text-sm text-red-500 mb-2">Not registered — admin must register you</p>
              )
            )}
            {hasVoted && (
              <p className="text-sm text-gray-500">
                You have already voted
              </p>
            )}
            <p className="text-xs text-gray-400 mt-3">
              Switch accounts in MetaMask — the app will auto-detect
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
