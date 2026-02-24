// import Home from "./pages/Home";
// // import Navbar from "./components/Navbar";

// function App() {
//   return (
//     <div>
//       {/* <Navbar /> */}
//       <Home />
//     </div>
//   );
// }

// export default App;










import { useState } from "react";
import { getContract } from "./blockchain/Voting";

function App() {
  const [account, setAccount] = useState("");

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

  const vote = async () => {
    const contract = await getContract();

    const tx = await contract.vote("Edward"); // vote for candidate 0

    await tx.wait();

    alert("Vote submitted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white flex flex-col items-center justify-center p-4">
      
      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10 text-center">
        🗳 Blockchain Voting System
      </h1>

      {/* WALLET CARD */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md text-center mb-8">
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition w-full"
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <p className="text-green-400 mb-2">Wallet Connected ✅</p>
            <p className="text-sm break-all font-mono">{account}</p>
          </div>
        )}
      </div>

      {/* VOTING CARD */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>
        <button 
          onClick={vote} 
          disabled={!account}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition ${
            account 
              ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer" 
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Vote for Candidate 1
        </button>
      </div>

    </div>
  );
}

export default App;