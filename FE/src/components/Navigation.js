// components/Navigation.js
import React from 'react';
import { ShoppingCart, Clock } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navigation">
      <div className="container">
        <div className="nav-tabs">
          <button
            onClick={() => setActiveTab('shop')}
            className={`nav-tab ${activeTab === 'shop' ? 'active' : 'inactive'}`}
          >
            <ShoppingCart className="nav-icon" />
            Shop
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`nav-tab ${activeTab === 'history' ? 'active' : 'inactive'}`}
          >
            <Clock className="nav-icon" />
            Transaction History
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;