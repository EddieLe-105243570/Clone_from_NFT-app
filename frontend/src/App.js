// App.js
import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Shop from './components/Shop';
import TransactionHistory from './components/TransactionHistory';
import { EscrowProvider } from './components/EscrowContext';
import EscrowPanel from './components/EscrowPanel';
import LoginPage from './components/LoginPage';
import axios from 'axios';

const App = () => {
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('shop');
  const [userBalance, setUserBalance] = useState(null);
  const [studentCode, setStudentCode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch new transactions when activeTab changes to 'history'
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!studentCode || activeTab !== 'history') return;

      try {
        const res = await axios.get(`http://localhost:8000/transactions/${studentCode}`);
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

  fetchTransactions();
}, [activeTab, studentCode]);

  // Fetch items on mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:8000/merchandises');
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      }
    };

    fetchItems();
  }, []);

  // Fetch transactions when studentCode is set (after login)
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!studentCode) return;

      try {
        const res = await axios.get(`http://localhost:8000/transactions/${studentCode}`);
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, [studentCode]);

  const handleLogin = (user) => {
    setStudentCode(user.id);
    setUserBalance(user.coins);
  };

  const purchaseItem = async (item, quantity = 1, totalPrice = item.price) => {
    if (!studentCode) return;

    try {
      const res = await axios.post('http://localhost:8000/purchase', {
        id: studentCode,
        item_id: item.id,
        quantity: quantity,
        total_price: totalPrice
      });

      const newBalance = res.data.new_balance;
      setUserBalance(newBalance);

      // Optionally refetch transactions after purchase for up-to-date history
      const transRes = await axios.get(`http://localhost:8000/transactions/${studentCode}`);
      setTransactions(transRes.data);

      alert(`Successfully purchased ${quantity}x ${item.name}!`);
    } catch (err) {
      if (err.response) {
        alert(`Purchase failed: ${err.response.data.detail}`);
      } else {
        alert('Purchase failed: server error.');
      }
    }
  };

  if (!studentCode) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <EscrowProvider>
      <div className="app">
        <Header 
          studentCode={studentCode} 
          userBalance={userBalance}
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
                userBalance={userBalance}
                onPurchase={purchaseItem}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <EscrowPanel onConfirm={purchaseItem} />
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