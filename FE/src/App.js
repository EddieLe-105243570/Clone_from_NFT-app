// App.js
import React, { useState } from 'react';
import './styles/App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Shop from './components/Shop';
import TransactionHistory from './components/TransactionHistory';
import { mockItems, mockTransactions } from './data/mockData';

const App = () => {
  const [items] = useState(mockItems);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [activeTab, setActiveTab] = useState('shop');
  const [userBalance, setUserBalance] = useState(500);
  const [studentCode] = useState('SWH00xxxx');

  const purchaseItem = (item) => {
    if (userBalance >= item.price) {
      // Update balance
      setUserBalance(prev => prev - item.price);
      
      // Add to transaction history
      const newTransaction = {
        id: transactions.length + 1,
        itemName: item.name,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      alert(`Successfully purchased ${item.name}!`);
    } else if (item.stock === 'Out of Stock') {
      alert('Item is out of stock!');
    } else {
      alert('Insufficient balance!');
    }
  };

  return (
    <div className="app">
      <Header studentCode={studentCode} userBalance={userBalance} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container main-content">
        {activeTab === 'shop' && (
          <Shop 
            items={items}
            userBalance={userBalance}
            onPurchase={purchaseItem}
          />
        )}
        
        {activeTab === 'history' && (
          <TransactionHistory transactions={transactions} />
        )}
      </main>
    </div>
  );
};

export default App;