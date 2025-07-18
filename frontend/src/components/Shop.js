// components/Shop.js
import React, { useEffect } from 'react';
import ItemCard from './ItemCard';
import SearchFilter from './SearchFilter'; // 🔍 Import SearchFilter

const Shop = ({ 
  items, userBalance, onPurchase, 
  selectedItem, setSelectedItem,
  searchTerm, setSearchTerm
}) => {

  // Filter the items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* Desktop Search Filter - hidden on mobile */}
      <div className="desktop-only">
        <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className="items-grid">
        {filteredItems.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            userBalance={userBalance}
            onPurchase={onPurchase}
            id={`item-${item.id}`}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <p className="empty-text">No items found.</p>
        </div>
      )}
    </>
  );
};

export default Shop;