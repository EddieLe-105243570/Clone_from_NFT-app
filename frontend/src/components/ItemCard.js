// components/ItemCard.js
import React from 'react';
import { useEscrow } from './EscrowContext';

const ItemCard = ({ item, userBalance, id }) => {
  const { startEscrow } = useEscrow();

  // ✅ Updated field names from DB
  const isOutOfStock = item.stock_status === 'Out of Stock';
const isDisabled = isOutOfStock || userBalance < item.price;


  return (
    <div className="item-card" id={id}>
      <div className="item-image">
        <img
          src={item.image_url}
          alt={item.name}
          className="item-image"
        />
      </div>
      <h3 className="item-name">{item.name}</h3>
      <div className="item-details">
        <span className="item-price">{item.price} coins</span>
        <span className="stock-info">{item.stock_quantity} left</span>
        <span className={`stock-badge ${isOutOfStock ? 'stock-out' : 'stock-available'}`}>
          {item.stock_status}
        </span>
      </div>
      <button
        onClick={() => startEscrow(item, userBalance)}
        disabled={isDisabled}
        className={`purchase-button ${isDisabled ? 'disabled' : 'available'}`}
      >
        {isOutOfStock ? 'Out of Stock' :
         userBalance < item.price ? 'Insufficient Balance' : 'Buy'}
      </button>
    </div>
  );
};

export default ItemCard;
