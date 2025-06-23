// WalletContext.js (updated for backend integration)
import React, { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children, studentCode }) => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (studentCode) {
      fetch(`http://localhost:8000/wallet/${studentCode}`)
        .then(res => res.json())
        .then(data => {
          if (data.balance !== undefined) {
            setBalance(data.balance);
          }
        })
        .catch(err => console.error("Failed to fetch wallet:", err));
    }
  }, [studentCode]);

  const debit = (amount) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  return (
    <WalletContext.Provider value={{ balance, setBalance, debit }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
