export default function Navbar({ account, connectWallet }) {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">
        DAO Voting DApp
      </h1>

      {account ? (
        <p className="bg-green-600 px-3 py-1 rounded">
          {account.slice(0,6)}...{account.slice(-4)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
}