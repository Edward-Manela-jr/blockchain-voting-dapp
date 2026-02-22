import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [account, setAccount] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  }

  return (
    <div>
      <Navbar account={account} connectWallet={connectWallet} />

      <div className="p-10">
        <h2 className="text-3xl font-bold">
          Welcome to Blockchain Voting System
        </h2>
      </div>
    </div>
  );
}