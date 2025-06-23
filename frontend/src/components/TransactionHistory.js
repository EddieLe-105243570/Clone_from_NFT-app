// components/TransactionHistory.js
import React from 'react';

const TransactionHistory = ({ transactions = [] }) => {
  return (
    <div className="transaction-history">
      <div className="transaction-header">
        <h2 className="transaction-title">Transaction History</h2>
      </div>

      <div className="transaction-table-container">
        <table className="transaction-table">
          <thead className="table-header">
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="table-row">
                  <td className="table-cell item-name">{tx.item_name || tx.itemName}</td>
                  <td className="table-cell quantity">{tx.quantity}</td>
                  <td className="table-cell price">{tx.price} coins</td>
                  <td className="table-cell date">{tx.date}</td>
                  <td className="table-cell">
                    <span className={`status-badge ${tx.status?.toLowerCase()}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <p className="empty-text">No transactions yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
