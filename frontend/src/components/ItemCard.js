// components/ItemCard.js
import React from 'react';
import { useEscrow } from './EscrowContext';

const ItemCard = ({ item, userBalance, id }) => {
  const { startEscrow } = useEscrow();

  const isOutOfStock = item.stock === 'Out of Stock';
  const isDisabled = isOutOfStock || userBalance < item.price;

  return (
    <div className="item-card" id={id}>
      <div className="item-image">
        <img src={item.image} alt={item.name} />
      </div>
      <h3 className="item-name">{item.name}</h3>
      <div className="item-details">
        <span className="item-price">{item.price} coins</span>
        {/* <span className={`stock-badge ${item.stock === 'Available' ? 'stock-available' : 'stock-out'}`}>
          {item.stock}
        </span> */}
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
