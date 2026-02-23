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
    <div>
      <h1>Blockchain Voting System</h1>

      <button onClick={connectWallet}>
        Connect Wallet
      </button>

      <p>{account}</p>

      <button onClick={vote} disabled={!account}>
        Vote Candidate 1
      </button>
    </div>
  );
}

export default App;