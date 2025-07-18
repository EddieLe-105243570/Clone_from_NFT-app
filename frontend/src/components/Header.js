// components/Header.js
import React, { useState, useEffect } from 'react';
import { User, X, Search, ShoppingCart, Clock } from 'lucide-react';

const Header = ({ userBalance, studentCode, activeTab, setActiveTab, items = [], onItemSelect }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when screen becomes desktop size
  useEffect(() => {
    if (!isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchTerm('');
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      closeSidebar();
    }
  };

  const handleItemClick = (item) => {
    onItemSelect(item);
    setActiveTab('shop');
    setIsSearchOpen(false);
    setSearchTerm('');
    if (isMobile) {
      closeSidebar();
    }
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            {/* Desktop Header Content */}
            <div className="desktop-header">
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
                  />
                  <span className="balance-text">{userBalance} coins</span>
                </div>
              </div>
            </div>

            {/* Mobile Header Content */}
            <div className="mobile-header">
              <div className="mobile-header-content">
                {/* Mobile Balance Display */}
                <div className="mobile-balance-display">
                  <img 
                    src="/images/Coin-removebg.png" 
                    alt="Coin Icon" 
                    className="balance-icon"
                  />
                  <span className="balance-text">{userBalance} coins</span>
                </div>
                
                {!isSidebarOpen && (
                  <User 
                    className="mobile-user-icon" 
                    onClick={toggleSidebar}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {/* Overlay */}
          <div 
            className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <img 
                src="/images/SwinLogo.png" 
                alt="Swinburne Shop" 
                className="sidebar-logo"
              />
              <button 
                className="sidebar-close-btn"
                onClick={closeSidebar}
              >
                <X className="close-icon" />
              </button>
            </div>
            
            <div className="sidebar-content">
              <div className="sidebar-student-info">
                <div className="sidebar-student-code">
                  <span className="student-code-label">Student ID: </span>
                  <span className="student-code-text">{studentCode}</span>
                </div>
              </div>

              {/* Navigation in Sidebar */}
              <div className="sidebar-navigation">
                <button
                  onClick={() => handleNavClick('shop')}
                  className={`sidebar-nav-item ${activeTab === 'shop' ? 'active' : ''}`}
                >
                  <ShoppingCart className="sidebar-nav-icon" />
                  Shop
                </button>
                <button
                  onClick={() => handleNavClick('history')}
                  className={`sidebar-nav-item ${activeTab === 'history' ? 'active' : ''}`}
                >
                  <Clock className="sidebar-nav-icon" />
                  Transaction History
                </button>
              </div>

              {/* Search in Sidebar */}
              <div className="sidebar-search">
                <button
                  onClick={toggleSearch}
                  className={`sidebar-search-toggle ${isSearchOpen ? 'active' : ''}`}
                >
                  <Search className="sidebar-nav-icon" />
                  Search
                </button>
                
                {/* Search Dropdown */}
                {isSearchOpen && (
                  <div className="search-dropdown">
                    <div className="search-input-container">
                      <Search className="search-dropdown-icon" />
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-dropdown-input"
                        autoFocus
                      />
                    </div>
                    
                    {searchTerm && (
                      <div className="search-results">
                        {filteredItems.length > 0 ? (
                          filteredItems.map(item => (
                            <div
                              key={item.id}
                              className="search-result-item"
                              onClick={() => handleItemClick(item)}
                            >
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="search-result-image"
                              />
                              <div className="search-result-info">
                                <span className="search-result-name">{item.name}</span>
                                <span className="search-result-price">{item.price} coins</span>
                              </div>
                              <span className={`search-result-stock ${item.stock === 'Available' ? 'available' : 'out-of-stock'}`}>
                                {item.stock}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="search-no-results">
                            No items found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;