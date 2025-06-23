import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider } from './components/WalletContext';
import './styles/App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <WalletProvider>
    <App />
  </WalletProvider>
);
