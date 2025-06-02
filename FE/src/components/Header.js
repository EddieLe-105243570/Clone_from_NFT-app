// components/Header.js
import React from 'react';
import { User } from 'lucide-react';

const Header = ({ userBalance, studentCode }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <img 
            src="/images/SwinLogo.png" 
            alt="Swinburne Shop" 
            className="header-logo"
          />
          <div className="header-user-info">
            <div className="student-code">
              <span className="student-code-label">Student ID: </span>
              <span className="student-code-text">{studentCode}</span>
            </div>
            <div className="balance-display">
              <img 
                src="/images/Coin-removebg.png" 
                alt="Coin Icon" 
                className="balance-icon"
                style={{ width: '24px', height: '24px', verticalAlign: 'middle' }}
              />
              <span className="balance-text">{userBalance} coins</span>
            </div>
            <User className="user-icon" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;