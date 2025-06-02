// components/TransactionHistory.js
import React from 'react';

const TransactionHistory = ({ transactions }) => {
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
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {transactions.map(transaction => (
              <tr key={transaction.id} className="table-row">
                <td className="table-cell item-name">
                  {transaction.itemName}
                </td>
                <td className="table-cell date">
                  {transaction.date}
                </td>
                <td className="table-cell">
                  <span className="status-badge">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {transactions.length === 0 && (
        <div className="empty-state">
          <p className="empty-text">No transactions yet.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;