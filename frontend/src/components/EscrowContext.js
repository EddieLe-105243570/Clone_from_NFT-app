// components/EscrowContext.js
import React, { createContext, useContext, useState } from 'react';

const EscrowContext = createContext();
export const useEscrow = () => useContext(EscrowContext);

export const EscrowProvider = ({ children }) => {
  const [escrow, setEscrow] = useState(null);

  const startEscrow = (item, buyerBalance) => {
    setEscrow({ item, buyerBalance, quantity: 1, status: 'PENDING' });
  };

  const updateQuantity = (qty) => {
    setEscrow(prev => ({
      ...prev,
      quantity: qty
    }));
  };

  const confirmEscrow = () => {
    if (escrow?.status === 'PENDING') {
      setEscrow(prev => ({ ...prev, status: 'COMPLETED' }));
    }
  };

  const cancelEscrow = () => {
    setEscrow(null);
  };

  return (
    <EscrowContext.Provider value={{ escrow, startEscrow, updateQuantity, confirmEscrow, cancelEscrow }}>
      {children}
    </EscrowContext.Provider>
  );
};
