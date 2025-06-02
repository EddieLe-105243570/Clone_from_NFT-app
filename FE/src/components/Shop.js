// components/Shop.js
import React, { useEffect } from 'react';
import ItemCard from './ItemCard';

const Shop = ({ items, userBalance, onPurchase, selectedItem, setSelectedItem }) => {
  // Scroll to selected item when it changes
  useEffect(() => {
    if (selectedItem) {
      const itemElement = document.getElementById(`item-${selectedItem.id}`);
      if (itemElement) {
        itemElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        // Add highlight effect
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
      <div className="items-grid">
        {items.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            userBalance={userBalance}
            onPurchase={onPurchase}
            id={`item-${item.id}`}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <p className="empty-text">No items available.</p>
        </div>
      )}
    </>
  );
};

export default Shop;