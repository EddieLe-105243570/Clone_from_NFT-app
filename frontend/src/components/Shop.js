// Shop.js (integrated with backend + original design)
import React, { useEffect } from 'react';
import ItemCard from './ItemCard';
import SearchFilter from './SearchFilter';

const Shop = ({
  items = [],
  balance,
  onPurchase,
  selectedItem,
  setSelectedItem,
  searchTerm,
  setSearchTerm
}) => {
  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll to and highlight selected item
  useEffect(() => {
    if (selectedItem) {
      const itemElement = document.getElementById(`item-${selectedItem.id}`);
      if (itemElement) {
        itemElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        itemElement.classList.add('highlighted');
        setTimeout(() => {
          itemElement.classList.remove('highlighted');
          setSelectedItem(null);
        }, 2000);
      }
    }
  }, [selectedItem, setSelectedItem]);

  return (
    <>
      {/* 🔍 Desktop Search Bar */}
      <div className="desktop-only">
        <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* 🛍️ Shop Grid */}
      <div className="items-grid">
        {filteredItems.map(item => (
          <ItemCard
            key={item.id}
            id={`item-${item.id}`}
            item={item}
            userBalance={balance}
            onPurchase={onPurchase}
          />
        ))}
      </div>

      {/* ❌ No Results */}
      {filteredItems.length === 0 && (
        <div className="empty-state">
          <p className="empty-text">No items found.</p>
        </div>
      )}
    </>
  );
};

export default Shop;
