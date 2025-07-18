// components/TransactionHistory.js
import React from 'react';

const TransactionHistory = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-text">No transactions yet.</p>
      </div>
    );
  }

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
            {transactions.map(transaction => (
              <tr key={transaction.id} className="table-row">
                <td className="table-cell item-name">{transaction.item_name}</td>
                <td className="table-cell quantity">{transaction.quantity}</td>
                <td className="table-cell price">{transaction.total_price}
                  <img 
                    src="/images/Coin-removebg.png" 
                    alt="coin" 
                    style={{
                      width: '22px',
                      height: '22px',
                      marginLeft: '4px',
                      verticalAlign: 'middle'
                  }}
                 /></td>
                <td className="table-cell date">{transaction.date}</td>
                <td className="table-cell">
                  <span className="status-badge">{transaction.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;