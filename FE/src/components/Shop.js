// components/Shop.js
import React, { useState } from 'react';
import SearchFilter from './SearchFilter';
import ItemCard from './ItemCard';

const Shop = ({ items, userBalance, onPurchase }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="items-grid">
        {filteredItems.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            userBalance={userBalance}
            onPurchase={onPurchase}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <p className="empty-text">No items found matching your criteria.</p>
        </div>
      )}
    </>
  );
};

export default Shop;