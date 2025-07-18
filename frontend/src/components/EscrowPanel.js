// components/EscrowPanel.js
import React from 'react';
import { useEscrow } from './EscrowContext';

const EscrowPanel = ({ onConfirm }) => {
  const { escrow, updateQuantity, confirmEscrow, cancelEscrow } = useEscrow();

  if (!escrow) return null;

  const maxAffordable = Math.floor(escrow.buyerBalance / escrow.item.price);

  const handleQuantityChange = (e) => {
    const qty = Math.max(1, Math.min(maxAffordable, parseInt(e.target.value) || 1));
    updateQuantity(qty);
  };

  const totalPrice = escrow.item.price * escrow.quantity;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('escrow-modal-overlay')) {
      cancelEscrow();
    }
  };

  return (
    <div className="escrow-modal-overlay" onClick={handleOverlayClick}>
      <div className="escrow-modal">
        <h4>Confirm Purchase</h4>
        <p><strong>{escrow.item.name}</strong></p>
        <div className="escrow-image-wrapper">
          <img src={escrow.item.image} alt={escrow.item.name} className="escrow-image" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <label htmlFor="quantity">Quantity:&nbsp;</label>
          <input
            id="quantity"
            type="number"
            min="1"
            max={maxAffordable}
            value={escrow.quantity}
            onChange={handleQuantityChange}
            style={{
              width: '60px',
              padding: '0.25rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              textAlign: 'center'
            }}
          />
        </div>

        <p>Total: {totalPrice} School Coins</p>
        <p>Status: {escrow.status}</p>

        {escrow.status === 'PENDING' && (
          <div className="escrow-modal-buttons">
            <button className="confirm" onClick={() => {
              confirmEscrow();
              onConfirm(escrow.item, escrow.quantity, totalPrice);
            }}>
              Confirm
            </button>
            <button className="cancel" onClick={cancelEscrow}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscrowPanel;
