import { useState } from "react";
import { getContract } from "./blockchain/Voting";

function App() {
  const [account, setAccount] = useState("");

  // Assignment participants (candidates)
  const candidates = [
    "Edward",
    "Silina",
    "Marvieous",
    "Kachilenga"
  ];

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
    } catch (err) {
      console.error(err);
      alert("❌ Voting failed");
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
            <p className="text-sm break-all font-mono">
              {account}
            </p>
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

            <button
              onClick={() => vote(candidate)}
              disabled={!account}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                account
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Vote
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default App;