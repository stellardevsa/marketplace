import { useState } from 'react';
import {
  StellarWalletsKit,
  WalletNetwork,
  xBullModule,
  FreighterModule,
  XBULL_ID
} from '@creit.tech/stellar-wallets-kit';
import { Horizon, Networks } from '@stellar/stellar-sdk';
import WalletConnector from './components/WalletConnector';
import ProductList from './components/ProductList';
import TransactionHistory from './components/TransactionHistory';
import SellerDashboard from './components/SellerDashboard';
import Cart from './components/Cart';
import './App.css';

// Initialize the wallet kit (this connects to different wallet types)
const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: XBULL_ID,
  modules: [
    new xBullModule(),
    new FreighterModule()
  ],
});

// Initialize connection to Stellar testnet
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

function App() {
  const [publicKey, setPublicKey] = useState(null);
  const [status, setStatus] = useState('');

  const handleConnect = async (walletId) => {
    try {
      await kit.setWallet(walletId);
      const { address } = await kit.getAddress();
      setPublicKey(address);
      setStatus(`Connected with public key: ${address.slice(0, 6)}...`);
    } catch (error) {
      console.error('Connection failed:', error);
      setStatus('Failed to connect wallet.');
    }
  };

  return (
    <div className="app">
      <h1>Stellar Market</h1>
      <WalletConnector onConnect={handleConnect} />
      <p>{status}</p>

      {publicKey && (
        <ProductList
          publicKey={publicKey}
          kit={kit}
          server={server}
          setStatus={setStatus}
        />
      )}

      {publicKey && (
        <SellerDashboard
          publicKey={publicKey}
          server={server}
        />
      )}

      {publicKey && (
        <TransactionHistory
          publicKey={publicKey}
          server={server}
        />
      )}

      {publicKey && (
        <Cart
          publicKey={publicKey}
          kit={kit}
          server={server}
          setStatus={setStatus}
        />
      )}

      <p className="note">
        Need test XLM? Use{' '}
        <a
          href="https://friendbot.stellar.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Friendbot
        </a>.
      </p>
    </div>
  );
}

export default App;