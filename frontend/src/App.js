// App.js (updated for backend integration)
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Shop from './components/Shop';
import TransactionHistory from './components/TransactionHistory';
// import { mockItems, mockTransactions } from './data/mockData';
import { EscrowProvider } from './components/EscrowContext';
import EscrowPanel from './components/EscrowPanel';
import LoginPage from './components/LoginPage';
import { useWallet } from './components/WalletContext';

const App = () => {
  const { balance, setBalance } = useWallet();
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('shop');
  const [studentCode, setStudentCode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePostPurchaseUpdate = (itemId, quantityPurchased) => {
  setItems(prevItems =>
    prevItems.map(item => {
      if (item.id === itemId) {
        const updatedQuantity = item.stock_quantity - quantityPurchased;
        return {
          ...item,
          stock_quantity: updatedQuantity,
          stock_status: updatedQuantity <= 0 ? 'Out of Stock' : 'Available'
        };
      }
      return item;
    })
  );
};

  const handleLogin = (code) => {
    setStudentCode(code);
    localStorage.setItem('studentCode', code);
  };

  useEffect(() => {
    const savedCode = localStorage.getItem('studentCode');
    if (savedCode) {
      setStudentCode(savedCode);
    }
  }, []);

  useEffect(() => {
    if (studentCode) {
      fetch('http://localhost:8000/items')
        .then(res => res.json())
        .then(data => setItems(data));

      fetch(`http://localhost:8000/transactions/${studentCode}`)
        .then(res => res.json())
        .then(data => setTransactions(data));

      fetch(`http://localhost:8000/wallet/${studentCode}`)
        .then(res => res.json())
        .then(data => setBalance(data.balance));
    }
  }, [studentCode, setBalance]);

  const purchaseItem = (item, quantity = 1, totalPrice = item.price) => {
    if (item.stock_status !== 'Out of Stock' && balance >= totalPrice) {
      fetch("http://localhost:8000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_code: studentCode,
          item_name: item.name,
          quantity,
          price: totalPrice,
          status: "Completed",
        }),
      });

      fetch(`http://localhost:8000/wallet/debit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_code: studentCode, amount: totalPrice })
      })
        .then(res => res.json())
        .then(data => setBalance(data.new_balance));

      const newTransaction = {
        id: transactions.length + 1,
        itemName: item.name,
        quantity,
        price: totalPrice,
        date: new Date().toISOString().split("T")[0],
        status: "Completed",
      };
      setTransactions((prev) => [newTransaction, ...prev]);
      alert(`Successfully purchased ${quantity}x ${item.name}!`);
    } else {
      alert("Purchase failed: out of stock or insufficient balance.");
    }
  };

  if (!studentCode) {
  return (
    <div className="app">
      <LoginPage onLogin={handleLogin} />
    </div>
  );
}

return (
    <EscrowProvider>
      <div className="app">
        <Header 
          studentCode={studentCode} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          items={items}
          onItemSelect={setSelectedItem}
        />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="container main-content">
          {activeTab === 'shop' && (
            <>
              <Shop
                items={items}
                balance={balance}
                onPurchase={purchaseItem}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <EscrowPanel
                onConfirm={(item, quantity, totalPrice) => {
                  purchaseItem(item, quantity, totalPrice);
                  handlePostPurchaseUpdate(item.id, quantity);
                }}
              />

            </>
          )}
          {activeTab === 'history' && (
            <TransactionHistory transactions={transactions} />
          )}
        </main>
      </div>
    </EscrowProvider>
);
};

export default App;
